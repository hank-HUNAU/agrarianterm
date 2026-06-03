import { Router, type Request, type Response } from 'express'
import { getDb, queryAll, queryOne, run } from '../db.js'

const router = Router()

// GET /api/relations - 获取关系列表
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { termId } = req.query
    let relations: Record<string, unknown>[]
    if (termId) {
      relations = queryAll(db, 'SELECT r.*, s.term_text as source_term, t.term_text as target_term FROM term_relations r LEFT JOIN term_annotations s ON r.source_term_id = s.id LEFT JOIN term_annotations t ON r.target_term_id = t.id WHERE r.source_term_id = ? OR r.target_term_id = ?', [termId as string, termId as string])
    } else {
      relations = queryAll(db, 'SELECT r.*, s.term_text as source_term, t.term_text as target_term FROM term_relations r LEFT JOIN term_annotations s ON r.source_term_id = s.id LEFT JOIN term_annotations t ON r.target_term_id = t.id ORDER BY r.id')
    }
    res.json({ success: true, data: relations })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// POST /api/relations - 创建关系
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { source_term_id, target_term_id, relation_type, confidence } = req.body
    if (!source_term_id || !target_term_id || !relation_type) {
      res.status(400).json({ success: false, error: 'source_term_id、target_term_id、relation_type 不能为空' })
      return
    }
    const source = queryOne(db, 'SELECT * FROM term_annotations WHERE id = ?', [source_term_id])
    const target = queryOne(db, 'SELECT * FROM term_annotations WHERE id = ?', [target_term_id])
    if (!source || !target) {
      res.status(400).json({ success: false, error: '源术语或目标术语不存在' })
      return
    }
    db.run('INSERT INTO term_relations (source_term_id, target_term_id, relation_type, confidence) VALUES (?, ?, ?, ?)', [
      source_term_id, target_term_id, relation_type, confidence ?? 1.0,
    ])
    const result = queryOne(db, 'SELECT r.*, s.term_text as source_term, t.term_text as target_term FROM term_relations r LEFT JOIN term_annotations s ON r.source_term_id = s.id LEFT JOIN term_annotations t ON r.target_term_id = t.id WHERE r.id = (SELECT MAX(id) FROM term_relations)')
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// DELETE /api/relations/:id - 删除关系
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const existing = queryOne(db, 'SELECT * FROM term_relations WHERE id = ?', [req.params.id])
    if (!existing) {
      res.status(404).json({ success: false, error: '关系不存在' })
      return
    }
    run(db, 'DELETE FROM term_relations WHERE id = ?', [req.params.id])
    res.json({ success: true, data: null })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
