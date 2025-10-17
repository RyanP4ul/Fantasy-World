"use client";

import { usePanel } from "@/providers/PanelProvider";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function PanelToolbar() {
  const { table, isFetching, panelForm, searchField } = usePanel();

  return (
    <div className="flex items-center py-4">
      {/* 🔍 Search */}
      <Input
        placeholder="Search..."
        disabled={isFetching}
        value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ""}
        onChange={(e) =>
          table.getColumn(searchField)?.setFilterValue(e.target.value)
        }
        className="max-w-md"
      />

      {/* 🧩 Column visibility */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer ml-auto"
            disabled={isFetching}
          >
            Columns <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="cursor-pointer capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ➕ Add new */}
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer ml-2"
        onClick={panelForm.handleAddNewItem}
        disabled={isFetching}
      >
        <FontAwesomeIcon icon={faPlus} />
        Add New Items
      </Button>
    </div>
  );
}
