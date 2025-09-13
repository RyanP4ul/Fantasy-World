// "use client";

// import * as React from "react";
// import { ControllerRenderProps, FieldValues } from "react-hook-form";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { cn } from "@/lib/utils";

// const HEX6 = /^#?([0-9A-Fa-f]{6})$/;

// function normalizeHex(v: unknown): string {
//   if (typeof v !== "string") return "";
//   const s = v.trim();
//   const m = s.match(HEX6);
//   return m ? `#${m[1].toUpperCase()}` : "";
// }

// interface FormHexColorPickerProps<T extends FieldValues> {
//   field: ControllerRenderProps<T, any>; // react-hook-form field
//   label?: string;
//   className?: string;
// }

// export function FormHexColorPicker<T extends FieldValues>({
//   field,
//   label,
//   className,
// }: FormHexColorPickerProps<T>) {
//   const [open, setOpen] = React.useState(false);
//   const [text, setText] = React.useState<string>(normalizeHex(field.value) || "#000000");
//   const colorInputRef = React.useRef<HTMLInputElement>(null);

//   // Keep local state in sync with form value
//   React.useEffect(() => {
//     const n = normalizeHex(field.value);
//     if (n && n !== text) setText(n);
//   }, [field.value]);

//   const emit = (hex: string) => {
//     const n = normalizeHex(hex);
//     if (n) {
//       setText(n);
//       field.onChange(n);
//     }
//   };

//   const handleManualChange = (v: string) => {
//     setText(v.replace(/[^#0-9A-Fa-f]/g, ""));
//   };

//   const handleManualBlur = () => {
//     const n = normalizeHex(text);
//     if (n) {
//       setText(n);
//       field.onChange(n);
//     } else {
//       const fallback = normalizeHex(field.value) || "#000000";
//       setText(fallback);
//       field.onChange(fallback);
//     }
//   };

//   const isValid = HEX6.test(text);

//   return (
//     <div className={cn("w-full space-y-2", className)}>
//       {label && <Label>{label}</Label>}
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Input
//             value={text}
//             onChange={(e) => handleManualChange(e.target.value)}
//             onBlur={handleManualBlur}
//             onClick={() => setOpen(true)}
//             placeholder="#RRGGBB"
//             // spellCheck={false}
//             // className={cn(isValid ? "" : "border-red-500")}
//           />
//         </PopoverTrigger>
//         <PopoverContent className="w-64" align="start">
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Pick a color</span>
//               <div
//                 className="h-5 w-5 rounded border"
//                 style={{ background: isValid ? normalizeHex(text) : "#FFFFFF" }}
//               />
//             </div>

//             <input
//               ref={colorInputRef}
//               type="color"
//               value={isValid ? normalizeHex(text) : "#000000"}
//               onChange={(e) => emit(e.target.value)}
//               className="block h-10 w-full cursor-pointer rounded border p-0"
//             />

//             <div className="flex items-center gap-2">
//               <Input
//                 value={text}
//                 onChange={(e) => handleManualChange(e.target.value)}
//                 onBlur={handleManualBlur}
//                 placeholder="#RRGGBB"
//                 spellCheck={false}
//               />
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={() =>
//                   navigator.clipboard?.writeText(isValid ? normalizeHex(text) : "#000000")
//                 }
//               >
//                 Copy
//               </Button>
//             </div>

//             {!isValid && (
//               <p className="text-xs text-red-500">Enter a valid HEX like #1A2B3C</p>
//             )}
//             <div className="flex justify-end">
//               <Button type="button" onClick={() => setOpen(false)}>
//                 Done
//               </Button>
//             </div>
//           </div>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const HEX6 = /^#?([0-9A-Fa-f]{6})$/;
const DEFAULT_HEX = "#000000";

function normalizeHex(v: unknown): string {
  if (typeof v !== "string") return "";
  const s = v.trim();
  const m = s.match(HEX6);
  return m ? `#${m[1].toUpperCase()}` : "";
}

interface FormHexColorPickerProps<T extends FieldValues> {
  field: ControllerRenderProps<T, any>;
  label?: string;
  className?: string;
}

export function FormHexColorPicker<T extends FieldValues>({
  field,
  label,
  className,
}: FormHexColorPickerProps<T>) {
  const [open, setOpen] = React.useState(false);

  // Ensure we always start with a safe value
  const initial = normalizeHex(field.value) || DEFAULT_HEX;
  const [text, setText] = React.useState<string>(initial);

  const colorInputRef = React.useRef<HTMLInputElement>(null);

  // Sync local state with RHF changes
  React.useEffect(() => {
    const n = normalizeHex(field.value);
    if (n && n !== text) setText(n);
    if (!n && typeof field.value === "string" && field.value.length === 0 && text !== DEFAULT_HEX) {
      setText(DEFAULT_HEX);
    }
  }, [field.value]); // eslint-disable-line react-hooks/exhaustive-deps

  const emit = (hex: string) => {
    const n = normalizeHex(hex) || DEFAULT_HEX;
    setText(n);
    field.onChange(n);
  };

  const handleManualChange = (v: string) => {
    setText(v.replace(/[^#0-9A-Fa-f]/g, ""));
  };

  const handleManualBlur = () => {
    const n = normalizeHex(text);
    const out = n || normalizeHex(field.value) || DEFAULT_HEX;
    setText(out);
    field.onChange(out);
  };

  const isValid = HEX6.test(text);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <Label>{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex items-center">
            {/* Left swatch */}
            <div
              className="absolute left-0 top-0 h-full w-10 rounded-l-md border-r"
              style={{ background: isValid ? normalizeHex(text) : DEFAULT_HEX }}
            />
            {/* Input with left padding so text doesn't overlap swatch */}
            <Input
              value={text ?? ""}
              onChange={(e) => handleManualChange(e.target.value)}
              onBlur={handleManualBlur}
              onClick={() => setOpen(true)}
              placeholder="#RRGGBB"
              spellCheck={false}
              className={cn(
                "pl-12 text-left", // left padding + text align left
                isValid ? "" : "border-red-500"
              )}
            />
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pick a color</span>
              <div
                className="h-5 w-5 rounded border"
                style={{ background: isValid ? normalizeHex(text) : "#FFFFFF" }}
              />
            </div>

            {/* Native color input */}
            <input
              ref={colorInputRef}
              type="color"
              value={isValid ? normalizeHex(text) : DEFAULT_HEX}
              onChange={(e) => emit(e.target.value)}
              className="block h-10 w-full cursor-pointer rounded border p-0"
            />

            <div className="flex items-center gap-2">
              <Input
                value={text ?? ""}
                onChange={(e) => handleManualChange(e.target.value)}
                onBlur={handleManualBlur}
                placeholder="#RRGGBB"
                spellCheck={false}
                className="text-left"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  navigator.clipboard?.writeText(isValid ? normalizeHex(text) : DEFAULT_HEX)
                }
              >
                Copy
              </Button>
            </div>

            {!isValid && (
              <p className="text-xs text-red-500">Enter a valid HEX like #1A2B3C</p>
            )}
            <div className="flex justify-end">
              <Button type="button" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
