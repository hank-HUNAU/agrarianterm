import { Router, type Request, type Response } from 'express'
import { getDb, queryAll, queryOne, run } from '../db.js'

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

// GET /api/annotations - 获取标注列表
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { taskId } = req.query
    let annotations: Record<string, unknown>[]
    if (taskId) {
      annotations = queryAll(db, 'SELECT * FROM term_annotations WHERE task_id = ? ORDER BY start_pos', [taskId as string])
    } else {
      annotations = queryAll(db, 'SELECT * FROM term_annotations ORDER BY id')
    }
    res.json({ success: true, data: annotations.map(parseJsonFields) })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// GET /api/annotations/:id - 获取标注详情
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const annotation = queryOne(db, 'SELECT * FROM term_annotations WHERE id = ?', [req.params.id])
    if (!annotation) {
      res.status(404).json({ success: false, error: '标注不存在' })
      return
    }
    // 获取关联的关系
    const relations = queryAll(db, 'SELECT * FROM term_relations WHERE source_term_id = ? OR target_term_id = ?', [req.params.id, req.params.id])
    res.json({ success: true, data: { ...parseJsonFields(annotation), relations } })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// POST /api/annotations - 创建标注
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note } = req.body
    if (!task_id || !term_text || start_pos === undefined || end_pos === undefined) {
      res.status(400).json({ success: false, error: 'task_id、term_text、start_pos、end_pos 不能为空' })
      return
    }
    const task = queryOne(db, 'SELECT * FROM annotation_tasks WHERE id = ?', [task_id])
    if (!task) {
      res.status(400).json({ success: false, error: '任务不存在' })
      return
    }
    db.run('INSERT INTO term_annotations (task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      task_id, term_text, start_pos, end_pos,
      category || null,
      semantics ? JSON.stringify(semantics) : null,
      context_dim ? JSON.stringify(context_dim) : null,
      translation ? JSON.stringify(translation) : null,
      modern_def || null,
      english_equiv || null,
      note || null,
    ])
    const result = queryOne(db, 'SELECT * FROM term_annotations ORDER BY id DESC LIMIT 1')
    res.status(201).json({ success: true, data: parseJsonFields(result!) })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// PUT /api/annotations/:id - 更新标注
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const existing = queryOne(db, 'SELECT * FROM term_annotations WHERE id = ?', [req.params.id])
    if (!existing) {
      res.status(404).json({ success: false, error: '标注不存在' })
      return
    }
    const { term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note } = req.body
    db.run('UPDATE term_annotations SET term_text = ?, start_pos = ?, end_pos = ?, category = ?, semantics = ?, context_dim = ?, translation = ?, modern_def = ?, english_equiv = ?, note = ? WHERE id = ?', [
      term_text ?? existing.term_text,
      start_pos ?? existing.start_pos,
      end_pos ?? existing.end_pos,
      category ?? existing.category,
      semantics ? JSON.stringify(semantics) : existing.semantics,
      context_dim ? JSON.stringify(context_dim) : existing.context_dim,
      translation ? JSON.stringify(translation) : existing.translation,
      modern_def ?? existing.modern_def,
      english_equiv ?? existing.english_equiv,
      note ?? existing.note,
      req.params.id,
    ])
    const updated = queryOne(db, 'SELECT * FROM term_annotations WHERE id = ?', [req.params.id])
    res.json({ success: true, data: parseJsonFields(updated!) })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// DELETE /api/annotations/:id - 删除标注
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const existing = queryOne(db, 'SELECT * FROM term_annotations WHERE id = ?', [req.params.id])
    if (!existing) {
      res.status(404).json({ success: false, error: '标注不存在' })
      return
    }
    run(db, 'DELETE FROM term_relations WHERE source_term_id = ? OR target_term_id = ?', [req.params.id, req.params.id])
    run(db, 'DELETE FROM term_annotations WHERE id = ?', [req.params.id])
    res.json({ success: true, data: null })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
