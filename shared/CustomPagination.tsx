"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/Shadcn/pagination";
import { ICustomPagination } from "@/types/interfaces";

function CustomPagination({
  pageIndex,
  pageCount,
  canPreviousPage,
  canNextPage,
  nextPage,
  previousPage,
  setPageIndex,
}: ICustomPagination) {
  if (pageCount <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={
              !canPreviousPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              if (canPreviousPage) previousPage();
            }}
          />
        </PaginationItem>

        {Array.from({ length: pageCount }).map((_, idx) => (
          <PaginationItem key={idx}>
            <PaginationLink
              href="#"
              className="cursor-pointer"
              isActive={pageIndex === idx}
              onClick={(e) => {
                e.preventDefault();
                setPageIndex(idx);
              }}
            >
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            className={
              !canNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
            onClick={(e) => {
              e.preventDefault();
              if (canNextPage) nextPage();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default CustomPagination;
