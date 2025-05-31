
import { z } from 'zod';
import { REPORT_CATEGORIES, REPORT_URGENCIES, MAX_REPORT_DESCRIPTION_LENGTH } from '@/lib/constants';

// Cast to [string, ...string[]] to satisfy Zod's non-empty array requirement for enums
const categories = REPORT_CATEGORIES as [string, ...string[]];
const urgencies = REPORT_URGENCIES as [string, ...string[]];

export const reportSchema = z.object({
  category: z.enum(categories, { 
    required_error: "La categoría es obligatoria.",
  }),
  subCategory: z.string().optional(),
  description: z.string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres." })
    .max(MAX_REPORT_DESCRIPTION_LENGTH, { message: `La descripción no debe exceder los ${MAX_REPORT_DESCRIPTION_LENGTH} caracteres.` }),
  urgency: z.enum(urgencies, {
    required_error: "El nivel de urgencia es obligatorio.",
  }),
  latitude: z.number({ required_error: "La ubicación es obligatoria." }).min(-90).max(90),
  longitude: z.number({ required_error: "La ubicación es obligatoria." }).min(-180).max(180),
});

export type ReportFormData = z.infer<typeof reportSchema>;
