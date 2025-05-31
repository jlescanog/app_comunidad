
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
  reportCategory: string; 
}

const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Francés' },
  { code: 'de', name: 'Alemán' },
  { code: 'ja', name: 'Japonés' },
  { code: 'pt', name: 'Portugués' },
];

export function ReportTranslation({ reportText, reportCategory }: ReportTranslationProps) {
  const [targetLanguage, setTargetLanguage] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!targetLanguage || !reportText) {
      toast({ title: "Error de Traducción", description: "Por favor, selecciona un idioma de destino y asegúrate de que haya texto para traducir.", variant: "destructive"});
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
        const langName = AVAILABLE_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;
        toast({ title: "Traducción Exitosa", description: `Reporte traducido a ${langName}.`});
      } else {
        throw new Error('Traducción no encontrada en la respuesta de la IA.');
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({ title: "Traducción Fallida", description: (error as Error).message || "No se pudo traducir el reporte.", variant: "destructive"});
      setTranslatedText("Error: No se pudo traducir el reporte.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mt-4 bg-muted/30">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-md font-headline flex items-center"><LanguagesIcon className="w-5 h-5 mr-2 text-primary"/>Traducir Reporte</CardTitle>
        <CardDescription className="text-xs">Traduce la descripción del reporte a otro idioma.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        <div className="flex items-center space-x-2">
          <Select onValueChange={setTargetLanguage} value={targetLanguage}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background">
              <SelectValue placeholder="Seleccionar idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Idiomas de Destino</SelectLabel>
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
            Traducir
          </Button>
        </div>
        {translatedText && (
          <Textarea
            value={translatedText}
            readOnly
            rows={3}
            className="mt-2 bg-background"
            placeholder="El texto traducido aparecerá aquí."
          />
        )}
      </CardContent>
    </Card>
  );
}
