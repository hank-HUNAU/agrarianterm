import { Router, type Request, type Response } from 'express'
import { getDb, queryAll, queryOne, run } from '../db.js'

const router = Router()

// GET /api/tasks - 获取任务列表
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { projectId } = req.query
    let tasks: Record<string, unknown>[]
    if (projectId) {
      tasks = queryAll(db, 'SELECT * FROM annotation_tasks WHERE project_id = ? ORDER BY segment_index', [projectId as string])
    } else {
      tasks = queryAll(db, 'SELECT * FROM annotation_tasks ORDER BY project_id, segment_index')
    }
    res.json({ success: true, data: tasks })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// GET /api/tasks/:id - 获取任务详情
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const task = queryOne(db, 'SELECT * FROM annotation_tasks WHERE id = ?', [req.params.id])
    if (!task) {
      res.status(404).json({ success: false, error: '任务不存在' })
      return
    }
    // 获取关联的标注
    const annotations = queryAll(db, 'SELECT * FROM term_annotations WHERE task_id = ?', [req.params.id])
    res.json({ success: true, data: { ...task, annotations } })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// POST /api/tasks - 创建任务
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { project_id, annotator_id, segment, segment_index, status } = req.body
    if (!project_id || !segment) {
      res.status(400).json({ success: false, error: '项目ID和段落内容不能为空' })
      return
    }
    const project = queryOne(db, 'SELECT * FROM projects WHERE id = ?', [project_id])
    if (!project) {
      res.status(400).json({ success: false, error: '项目不存在' })
      return
    }
    db.run('INSERT INTO annotation_tasks (project_id, annotator_id, segment, segment_index, status) VALUES (?, ?, ?, ?, ?)', [
      project_id, annotator_id || 1, segment, segment_index || 0, status || 'pending',
    ])
    const result = queryOne(db, 'SELECT * FROM annotation_tasks ORDER BY id DESC LIMIT 1')
    res.status(201).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

// PUT /api/tasks/:id - 更新任务状态
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const existing = queryOne(db, 'SELECT * FROM annotation_tasks WHERE id = ?', [req.params.id])
    if (!existing) {
      res.status(404).json({ success: false, error: '任务不存在' })
      return
    }
    const { status, segment, segment_index, annotator_id } = req.body
    db.run('UPDATE annotation_tasks SET status = ?, segment = ?, segment_index = ?, annotator_id = ? WHERE id = ?', [
      status ?? existing.status,
      segment ?? existing.segment,
      segment_index ?? existing.segment_index,
      annotator_id ?? existing.annotator_id,
      req.params.id,
    ])
    const updated = queryOne(db, 'SELECT * FROM annotation_tasks WHERE id = ?', [req.params.id])
    res.json({ success: true, data: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
