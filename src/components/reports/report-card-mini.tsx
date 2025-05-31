"use client";

import type { Report } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryIcon } from "@/components/icons/category-icon";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { URGENCY_HSL_COLORS } from "@/lib/constants";
import { VoteButtons } from "./vote-buttons"; // Create this component
import { formatDistanceToNow } from 'date-fns';


export function ReportCardMini({ report }: { report: Report }) {
  const urgencyColor = URGENCY_HSL_COLORS[report.urgency] || 'hsl(var(--muted))';
  const timeAgo = formatDistanceToNow(new Date(report.createdAt), { addSuffix: true });

  return (
    <Card className="w-full max-w-sm shadow-none border-0">
      <CardHeader className="p-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-headline flex items-center gap-2">
            <CategoryIcon category={report.category} className="w-5 h-5" style={{ color: urgencyColor }}/>
            {report.category}
          </CardTitle>
          <Badge style={{ backgroundColor: urgencyColor, color: 'hsl(var(--primary-foreground))' }} variant="default">{report.urgency}</Badge>
        </div>
        <CardDescription className="text-xs pt-1">{timeAgo}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 text-sm">
        <p className="line-clamp-3">{report.description}</p>
        {report.media && report.media.length > 0 && report.media[0].type === 'image' && (
          <div className="mt-2">
            <Image
              src={report.media[0].url}
              alt={report.category}
              width={80}
              height={60}
              className="rounded-md object-cover"
              data-ai-hint={report.media[0].dataAiHint || "report image"}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3">
        <VoteButtons reportId={report.id} initialUpvotes={report.upvotes} initialDownvotes={report.downvotes} />
      </CardFooter>
    </Card>
  );
}
