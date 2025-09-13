import {
  Pagination as TestPagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  getPageNumbers: () => (number | string)[];
};

export default function Pagination({
  currentPage,
  totalPages,
  goToPage,
  getPageNumbers,
}: PaginationProps) {
  return (
    <TestPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(currentPage - 1)}
            className={
              currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
            }
          />
        </PaginationItem>
        {getPageNumbers().map((num, index) =>
          num === "..." ? (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => goToPage(Number(num))}
                href="#"
                isActive={currentPage === num}
              >
                {num}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(currentPage + 1)}
            className={
              currentPage === totalPages
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </TestPagination>
  );
}
