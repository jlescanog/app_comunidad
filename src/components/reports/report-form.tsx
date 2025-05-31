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
import { ReportMap } from "@/components/map/report-map"; // For location selection
import { Loader2, MapPinIcon, UploadCloudIcon } from "lucide-react";
// import { useAuth } from "@/hooks/use-auth"; // For redirecting if not logged in

// Mock server action
async function submitReportAction(data: ReportFormData): Promise<{ success: boolean; message: string; reportId?: string }> {
  console.log("Submitting report:", data);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  // Simulate success/failure
  if (Math.random() > 0.1) { // 90% success rate
    return { success: true, message: "Report submitted successfully!", reportId: `report-${Date.now()}` };
  } else {
    return { success: false, message: "Failed to submit report. Please try again." };
  }
}


export function ReportForm() {
  const { toast } = useToast();
  // const { user, loading: authLoading } = useAuth(); // Get user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      category: undefined,
      description: "",
      urgency: undefined,
      // Location will be set via map or GPS
    },
  });

  useEffect(() => {
    // Placeholder for redirecting if user not logged in
    // if (!authLoading && !user) {
    //   router.push('/login?redirect=/report/new'); // Or show a message
    //   toast({ title: "Authentication Required", description: "Please log in to submit a report.", variant: "destructive"});
    // }
  }, [/* authLoading, user, router, toast */]);


  useEffect(() => {
    if (selectedLocation) {
      form.setValue("latitude", selectedLocation.lat, { shouldValidate: true });
      form.setValue("longitude", selectedLocation.lng, { shouldValidate: true });
    }
  }, [selectedLocation, form]);

  const handleMapClick = (coords: { lat: number; lng: number }) => {
    setSelectedLocation(coords);
    setShowMap(false); // Optionally close map after selection
    toast({ title: "Location Selected", description: `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}`});
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
          toast({ title: "GPS Location Acquired", description: `Lat: ${coords.lat.toFixed(4)}, Lng: ${coords.lng.toFixed(4)}` });
        },
        (error) => {
          toast({ title: "GPS Error", description: error.message, variant: "destructive" });
        }
      );
    } else {
      toast({ title: "GPS Not Supported", description: "Geolocation is not supported by your browser.", variant: "destructive" });
    }
  };


  async function onSubmit(data: ReportFormData) {
    setIsSubmitting(true);
    // Ensure location is set
    if (!data.latitude || !data.longitude) {
        form.setError("latitude", { type: "manual", message: "Please select a location on the map or use GPS." });
        setIsSubmitting(false);
        return;
    }
    
    const result = await submitReportAction(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Report Submitted!",
        description: result.message,
      });
      form.reset();
      setSelectedLocation(null);
      // router.push(`/report/${result.reportId}`); // Optional: redirect to report detail page
    } else {
      toast({
        title: "Submission Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  }

  // if (authLoading) {
  //   return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  // }
  // if (!user) {
  //   return <div className="text-center p-8 text-destructive">Please log in to submit a report. <Button onClick={() => router.push('/login?redirect=/report/new')}>Login</Button></div>;
  // }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a brief description of the incident (max 200 words)"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Be specific. What happened? Where exactly? Any other relevant details.
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
              <FormLabel>Perceived Urgency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
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
                Low: Minor issue. Medium: Needs attention. High: Significant impact. Urgent: Immediate attention. Critical: Life-threatening or severe property damage.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
            <FormLabel>Location</FormLabel>
            <div className="space-y-2">
                <div className="flex space-x-2">
                    <Button type="button" variant="outline" onClick={handleUseGPS}>Use My Current Location</Button>
                    <Button type="button" variant="outline" onClick={() => setShowMap(!showMap)}>
                        <MapPinIcon className="mr-2 h-4 w-4"/>
                        {showMap ? "Close Map" : "Select on Map"}
                    </Button>
                </div>
                {selectedLocation && (
                    <p className="text-sm text-muted-foreground">
                        Selected: Lat: {selectedLocation.lat.toFixed(5)}, Lng: {selectedLocation.lng.toFixed(5)}
                    </p>
                )}
                {/* Hidden fields for lat/lng, these will be populated by map/GPS */}
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
            <FormLabel>Multimedia (Photos/Video)</FormLabel>
            <FormControl>
                 <div className="flex items-center justify-center w-full">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloudIcon className="w-8 h-8 mb-2 text-muted-foreground"/>
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">Photos (max 5) or a short video (max 15s)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" multiple accept="image/*,video/mp4,video/quicktime" />
                    </label>
                </div> 
            </FormControl>
            <FormDescription>
                Attach relevant photos or a short video of the incident.
            </FormDescription>
            <FormMessage />
        </FormItem>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Report
        </Button>
      </form>
    </Form>
  );
}
