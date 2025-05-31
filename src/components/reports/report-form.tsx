
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ReportFormData } from "@/schemas/report";
import { reportSchema } from "@/schemas/report";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REPORT_CATEGORIES, REPORT_URGENCIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ReportMap } from "@/components/map/report-map"; 
import { Loader2, MapPinIcon, UploadCloudIcon } from "lucide-react";

// Mock server action
async function submitReportAction(data: ReportFormData): Promise<{ success: boolean; message: string; reportId?: string }> {
  console.log("Submitting report:", data);
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (Math.random() > 0.1) { 
    return { success: true, message: "¡Reporte enviado exitosamente!", reportId: `report-${Date.now()}` };
  } else {
    return { success: false, message: "No se pudo enviar el reporte. Por favor, inténtalo de nuevo." };
  }
}


export function ReportForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: undefined,
      description: "",
      urgency: undefined,
    },
  });

  useEffect(() => {
    if (selectedLocation) {
      form.setValue("latitude", selectedLocation.lat, { shouldValidate: true });
      form.setValue("longitude", selectedLocation.lng, { shouldValidate: true });
    }
  }, [selectedLocation, form]);

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setSelectedLocation(coords);
    setShowMap(false); 
    toast({ title: "Ubicación Seleccionada", description: `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`});
  };
  
  const handleUseGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSelectedLocation(coords);
          form.setValue("latitude", coords.lat, { shouldValidate: true });
          form.setValue("longitude", coords.lng, { shouldValidate: true });
          toast({ title: "Ubicación GPS Adquirida", description: `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}` });
        },
        (error) => {
          toast({ title: "Error de GPS", description: error.message, variant: "destructive" });
        }
      );
    } else {
      toast({ title: "GPS No Soportado", description: "La geolocalización no es compatible con tu navegador.", variant: "destructive" });
    }
  };


  async function onSubmit(data: ReportFormData) {
    setIsSubmitting(true);
    if (!data.latitude || !data.longitude) {
        // The message for this error comes from the schema in src/schemas/report.ts
        form.setError("latitude", { type: "manual", message: form.formState.errors.latitude?.message || "Por favor, selecciona una ubicación en el mapa o usa el GPS." });
        setIsSubmitting(false);
        return;
    }
    
    const result = await submitReportAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "¡Reporte Enviado!",
        description: result.message,
      });
      form.reset();
      setSelectedLocation(null);
    } else {
      toast({
        title: "Envío Fallido",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REPORT_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Proporciona una breve descripción del incidente (máx. 200 palabras)"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Sé específico. ¿Qué pasó? ¿Dónde exactamente? Cualquier otro detalle relevante.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgencia Percibida</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el nivel de urgencia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {REPORT_URGENCIES.map((urgency) => (
                    <SelectItem key={urgency} value={urgency}>
                      {urgency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Baja: Problema menor. Media: Necesita atención. Alta: Impacto significativo. Urgente: Atención inmediata. Crítica: Amenaza la vida o daño grave a la propiedad.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
            <FormLabel>Ubicación</FormLabel>
            <div className="space-y-2">
                <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={handleUseGPS}>Usar Mi Ubicación Actual</Button>
                    <Button type="button" variant="outline" onClick={() => setShowMap(!showMap)}>
                        <MapPinIcon className="mr-2 h-4 w-4"/>
                        {showMap ? "Cerrar Mapa" : "Seleccionar en Mapa"}
                    </Button>
                </div>
                {selectedLocation && (
                    <p className="text-sm text-muted-foreground">
                        Seleccionado: Lat: {selectedLocation.lat.toFixed(5)}, Lng: {selectedLocation.lng.toFixed(5)}
                    </p>
                )}
                <FormField control={form.control} name="latitude" render={({ field }) => <Input type="hidden" {...field} />} />
                <FormField control={form.control} name="longitude" render={({ field }) => <Input type="hidden" {...field} />} />
                <FormMessage>{form.formState.errors.latitude?.message || form.formState.errors.longitude?.message}</FormMessage>
            </div>
        </FormItem>

        {showMap && (
            <div className="h-[400px] w-full rounded-md border overflow-hidden my-4">
            <ReportMap 
                reports={[]} 
                isInteractiveFormMap={true} 
                onMapClick={handleMapClick} 
                selectedLocation={selectedLocation}
            />
            </div>
        )}

        <FormItem>
            <FormLabel>Multimedia (Fotos/Video)</FormLabel>
            <FormControl>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloudIcon className="w-8 h-8 mb-2 text-muted-foreground"/>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                            <p className="text-xs text-muted-foreground">Fotos (máx. 5) o un video corto (máx. 15s)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple accept="image/*,video/mp4,video/quicktime" />
                    </label>
                </div> 
            </FormControl>
            <FormDescription>
                Adjunta fotos relevantes o un video corto del incidente.
            </FormDescription>
            <FormMessage />
        </FormItem>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Reporte
        </Button>
      </form>
    </Form>
  );
}
