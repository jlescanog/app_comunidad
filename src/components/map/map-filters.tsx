"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { REPORT_CATEGORIES, REPORT_URGENCIES } from "@/lib/constants";
import { FilterIcon, ListFilter } from "lucide-react";

export function MapFilters() {
  // TODO: Implement filter state and logic
  return (
    <div className="absolute top-4 left-4 z-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="shadow-md bg-card hover:bg-card/90">
            <ListFilter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Filter Reports</h4>
              <p className="text-sm text-muted-foreground">
                Refine reports shown on the map.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger id="category" className="col-span-2 h-8">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {REPORT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="urgency" className="text-sm font-medium">Urgency</label>
                 <Select>
                  <SelectTrigger id="urgency" className="col-span-2 h-8">
                    <SelectValue placeholder="All Urgencies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    {REPORT_URGENCIES.map(urgency => (
                      <SelectItem key={urgency} value={urgency}>{urgency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
               <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                 <Select>
                  <SelectTrigger id="status" className="col-span-2 h-8">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {['Pending', 'In Process', 'Solved'].map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="secondary">Apply Filters</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
