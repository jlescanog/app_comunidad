
import { ReportMap } from "@/components/map/report-map";
import { MOCK_REPORTS } from "@/lib/mock-data"; 

export default function HomePage() {
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
      <ReportMap reports={MOCK_REPORTS} />
    </div>
  );
}
