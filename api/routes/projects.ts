import { Router, type Request, type Response } from 'express'
import { getDb, queryAll, queryOne, run } from '../db.js'

const router = Router()

// GET /api/projects - 获取项目列表
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const projects = queryAll(db, 'SELECT * FROM projects ORDER BY created_at DESC')
    res.json({ success: true, data: projects })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// GET /api/projects/:id - 获取项目详情
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const project = queryOne(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id])
    if (!project) {
      res.status(404).json({ success: false, error: '项目不存在' })
      return
    }
    // 获取关联的任务统计
    const taskStats = queryOne(db, 'SELECT COUNT(*) as total, SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed FROM annotation_tasks WHERE project_id = ?', [req.params.id])
    res.json({ success: true, data: { ...project, taskStats } })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// POST /api/projects - 创建项目
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { name, description, source_text, status } = req.body
    if (!name) {
      res.status(400).json({ success: false, error: '项目名称不能为空' })
      return
    }
    db.run('INSERT INTO projects (name, description, source_text, status) VALUES (?, ?, ?, ?)', [name, description || null, source_text || null, status || 'draft'])
    const result = queryOne(db, 'SELECT * FROM projects ORDER BY id DESC LIMIT 1')
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// PUT /api/projects/:id - 更新项目
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const existing = queryOne(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id])
    if (!existing) {
      res.status(404).json({ success: false, error: '项目不存在' })
      return
    }
    const { name, description, source_text, status } = req.body
    db.run('UPDATE projects SET name = ?, description = ?, source_text = ?, status = ? WHERE id = ?', [
      name ?? existing.name,
      description ?? existing.description,
      source_text ?? existing.source_text,
      status ?? existing.status,
      req.params.id,
    ])
    const updated = queryOne(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id])
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// DELETE /api/projects/:id - 删除项目
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const existing = queryOne(db, 'SELECT * FROM projects WHERE id = ?', [req.params.id])
    if (!existing) {
      res.status(404).json({ success: false, error: '项目不存在' })
      return
    }
    // 删除关联数据
    const taskIds = queryAll(db, 'SELECT id FROM annotation_tasks WHERE project_id = ?', [req.params.id]).map(t => t.id)
    for (const taskId of taskIds) {
      const annotationIds = queryAll(db, 'SELECT id FROM term_annotations WHERE task_id = ?', [taskId]).map(a => a.id)
      for (const annId of annotationIds) {
        run(db, 'DELETE FROM term_relations WHERE source_term_id = ? OR target_term_id = ?', [annId, annId])
      }
      run(db, 'DELETE FROM term_annotations WHERE task_id = ?', [taskId])
    }
    run(db, 'DELETE FROM annotation_tasks WHERE project_id = ?', [req.params.id])
    run(db, 'DELETE FROM projects WHERE id = ?', [req.params.id])
    res.json({ success: true, data: null })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
