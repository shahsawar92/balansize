import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useViewport } from "@/lib/view-port";

import Input from "../input/Input";
import Text from "../text/Text";
import { Link } from "lucide-react";
import ButtonLink from "../links/ButtonLink";

interface Column<T> {
  header: string;
  accessor: keyof T | ((data: T) => string | number);
  sortable?: boolean;
  cell?: (data: T) => JSX.Element;
  onView?: (row: T) => void;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  headerButton?: {
    title: string;
    link: string;
  };
  headerButton2?: {
    title: string;
    link: string;
  };
  classes?: {
    container?: string;
    table?: string;
    header?: string;
    row?: string;
    cell?: string;
    pagination?: string;
  };
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  itemsPerPage?: number;
  isSearchable?: boolean;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  selectable = false,
  onSelectionChange,
  headerButton,
  headerButton2,
  classes,
  itemsPerPage = 10,
  searchTerm = "",
  isSearchable = true,
  onSearchChange,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | ((data: T) => string | number);
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<T["id"]>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const { isMobile } = useViewport();

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue =
      typeof sortConfig.key === "function"
        ? sortConfig.key(a)
        : a[sortConfig.key];
    const bValue =
      typeof sortConfig.key === "function"
        ? sortConfig.key(b)
        : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((item) => item);
  // Object.values(item).some((value) =>
  //   value.toString().toLowerCase().includes(searchTerm.toLowerCase())
  // )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    } else {
      const newSelected = new Set(paginatedData.map((row) => row.id));
      setSelectedRows(newSelected);
      onSelectionChange?.(paginatedData);
    }
  };

  const handleSelectRow = (row: T) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(row.id)) {
      newSelected.delete(row.id);
    } else {
      newSelected.add(row.id);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(data.filter((item) => newSelected.has(item.id)));
  };

  return (
    <div className={cn(`flex flex-col gap-4 `, classes?.container ?? "")}>
      <div
        className={cn(
          "flex items-center gap-2",
          headerButton?.title ? "justify-between" : "justify-end"
        )}>
        {headerButton?.title && (
          <div className='flex items-center gap-2'>
            <ButtonLink href={headerButton.link} variant='light' size='sm'>
              <Text
                variant='main'
                size='sm'
                weight='normal'
                className='cursor-pointer'>
                {headerButton.title}
              </Text>
            </ButtonLink>
            {headerButton2 && (
              <ButtonLink href={headerButton2.link} variant='light' size='sm'>
                <Text
                  variant='main'
                  size='sm'
                  weight='normal'
                  className='cursor-pointer'>
                  {headerButton2.title}
                </Text>
              </ButtonLink>
            )}
          </div>
        )}
        {isSearchable && (
          <Input
            type='text'
            placeholder='Search...'
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className='w-64'
          />
        )}
      </div>

      <div
        className={clsx(
          "overflow-x-auto rounded-lg border bg-secondary-100",
          classes?.table
        )}>
        <table
          className={clsx(
            "min-w-full divide-y divide-gray-200",
            classes?.table
          )}>
          <thead className={classes?.header}>
            <tr>
              {selectable && (
                <th className='px-6 py-3 w-12'>
                  <Input
                    type='checkbox'
                    checked={selectedRows.size === paginatedData.length}
                    onChange={handleSelectAll}
                    sizeOfInput='sm'
                    variant='transparent'
                    className='rounded border-gray-300'
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={clsx(
                    "px-6 py-3 mx-auto text-center ",
                    column.sortable && "cursor-pointer hover:bg-gray-100",
                    classes?.cell
                  )}
                  onClick={() => {
                    if (column.sortable) {
                      setSortConfig({
                        key: column.accessor,
                        direction:
                          sortConfig?.key === column.accessor &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc",
                      });
                    }
                  }}>
                  <div className='flex items-center gap-2 justify-center'>
                    <Text
                      variant='main'
                      size='sm'
                      weight='semibold'
                      isCenterAligned={isMobile ? true : false}
                      isUppercase={false}
                      isItalic={false}>
                      {column.header}
                    </Text>
                    {column.sortable && (
                      <div className='flex flex-col'>
                        <ChevronUpIcon
                          className={clsx(
                            "w-3 h-3",
                            sortConfig?.key === column.accessor &&
                              sortConfig.direction === "asc"
                              ? "text-primary-600"
                              : "text-gray-400"
                          )}
                        />
                        <ChevronDownIcon
                          className={clsx(
                            "w-3 h-3",
                            sortConfig?.key === column.accessor &&
                              sortConfig.direction === "desc"
                              ? "text-primary-600"
                              : "text-gray-400"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={classes?.row}>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "hover:bg-secondary-300",
                  onRowClick && "cursor-pointer",
                  classes?.row
                )}>
                {selectable && (
                  <td className='px-6 py-4 whitespace-nowrap w-12'>
                    <Input
                      type='checkbox'
                      checked={selectedRows.has(row.id)}
                      onChange={() => handleSelectRow(row)}
                      sizeOfInput='sm'
                      variant='transparent'
                      className='rounded border-gray-300'
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex + 1}
                    className={clsx(
                      "px-6 py-4 whitespace-nowrap text-center",
                      classes?.cell
                    )}>
                    <Text
                      variant='secondary'
                      size='sm'
                      tagName='span'
                      weight='normal'
                      isCenterAligned={isMobile ? true : false}
                      isUppercase={false}
                      isItalic={false}
                      className={
                        column.onView ? "cursor-pointer hover:underline" : ""
                      }
                      onClick={() => column.onView && column.onView(row)}>
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessor === "function"
                          ? column.accessor(row)
                          : String(row[column.accessor])}
                    </Text>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={clsx("flex justify-between gap-2", classes?.pagination)}>
        <div className='flex items-center gap-2'>
          <Text variant='secondary' size='sm' weight='normal'>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </Text>
        </div>
        <div className='flex justify-center gap-2'>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className='px-3 py-1 rounded border disabled:opacity-50'>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={clsx(
                "px-3 py-1 rounded border",
                currentPage === page && "bg-main-brown text-white"
              )}>
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className='px-3 py-1 rounded border disabled:opacity-50'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
