import { useState, useMemo } from "react";

export function usePagination<T>(data: T[], itemsPerPage: number = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data.length, itemsPerPage]
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = useMemo(
    () => data.slice(startIndex, startIndex + itemsPerPage),
    [data, startIndex, itemsPerPage]
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxShown = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      start = 1;
      end = Math.min(totalPages, maxShown);
    }
    if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - (maxShown - 1));
      end = totalPages;
    }

    if (start > 1) pages.push(1, "...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) pages.push("...", totalPages);

    return pages;
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    getPageNumbers,
    setCurrentPage,
  };
}
