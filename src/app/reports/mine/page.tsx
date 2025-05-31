"use client";

// import { useAuth } from "@/hooks/use-auth";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Report } from "@/types";
import { MOCK_REPORTS } from "@/lib/mock-data"; // Using all mock reports for now
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/icons/category-icon";
import { URGENCY_HSL_COLORS } from "@/lib/constants";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";
import { FileTextIcon, MessageSquareIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { ReportTranslation } from "@/components/reports/report-translation";

// Mock fetching user's reports
async function fetchUserReports(userId: string): Promise<Report[]> {
  console.log(`Fetching reports for user ${userId}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Filter mock reports by a mock logged-in user ID or return a subset
  return MOCK_REPORTS.filter(report => report.userId === "user-123").slice(0, 2); 
}


export default function MyReportsPage() {
  // const { user, loading: authLoading } = useAuth();
  // const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const mockUser = { id: "user-123" }; // Mocked user for now

  useEffect(() => {
    // if (!authLoading && !user) {
    //   router.push('/login?redirect=/reports/mine');
    //   return;
    // }
    if (mockUser) {
      fetchUserReports(mockUser.id).then(data => {
        setReports(data);
        setIsLoading(false);
      });
    } else if (!mockUser /*!authLoading && !user*/) {
        setIsLoading(false); // Not logged in, stop loading
    }
  }, [/* user, authLoading, router */]);

  // if (authLoading || isLoading) {
  //   return <div className="text-center p-8">Loading your reports...</div>;
  // }
  
  // if (!user) {
  //    return <div className="text-center p-8">Please log in to view your reports.</div>;
  // }
  
  if (isLoading) {
    return <div className="text-center p-8">Loading your reports...</div>;
  }


  if (reports.length === 0) {
    return (
      <div className="text-center p-8">
        <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Reports Yet</h2>
        <p className="text-muted-foreground mb-4">You haven't submitted any reports. Start by creating one!</p>
        <Button asChild>
          <Link href="/report/new">Create New Report</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">My Submitted Reports</h1>
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
                  Submitted {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
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
              <p><strong>Status:</strong> <span className={`font-semibold ${
                report.status === 'Solved' ? 'text-green-600' : 
                report.status === 'In Process' ? 'text-blue-600' : 
                'text-orange-600'
              }`}>{report.status}</span></p>
              <p><strong>Location:</strong> {report.location.address || `Lat: ${report.location.latitude.toFixed(4)}, Lng: ${report.location.longitude.toFixed(4)}`}</p>
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
            {report.status === "Pending" && (
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2Icon className="w-4 h-4 mr-1" /> Delete
                </Button>
            )}
            <Button variant="outline" size="sm" asChild className="ml-2">
                <Link href={`/report/${report.id}`}>View Details</Link>
            </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
