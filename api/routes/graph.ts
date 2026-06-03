import { Router, type Request, type Response } from 'express'
import { getDb, queryAll } from '../db.js'

const router = Router()

interface GraphNode {
  id: number
  term_text: string
  category: string
  modern_def: string
  english_equiv: string
}

interface GraphEdge {
  id: number
  source: number
  target: number
  relation_type: string
  confidence: number
}

// GET /api/graph - 获取知识图谱数据
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = await getDb()
    const { centerTerm, depth = '2', category } = req.query
    const maxDepth = Math.min(parseInt(depth as string) || 2, 3)

    let annotations = queryAll(db, 'SELECT * FROM term_annotations')

    // 按类别筛选
    if (category) {
      annotations = annotations.filter(a => a.category === category)
    }

    // 如果指定了中心术语，进行BFS遍历
    if (centerTerm) {
      const centerAnnotations = annotations.filter(a => a.term_text === centerTerm)
      if (centerAnnotations.length === 0) {
        res.json({ success: true, data: { nodes: [], edges: [] } })
        return
      }

      // 收集中心术语的所有ID
      const centerIds = new Set(centerAnnotations.map(a => a.id as number))
      const visitedIds = new Set<number>(centerIds)
      const allRelations = queryAll(db, 'SELECT * FROM term_relations')

      // BFS扩展
      let currentLevel = new Set(centerIds)
      for (let d = 0; d < maxDepth; d++) {
        const nextLevel = new Set<number>()
        for (const rel of allRelations) {
          const sourceId = rel.source_term_id as number
          const targetId = rel.target_term_id as number
          if (currentLevel.has(sourceId) && !visitedIds.has(targetId)) {
            nextLevel.add(targetId)
            visitedIds.add(targetId)
          }
          if (currentLevel.has(targetId) && !visitedIds.has(sourceId)) {
            nextLevel.add(sourceId)
            visitedIds.add(sourceId)
          }
        }
        currentLevel = nextLevel
        if (nextLevel.size === 0) break
      }

      // 过滤标注和关系
      annotations = annotations.filter(a => visitedIds.has(a.id as number))
    }

    const annotationIds = new Set(annotations.map(a => a.id as number))
    const allRelations = queryAll(db, 'SELECT * FROM term_relations')
    const relations = allRelations.filter(r => annotationIds.has(r.source_term_id as number) && annotationIds.has(r.target_term_id as number))

    const nodes: GraphNode[] = annotations.map(a => ({
      id: a.id as number,
      term_text: a.term_text as string,
      category: a.category as string,
      modern_def: a.modern_def as string,
      english_equiv: a.english_equiv as string,
    }))

    const edges: GraphEdge[] = relations.map(r => ({
      id: r.id as number,
      source: r.source_term_id as number,
      target: r.target_term_id as number,
      relation_type: r.relation_type as string,
      confidence: r.confidence as number,
    }))

    res.json({ success: true, data: { nodes, edges } })
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message })
  }
})

export default router
