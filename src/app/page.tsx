
"use client";

import { ReportMap } from "@/components/map/report-map";
import { useEffect, useState } from "react";
import type { Report } from "@/types";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, Timestamp, query as firestoreQuery } from "firebase/firestore";
import { Loader2 } from "lucide-react";

async function fetchAllReportsFromFirestore(): Promise<Report[]> {
  try {
    const reportsRef = collection(db, "reports");
    const q = firestoreQuery(reportsRef, orderBy("createdAt", "desc")); // Order by creation time
    const querySnapshot = await getDocs(q);
    const reports: Report[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reports.push({
        id: doc.id,
        ...data,
        // Ensure createdAt and updatedAt are ISO strings
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

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchAllReportsFromFirestore().then(data => {
      setReports(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl md:text-5xl">
          Mapa de PulsoComunitario
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg md:text-xl">
          Visualiza e interactúa con los incidentes reportados por la comunidad.
        </p>
      </section>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Cargando mapa y reportes...</p>
        </div>
      ) : (
        <ReportMap reports={reports} />
      )}
    </div>
  );
}
