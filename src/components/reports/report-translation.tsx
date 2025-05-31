"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { translateReport } from '@/ai/flows/translate-report';
import type { TranslateReportInput, TranslateReportOutput } from '@/ai/flows/translate-report';
import { Loader2,LanguagesIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

interface ReportTranslationProps {
  reportText: string;
  reportCategory: string; // Can be used for context if needed
}

const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pt', name: 'Portuguese' },
];

export function ReportTranslation({ reportText, reportCategory }: ReportTranslationProps) {
  const [targetLanguage, setTargetLanguage] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!targetLanguage || !reportText) {
      toast({ title: "Translation Error", description: "Please select a target language and ensure there is text to translate.", variant: "destructive"});
      return;
    }

    setIsLoading(true);
    setTranslatedText('');

    try {
      const input: TranslateReportInput = {
        text: reportText,
        targetLanguages: [targetLanguage],
      };
      const output: TranslateReportOutput = await translateReport(input);
      
      if (output && output[targetLanguage]) {
        setTranslatedText(output[targetLanguage]);
        toast({ title: "Translation Successful", description: `Report translated to ${AVAILABLE_LANGUAGES.find(l => l.code === targetLanguage)?.name}.`});
      } else {
        throw new Error('Translation not found in AI response.');
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({ title: "Translation Failed", description: (error as Error).message || "Could not translate the report.", variant: "destructive"});
      setTranslatedText("Error: Could not translate the report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4 bg-muted/30">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-md font-headline flex items-center"><LanguagesIcon className="w-5 h-5 mr-2 text-primary"/>Translate Report</CardTitle>
        <CardDescription className="text-xs">Translate the report description into another language.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="flex items-center space-x-2">
          <Select onValueChange={setTargetLanguage} value={targetLanguage}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Target Languages</SelectLabel>
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button onClick={handleTranslate} disabled={isLoading || !targetLanguage}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Translate
          </Button>
        </div>
        {translatedText && (
          <Textarea
            value={translatedText}
            readOnly
            rows={3}
            className="mt-2 bg-background"
            placeholder="Translated text will appear here."
          />
        )}
      </CardContent>
    </Card>
  );
}
