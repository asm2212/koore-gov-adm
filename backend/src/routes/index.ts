// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth.routes';
import newsRoutes from './news.routes';
import adminRoutes from './admin.routes';
import contactRoute from './contact.route'; // This is a router
import docsRoutes from './docs.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
router.use('/admins', adminRoutes);
router.use("/docs", docsRoutes);
router.use('/contact', contactRoute); // ✅ Use .use(), not .get()

// Optional: health check
router.get('/health', (_req, res) => res.json({ status: "ok" }));

export default router;