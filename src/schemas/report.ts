import { z } from 'zod';
import { REPORT_CATEGORIES, REPORT_URGENCIES, MAX_REPORT_DESCRIPTION_LENGTH } from '@/lib/constants';

export const reportSchema = z.object({
  category: z.enum(REPORT_CATEGORIES as [string, ...string[]], { // Zod enum needs at least one value
    required_error: "Category is required.",
  }),
  subCategory: z.string().optional(),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(MAX_REPORT_DESCRIPTION_LENGTH, { message: `Description must not exceed ${MAX_REPORT_DESCRIPTION_LENGTH} characters.` }),
  urgency: z.enum(REPORT_URGENCIES as [string, ...string[]], {
    required_error: "Urgency level is required.",
  }),
  latitude: z.number({ required_error: "Location is required." }).min(-90).max(90),
  longitude: z.number({ required_error: "Location is required." }).min(-180).max(180),
  // For file uploads, validation is typically handled differently (e.g., server-side or with custom client logic)
  // For this schema, we might just note that files are expected.
  // media: z.array(z.any()).optional(), // Placeholder for media files
});

export type ReportFormData = z.infer<typeof reportSchema>;
