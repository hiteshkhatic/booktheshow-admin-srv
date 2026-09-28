import express from 'express';
import adminRoutes from '../src/routes/admin.routes.js'
const app = express()

app.use(express.json())

app.use('/api/admin', adminRoutes)

export default app