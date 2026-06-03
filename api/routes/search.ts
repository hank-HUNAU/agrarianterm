import { Router, type Request, type Response } from 'express'
import { getDb, queryAll } from '../db.js'

const router = Router()

// 解析JSON字段的辅助函数
function parseJsonFields(annotation: Record<string, unknown>): Record<string, unknown> {
  const result = { ...annotation }
  for (const field of ['semantics', 'context_dim', 'translation']) {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = JSON.parse(result[field] as string)
      } catch {
        // 保持原值
      }
    }
  }
  return result
}

// GET /api/search - 搜索术语
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { q = '', category, page = '1', size = '20' } = req.query
    const pageNum = Math.max(parseInt(page as string) || 1, 1)
    const sizeNum = Math.min(Math.max(parseInt(size as string) || 20, 1), 100)
    const offset = (pageNum - 1) * sizeNum

    let annotations = queryAll(db, 'SELECT a.*, t.segment, t.project_id FROM term_annotations a LEFT JOIN annotation_tasks t ON a.task_id = t.id')

    // 按术语文本模糊搜索
    if (q) {
      const keyword = (q as string).toLowerCase()
      annotations = annotations.filter(a =>
        (a.term_text as string).includes(keyword) ||
        (a.modern_def as string || '').includes(keyword) ||
        (a.english_equiv as string || '').includes(keyword) ||
        (a.note as string || '').includes(keyword)
      )
    }

    // 按类别筛选
    if (category) {
      annotations = annotations.filter(a => a.category === category)
    }

    const total = annotations.length
    const paged = annotations.slice(offset, offset + sizeNum).map(parseJsonFields)

    res.json({
      success: true,
      data: {
        items: paged,
        total,
        page: pageNum,
        size: sizeNum,
        totalPages: Math.ceil(total / sizeNum),
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
