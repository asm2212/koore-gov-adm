import { z } from 'zod';

export const tourismPlaceSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(3),
  language: z.enum(['EN', 'AM']),
});
