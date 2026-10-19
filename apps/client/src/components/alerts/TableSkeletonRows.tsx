import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export interface TableSkeletonRowsProps {
  count?: number;
}

/**
 * Loading skeleton rows for AlertsTable during asynchronous data queries.
 */
export function TableSkeletonRows({ count = 5 }: TableSkeletonRowsProps) {
  return Array.from({ length: count }).map((_, index) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell className="px-5 py-3.5">
        <Skeleton className="h-4 w-44" />
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <Skeleton className="h-4 w-14" />
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <Skeleton className="h-4 w-14" />
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="px-4 py-3.5 text-right">
        <Skeleton className="ml-auto h-7 w-20 rounded-lg" />
      </TableCell>
    </TableRow>
  ));
}
