
"use client";

// import { useAuth } from "@/hooks/use-auth";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Report } from "@/types";
import { MOCK_REPORTS } from "@/lib/mock-data"; 
import { getSessionReportsByUserId } from "@/lib/session-store"; // Importar para reportes de sesión
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/icons/category-icon";
import { URGENCY_HSL_COLORS } from "@/lib/constants";
import { formatDistanceToNow } from 'date-fns';
// import { es } from 'date-fns/locale'; // Import Spanish locale for date-fns if desired
import Link from "next/link";
import { FileTextIcon, MessageSquareIcon, ThumbsUpIcon, Trash2Icon, RotateCwIcon } from "lucide-react";
import { ReportTranslation } from "@/components/reports/report-translation";

// Mock fetching user's reports
async function fetchUserReports(userId: string): Promise<Report[]> {
  console.log(`Fetching reports for user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay

  const hardcodedReports = MOCK_REPORTS.filter(report => report.userId === userId);
  const sessionAddedReports = getSessionReportsByUserId(userId);
  
  // Combinar reportes hardcodeados y de sesión. Los de sesión primero para que aparezcan arriba.
  const allUserReports = [...sessionAddedReports, ...hardcodedReports];
  
  // Simple deduplication basada en ID para evitar duplicados si se recarga
  const uniqueReports = Array.from(new Map(allUserReports.map(report => [report.id, report])).values());
  
  return uniqueReports;
}


export default function MyReportsPage() {
  // const { user, loading: authLoading } = useAuth();
  // const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar re-fetch
  
  const mockUser = { id: "user-123" }; // Mocked user for now

  useEffect(() => {
    // if (!authLoading && !user) {
    //   router.push('/login?redirect=/reports/mine');
    //   return;
    // }
    if (mockUser) {
      setIsLoading(true); // Mostrar carga al refrescar
      fetchUserReports(mockUser.id).then(data => {
        setReports(data);
        setIsLoading(false);
      });
    } else if (!mockUser /*!authLoading && !user*/) {
        setIsLoading(false); // Not logged in, stop loading
    }
  }, [/* user, authLoading, router */ refreshKey]); // Añadir refreshKey a las dependencias
  
  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando tus reportes...</div>;
  }

  if (reports.length === 0 && !isLoading) { // Asegurar que no está cargando
    return (
      <div className="text-center p-8">
        <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aún No Hay Reportes</h2>
        <p className="text-muted-foreground mb-4">No has enviado ningún reporte. ¡Comienza creando uno!</p>
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
        <h1 className="text-3xl font-bold font-headline">Mis Reportes Enviados</h1>
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
                  Enviado {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true /*, locale: es */ })}
                </CardDescription>
              </div>
              <Badge style={{ backgroundColor: URGENCY_HSL_COLORS[report.urgency], color: 'hsl(var(--primary-foreground))' }} variant="default" className="text-sm px-3 py-1">
                {report.urgency}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">{report.description}</p>
            <div className="text-sm text-muted-foreground">
              <p><strong>Estado:</strong> <span className={`font-semibold ${
                report.status === 'Resuelto' ? 'text-green-600' : 
                report.status === 'En Proceso' ? 'text-blue-600' : 
                'text-orange-600' // Assuming 'Pendiente' or other fall into orange
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
            {report.status === "Pendiente" && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2Icon className="w-4 h-4 mr-1" /> Eliminar
                </Button>
            )}
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
