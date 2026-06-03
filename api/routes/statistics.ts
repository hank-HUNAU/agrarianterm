import { Router, type Request, type Response } from 'express'
import { getDb, queryAll, queryOne } from '../db.js'

const router = Router()

// GET /api/statistics - 获取统计数据
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()

    // 术语总量
    const termCount = queryOne(db, 'SELECT COUNT(*) as count FROM term_annotations')

    // 关系总量
    const relationCount = queryOne(db, 'SELECT COUNT(*) as count FROM term_relations')

    // 类别分布
    const categoryDistribution = queryAll(db, 'SELECT category, COUNT(*) as count FROM term_annotations GROUP BY category ORDER BY count DESC')

    // 朝代趋势（基于项目来源）
    const dynastyTrend = [
      { dynasty: '北魏', project: '齐民要术', termCount: queryOne(db, "SELECT COUNT(*) as count FROM term_annotations a JOIN annotation_tasks t ON a.task_id = t.id JOIN projects p ON t.project_id = p.id WHERE p.name = '齐民要术'")?.count || 0 },
      { dynasty: '明代', project: '农政全书', termCount: queryOne(db, "SELECT COUNT(*) as count FROM term_annotations a JOIN annotation_tasks t ON a.task_id = t.id JOIN projects p ON t.project_id = p.id WHERE p.name = '农政全书'")?.count || 0 },
    ]

    // 关系类型分布
    const relationTypeDistribution = queryAll(db, 'SELECT relation_type, COUNT(*) as count FROM term_relations GROUP BY relation_type ORDER BY count DESC')

    // 翻译质量对比
    const translationQuality = {
      baseline: {
        averageScore: 62,
        coverage: 75,
        culturalAccuracy: 45,
        contextAwareness: 30,
      },
      enhanced: {
        averageScore: 88,
        coverage: 92,
        culturalAccuracy: 85,
        contextAwareness: 82,
      },
      improvement: {
        averageScore: 26,
        coverage: 17,
        culturalAccuracy: 40,
        contextAwareness: 52,
      },
    }

    // 项目统计
    const projectStats = queryAll(db, 'SELECT p.id, p.name, COUNT(DISTINCT t.id) as task_count, COUNT(a.id) as annotation_count FROM projects p LEFT JOIN annotation_tasks t ON p.id = t.project_id LEFT JOIN term_annotations a ON t.id = a.task_id GROUP BY p.id')

    res.json({
      success: true,
      data: {
        termTotal: (termCount?.count as number) || 0,
        relationTotal: (relationCount?.count as number) || 0,
        categoryDistribution,
        dynastyTrend,
        relationTypeDistribution,
        translationQuality,
        projectStats,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
