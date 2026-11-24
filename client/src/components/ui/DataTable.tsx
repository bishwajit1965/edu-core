import type { ReactNode } from "react";
import SearchBox from "./SearchBox";
import { LucideIcon } from "../ui/LucideIcons.js";
import { useState } from "react";

export interface DataTableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;

  searchValue?: string;
  labelText: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: (row: T) => ReactNode;
  icon?: ReactNode;
  dataLength?: number;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

const DataTable = <T,>({
  data,
  columns,
  getRowId,
  labelText,
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = "Search...",
  actions,
  icon,
  dataLength,
  emptyMessage = "No records found.",
  pageSizeOptions = [10, 25, 50],
  defaultPageSize = 10,
}: DataTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalRecords = data.length;

  const totalPages = Math.ceil(totalRecords / pageSize);

  const activePage = Math.min(currentPage, Math.max(totalPages, 1));

  const startIndex = (activePage - 1) * pageSize;

  const endIndex = Math.min(startIndex + pageSize, totalRecords);

  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      {onSearchChange && (
        <div className="flex flex-wrap lg:gap-0 gap-4 items-center justify-between">
          <div className="">
            {labelText && (
              <>
                <h1 className="lg:text-xl test-lg font-extrabold flex items-center gap-x-1.5 text-gray-600">
                  {icon != null && <span className="shrink-0">{icon}</span>}
                  <span>{labelText}</span>
                  {dataLength != null && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-light bg-gray-800 text-white border border-gray-400 shadow">
                      {dataLength}
                    </span>
                  )}
                </h1>
              </>
            )}
          </div>
          <div className="">
            <SearchBox
              value={searchValue ?? ""}
              onChange={(value) => {
                setCurrentPage(1);
                onSearchChange(value);
              }}
              placeholder={searchPlaceholder}
              onClear={(value) => {
                setCurrentPage(1);
                (onSearchClear ?? onSearchChange)?.(value);
              }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-base-content/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-base-200 text-base-content/70">
            <tr>
              <th className="pl-2">#</th>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 font-semibold whitespace-nowrap ${
                    column.className ?? ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {column.header}

                    {column.sortable && (
                      <LucideIcon.ArrowUpDown
                        size={14}
                        className="text-base-content/40"
                      />
                    )}
                  </div>
                </th>
              ))}

              {actions && (
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-base-content/10">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={getRowId(row)}
                  className="hover:bg-base-200/50 transition-colors"
                >
                  <td className="pl-2">{startIndex + index + 1}</td>
                  {columns.map((column, index) => (
                    <td
                      key={index}
                      className={`px-4 py-3 ${column.className ?? ""}`}
                    >
                      {column.cell
                        ? column.cell(row)
                        : column.accessorKey
                          ? String(row[column.accessorKey] ?? "")
                          : null}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end items-center gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-10 text-center text-base-content/50"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalRecords > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Record information */}
          <div className="flex items-center gap-2 text-sm text-base-content/60">
            <span>
              Showing {startIndex + 1}–{endIndex} of {totalRecords}
            </span>

            <span>|</span>

            <span>Rows per page:</span>

            <select
              value={pageSize}
              onChange={(e) => {
                setCurrentPage(1);
                setPageSize(Number(e.target.value));
              }}
              className="select select-bordered select-sm w-20"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={activePage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="btn btn-sm btn-ghost"
              title="Previous page"
            >
              <LucideIcon.ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`btn btn-sm ${
                    activePage === page ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={activePage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="btn btn-sm btn-ghost"
              title="Next page"
            >
              <LucideIcon.ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
