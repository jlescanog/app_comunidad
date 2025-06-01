
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
import { REPORT_CATEGORIES, REPORT_URGENCIES, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ReportMap } from "@/components/map/report-map";
import { Loader2, MapPinIcon, UploadCloudIcon } from "lucide-react";
import type { ReportMedia, User } from "@/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from 'next/image';
import { MOCK_ANONYMOUS_USER } from "@/hooks/use-auth";


async function submitReportAction(data: ReportFormData): Promise<{ success: boolean; message: string; reportId?: string }> {
  console.log("Submitting report to Firestore (anonymously):", data);

  const newReportData = {
    userId: MOCK_ANONYMOUS_USER.id,
    user: MOCK_ANONYMOUS_USER,
    category: data.category,
    description: data.description,
    urgency: data.urgency,
    location: {
      latitude: data.latitude!,
      longitude: data.longitude!,
      address: `Lat: ${data.latitude!.toFixed(4)}, Lng: ${data.longitude!.toFixed(4)}`,
    },
    media: data.media || [],
    status: "Pendiente" as const,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    upvotes: 0,
    downvotes: 0,
    currentUserVote: null,
    internalComments: [],
  };

  try {
    const docRef = await addDoc(collection(db, "reports"), newReportData);
    console.log("Report submitted successfully to Firestore, ID:", docRef.id);
    return { success: true, message: "¡Reporte enviado exitosamente a Firestore!", reportId: docRef.id };
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    const errorMessage = error instanceof Error ? error.message : "No se pudo enviar el reporte a Firestore debido a un error desconocido.";
    return { success: false, message: errorMessage };
  }
}


export function ReportForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: undefined,
      description: "",
      urgency: undefined,
      latitude: null,
      longitude: null,
      media: [],
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
    form.setValue("latitude", coords.lat, { shouldValidate: true });
    form.setValue("longitude", coords.lng, { shouldValidate: true });
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setSelectedImagePreview(dataUri);
        const newMedia: ReportMedia = { type: 'image', url: dataUri, dataAiHint: 'uploaded image' };
        form.setValue('media', [newMedia], { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImagePreview(null);
      form.setValue('media', [], { shouldValidate: true });
      if (file) {
        toast({ title: "Archivo no válido", description: "Por favor, selecciona un archivo de imagen.", variant: "destructive" });
      }
    }
    event.target.value = '';
  };


  async function onSubmit(data: ReportFormData) {
    setIsSubmitting(true);
    if (!data.latitude || !data.longitude) {
        form.setError("latitude", { type: "manual", message: form.formState.errors.latitude?.message || "Por favor, selecciona una ubicación en el mapa o usa el GPS." });
        setIsSubmitting(false);
        return;
    }

    try {
      const result = await submitReportAction(data);

      if (result.success) {
        toast({
          title: "¡Reporte Enviado!",
          description: result.message,
        });
        form.reset();
        setSelectedLocation(null);
        setSelectedImagePreview(null);
      } else {
        toast({
          title: "Envío Fallido",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error inesperado en onSubmit del formulario de reporte:", error);
      toast({
        title: "Error Inesperado",
        description: "Ocurrió un error al procesar tu solicitud. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                {/* Hidden inputs for latitude and longitude to be included in form data */}
                <FormField control={form.control} name="latitude" render={({ field }) => <Input type="hidden" {...field} value={field.value ?? ''} />} />
                <FormField control={form.control} name="longitude" render={({ field }) => <Input type="hidden" {...field} value={field.value ?? ''} />} />
                 { (form.formState.errors.latitude || form.formState.errors.longitude) &&
                    <FormMessage>{form.formState.errors.latitude?.message || form.formState.errors.longitude?.message}</FormMessage>
                }
            </div>
        </FormItem>

        {showMap && (
          <div className="h-[400px] w-full rounded-md border overflow-hidden my-4">
            <ReportMap
              reports={[]}
              initialCenter={DEFAULT_MAP_CENTER}
              initialZoom={15} // Zoom in a bit more for form selection
              isInteractiveFormMap={true}
              onMapClick={handleMapClick}
              selectedLocation={selectedLocation}
            />
          </div>
        )}

        <FormItem>
            <FormLabel>Multimedia (Foto)</FormLabel>
            <FormControl>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloudIcon className="w-8 h-8 mb-2 text-muted-foreground"/>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                            <p className="text-xs text-muted-foreground">Una foto (máx. 5MB)</p>
                        </div>
                        <Input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                    </label>
                </div>
            </FormControl>
            <FormDescription>
                Adjunta una foto relevante del incidente.
            </FormDescription>
            <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                    <>
                        {field.value && field.value.length > 0 && selectedImagePreview && (
                             <div className="mt-4">
                                <FormLabel>Vista Previa de Imagen:</FormLabel>
                                <Image src={selectedImagePreview} alt="Vista previa de imagen cargada" width={200} height={150} className="mt-2 rounded-md max-h-48 w-auto border object-contain" data-ai-hint="uploaded image preview"/>
                             </div>
                        )}
                        <FormMessage />
                    </>
                )}
            />
        </FormItem>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Reporte
        </Button>
      </form>
    </Form>
  );
}
