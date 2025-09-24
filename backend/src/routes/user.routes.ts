// import { Router, Request, Response } from 'express';
// import prisma from '../prisma/client';
// import { authenticateJWT } from '../middlewares/auth.middleware';

// const router = Router();

// router.get('/me', authenticateJWT, async (req: Request, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

//     const user = await prisma.user.findUnique({
//       where: { id: req.user.userId },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         createdAt: true,
//         updatedAt: true,
//       }
//     });

//     if (!user) return res.status(404).json({ error: 'User not found' });

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export default router;
