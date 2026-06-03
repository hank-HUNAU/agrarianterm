/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import taskRoutes from './routes/tasks.js'
import annotationRoutes from './routes/annotations.js'
import relationRoutes from './routes/relations.js'
import graphRoutes from './routes/graph.js'
import searchRoutes from './routes/search.js'
import compareRoutes from './routes/compare.js'
import statisticsRoutes from './routes/statistics.js'
import { getDb } from './db.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * Initialize database before handling requests
 */
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await getDb()
    next()
  } catch (error) {
    next(error)
  }
})

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/annotations', annotationRoutes)
app.use('/api/relations', relationRoutes)
app.use('/api/graph', graphRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/compare', compareRoutes)
app.use('/api/statistics', statisticsRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
