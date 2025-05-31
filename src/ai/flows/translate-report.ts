// src/ai/flows/translate-report.ts
'use server';
/**
 * @fileOverview A flow for translating user-generated reports into multiple languages.
 *
 * - translateReport - A function that handles the report translation process.
 * - TranslateReportInput - The input type for the translateReport function.
 * - TranslateReportOutput - The return type for the translateReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateReportInputSchema = z.object({
  text: z.string().describe('The text of the report to translate.'),
  targetLanguages: z
    .array(z.string())
    .describe('The list of target languages to translate the report into.'),
});
export type TranslateReportInput = z.infer<typeof TranslateReportInputSchema>;

const TranslateReportOutputSchema = z.record(z.string(), z.string()).describe('A map of language codes to translated texts.');
export type TranslateReportOutput = z.infer<typeof TranslateReportOutputSchema>;

export async function translateReport(input: TranslateReportInput): Promise<TranslateReportOutput> {
  return translateReportFlow(input);
}

const translateReportPrompt = ai.definePrompt({
  name: 'translateReportPrompt',
  input: {schema: TranslateReportInputSchema},
  output: {schema: TranslateReportOutputSchema},
  prompt: `You are a translation expert. Translate the given text into the specified languages.

Text to translate: {{{text}}}

Target languages: {{#each targetLanguages}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Output a JSON object where the keys are the language codes and the values are the translated texts.`,
});

const translateReportFlow = ai.defineFlow(
  {
    name: 'translateReportFlow',
    inputSchema: TranslateReportInputSchema,
    outputSchema: TranslateReportOutputSchema,
  },
  async input => {
    const {output} = await translateReportPrompt(input);
    return output!;
  }
);
