import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // ✅ Only import `z`, not `ZodError`

export const newsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.enum(['governance', 'tourism', 'other'], {
    message: "Category must be 'governance', 'tourism', or 'other'",
  }),
  language: z.enum(['EN', 'AM'], {
    message: "Language must be 'EN' or 'AM'",
  }),
});

export const validateNews = (req: Request, res: Response, next: NextFunction) => {
  try {
    newsSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) { // ✅ Correct type guard
      return res.status(400).json({
        success: false,
        errors: error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }
    // Unknown error
    next(error);
  }
};