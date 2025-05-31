import { ReportForm } from "@/components/reports/report-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewReportPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Submit a New Report</CardTitle>
          <CardDescription>
            Help improve your community by reporting an incident. Please provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
