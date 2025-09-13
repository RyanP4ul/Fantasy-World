// import { schema } from "@/validations/panel/auraValidator";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { z } from "zod";
import { JSX, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn, displayDate } from "@/lib/utils";
import { CalendarIcon, Check, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { FormHexColorPicker } from "./hex-color-picker";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "./ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function PanelInput({
  control,
  name,
  type,
  label,
  placeholder,
  description = "",
  disabled = false,
  hidden = false,
}: {
  control: Control<z.infer<any>>;
  name: string;
  type: "text" | "number" | "decimal";
  label: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
  hidden?: boolean;
}): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              // defaultValue={field.value}
              onChange={(e) => {
                if (type === "number") {
                  const value = e.target.valueAsNumber;
                  field.onChange(isNaN(value) ? "" : value);
                } else if (type === "decimal") {
                  const value = e.target.value;
                  if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
                    if (value === "" || value === "-" || value.endsWith(".")) {
                      field.onChange(value);
                    } else {
                      const parsed = parseFloat(value);
                      field.onChange(isNaN(parsed) ? value : parsed);
                    }
                  }
                } else {
                  field.onChange(e.target.value);
                }
              }}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PanelSelect({
  control,
  name,
  label,
  placeholder,
  children,
}: {
  control: Control<z.infer<any>>;
  name: string;
  label: string;
  placeholder: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              // value={field.value ? String(field.value) : ""}
              defaultValue={field.value ? String(field.value) : ""}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {children}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export function PanelComboBox({
  api,
  name,
  label,
  form,
  sub = "Name",
}: {
  api: string;
  name: string;
  label: string;
  form: any;
  sub?: string;
}) {
  const ITEMS_PER_PAGE = 20;
  const [isOnce, setIsOnce] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dataRecord, setDataRecord] = useState<Record<string, string>>({});
  const [isFetching, setIsFetching] = useState(false);

  async function fetchAuras() {
    setIsFetching(true);

    const res = await fetch(api);

    if (!res.ok) {
      setIsFetching(false);
      return;
    }

    const resJson = await res.json();
    const newData: Record<string, string> = {};
    resJson.forEach((item: any) => {
      newData[item.id] = item[sub];
    });

    setDataRecord(newData);
    setIsFetching(false);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const [search, setSearch] = useState("");
        const [page, setPage] = useState(1);

        // Filter by search term
        const filteredItems = useMemo(() => {
          const entries = Object.entries(dataRecord);
          if (!search) return entries;
          return entries.filter(
            ([key, value]) =>
              value.toLowerCase().includes(search.toLowerCase()) ||
              key.includes(search)
          );
        }, [dataRecord, search]);

        // Paginate
        const paginatedItems = useMemo(() => {
          const start = (page - 1) * ITEMS_PER_PAGE;
          return filteredItems.slice(start, start + ITEMS_PER_PAGE);
        }, [filteredItems, page]);

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover
              modal={true}
              open={isOpen}
              onOpenChange={async () => {
                setIsOpen(!isOpen);
                if (!isOnce && !isOpen) {
                  setIsOnce(true);
                  await fetchAuras();
                }
              }}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? Object.entries(dataRecord).find(
                          ([key]) => Number(key) === Number(field.value)
                        )?.[1] || "Please select to see"
                      : "Select"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-max p-0">
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    className="h-9"
                    value={search}
                    onValueChange={(v) => {
                      setSearch(v);
                      setPage(1); // Reset page when searching
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isFetching ? (
                        <div className="flex items-center justify-center">
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        "No results found."
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {Object.keys(dataRecord).length > 0 && (
                        <CommandItem
                          onSelect={() => form.setValue(field.name, null)}
                        >
                          <FontAwesomeIcon icon={faXmark} className="mr-2" />
                          None
                        </CommandItem>
                      )}
                      {paginatedItems.map(([key, value]) => (
                        <CommandItem
                          value={value}
                          key={key}
                          onSelect={() => {
                            form.setValue(field.name, Number(key));
                          }}
                        >
                          <span className="text-sm font-bold">{key}</span>
                          <Badge variant="secondary">{value}</Badge>
                          <Check
                            className={cn(
                              "ml-auto",
                              Number(key) === Number(field.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>

                  {/* Simple pagination controls */}
                  {filteredItems.length > ITEMS_PER_PAGE && (
                    <div className="flex justify-between p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Prev
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setPage((p) =>
                            p * ITEMS_PER_PAGE < filteredItems.length
                              ? p + 1
                              : p
                          )
                        }
                        disabled={page * ITEMS_PER_PAGE >= filteredItems.length}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export function PanelSwitch({
  name,
  label,
  form,
}: {
  name: string;
  label: string;
  form: any;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="space-y-0.5 pb-1">
            <FormLabel>{label}</FormLabel>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PanelTextArea({
  name,
  label,
  placeholder,
  description = "",
  control,
}: {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  control: Control<z.infer<any>>;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              className="resize-none"
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PanelDatePicker({
  label,
  name,
  placeholder,
  description,
  form,
}: {
  label: string;
  name: string;
  placeholder: string;
  description?: string;
  form: any;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    displayDate(field.value)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                // onSelect={(date) => {
                //   if (date) {
                //     const adjusted = new Date(
                //       date.getFullYear(),
                //       date.getMonth(),
                //       date.getDate()
                //     );
                //     field.onChange(adjusted);
                //   }
                // }}
                disabled={(date) => date < new Date("2025-01-01")}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PanelColorPicker({
  name,
  label,
  control,
}: {
  name: string;
  label: string;
  control: Control<z.infer<any>>;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <FormHexColorPicker field={field} label={label} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
