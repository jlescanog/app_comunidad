
import { ReportForm } from "@/components/reports/report-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewReportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Enviar un Nuevo Reporte</CardTitle>
          <CardDescription>
            Ayuda a mejorar tu comunidad reportando un incidente. Por favor, proporciona tantos detalles como sea posible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
