
"use client";

// import { useAuth } from "@/hooks/use-auth"; // Auth no longer used
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import type { Report } from "@/types";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/icons/category-icon";
import { URGENCY_HSL_COLORS } from "@/lib/constants";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";
import { FileTextIcon, MessageSquareIcon, ThumbsUpIcon, Trash2Icon, RotateCwIcon, Loader2 } from "lucide-react";
import { ReportTranslation } from "@/components/reports/report-translation";
import Image from "next/image"; // Import Next Image

// Now fetches all reports instead of user-specific ones
async function fetchAllReportsFromFirestore(): Promise<Report[]> {
  try {
    const reportsRef = collection(db, "reports");
    // No longer filtering by userId, fetching all, ordered by creation date
    const q = query(reportsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const reports: Report[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      } as Report);
    });
    return reports;
  } catch (error) {
    console.error("Error fetching all reports from Firestore:", error);
    return []; 
  }
}


export default function AllReportsPage() { // Renamed page for clarity
  // const { user, loading: authLoading, firebaseUser } = useAuth(); // Auth no longer used
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    const fetchedReports = await fetchAllReportsFromFirestore(); // Fetches all reports
    setReports(fetchedReports);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadReports();
  }, [refreshKey, loadReports]);
  
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Cargando reportes...</p>
      </div>
    );
  }
  
  if (reports.length === 0 && !isLoading) {
    return (
      <div className="text-center p-8">
        <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aún No Hay Reportes</h2>
        <p className="text-muted-foreground mb-4">No se han enviado reportes. ¡Comienza creando uno!</p>
        <div className="flex justify-center gap-2">
          <Button asChild>
            <Link href="/report/new">Crear Nuevo Reporte</Link>
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            <RotateCwIcon className="w-4 h-4 mr-2" />
            Refrescar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Todos los Reportes</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RotateCwIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </div>
      {reports.map(report => (
        <Card key={report.id} className="shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                  <CategoryIcon category={report.category} className="w-6 h-6" style={{ color: URGENCY_HSL_COLORS[report.urgency] }}/>
                  {report.category}
                </CardTitle>
                <CardDescription>
                  Enviado {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                  {report.user && report.user.name !== "Usuario Anónimo" && ` por ${report.user.name}`}
                </CardDescription>
              </div>
              <Badge style={{ backgroundColor: URGENCY_HSL_COLORS[report.urgency], color: 'hsl(var(--primary-foreground))' }} variant="default" className="text-sm px-3 py-1">
                {report.urgency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3 whitespace-pre-wrap">{report.description}</p>
             {report.media && report.media.length > 0 && report.media[0].type === 'image' && (
              <div className="my-3">
                <Image
                  src={report.media[0].url}
                  alt={report.category || 'Imagen del reporte'}
                  width={300}
                  height={200}
                  className="rounded-md object-contain border max-h-64"
                  data-ai-hint={report.media[0].dataAiHint || "report image"}
                />
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <p><strong>Estado:</strong> <span className={`font-semibold ${
                report.status === 'Resuelto' ? 'text-green-600' : 
                report.status === 'En Proceso' ? 'text-blue-600' : 
                'text-orange-600'
              }`}>{report.status}</span></p>
              <p><strong>Ubicación:</strong> {report.location.address || `Lat: ${report.location.latitude.toFixed(4)}, Lng: ${report.location.longitude.toFixed(4)}`}</p>
            </div>
             <div className="mt-2">
              <ReportTranslation reportText={report.description} reportCategory={report.category} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <ThumbsUpIcon className="w-4 h-4 mr-1 text-green-500" /> {report.upvotes}
              <MessageSquareIcon className="w-4 h-4 ml-3 mr-1" /> {report.internalComments?.length || 0}
            </div>
            <div>
            {/* For now, removing delete button as it would require auth/permissions */}
            {/* {report.status === "Pendiente" && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2Icon className="w-4 h-4 mr-1" /> Eliminar
                </Button>
            )} */}
            <Button variant="outline" size="sm" asChild className="ml-2">
                <Link href={`/report/${report.id}`}>Ver Detalles</Link>
            </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
