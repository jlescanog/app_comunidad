
"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REPORT_CATEGORIES, REPORT_URGENCIES } from "@/lib/constants";
import { ListFilter } from "lucide-react";

// Translated report statuses for filter dropdown
const REPORT_STATUSES_DISPLAY = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En Proceso', label: 'En Proceso' },
  { value: 'Resuelto', label: 'Resuelto' },
];


export function MapFilters() {
  // TODO: Implement filter state and logic
  return (
    <div className="absolute top-4 left-4 z-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="shadow-md bg-card hover:bg-card/90">
            <ListFilter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filtrar Reportes</h4>
              <p className="text-sm text-muted-foreground">
                Refina los reportes que se muestran en el mapa.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="category" className="text-sm font-medium">Categoría</label>
                <Select>
                  <SelectTrigger id="category" className="col-span-2 h-8">
                    <SelectValue placeholder="Todas las Categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Categorías</SelectItem>
                    {REPORT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="urgency" className="text-sm font-medium">Urgencia</label>
                 <Select>
                  <SelectTrigger id="urgency" className="col-span-2 h-8">
                    <SelectValue placeholder="Todas las Urgencias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Urgencias</SelectItem>
                    {REPORT_URGENCIES.map(urgency => (
                      <SelectItem key={urgency} value={urgency}>{urgency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="status" className="text-sm font-medium">Estado</label>
                 <Select>
                  <SelectTrigger id="status" className="col-span-2 h-8">
                    <SelectValue placeholder="Todos los Estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los Estados</SelectItem>
                    {REPORT_STATUSES_DISPLAY.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="secondary">Aplicar Filtros</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
