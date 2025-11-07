import { Router } from 'express';
import * as newsCtrl from '../controllers/news.controller';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// Public routes
router.get('/', newsCtrl.getNews);
router.get('/:id', newsCtrl.getNewsById);

// Authenticated routes with roles
router.post('/', authenticateJWT, authorizeRoles('ADMIN', 'WRITER'), upload.array('images', 10), newsCtrl.createNews);
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN', 'WRITER'), upload.array('images', 10), newsCtrl.updateNews);
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN', 'WRITER'), newsCtrl.deleteNews);

export default router;