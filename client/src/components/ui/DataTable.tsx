import type { ReactNode } from "react";
import SearchBox from "./SearchBox";
import { LucideIcon } from "../ui/LucideIcons.js";

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
  onSearchChange?: (value: string) => void;
  onSearchClear?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
}

const DataTable = <T,>({
  data,
  columns,
  getRowId,
  searchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = "Search...",
  actions,
  emptyMessage = "No records found.",
}: DataTableProps<T>) => {
  return (
    <div className="w-full space-y-4">
      {/* Search */}
      {onSearchChange && (
        <div className="flex justify-end">
          <SearchBox
            value={searchValue ?? ""}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            onClear={onSearchClear ?? onSearchChange}
          />
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-base-content/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-base-200 text-base-content/70">
            <tr>
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
            {data.length > 0 ? (
              data.map((row) => (
                <tr
                  key={getRowId(row)}
                  className="hover:bg-base-200/50 transition-colors"
                >
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
    </div>
  );
};

export default DataTable;
