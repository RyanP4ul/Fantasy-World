// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useTheme } from "next-themes";
// import { Switch } from "./ui/switch";
// import { Label } from "./ui/label";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

// export function SiteHeader() {
  
//   const { theme, setTheme } = useTheme();

//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         {/* <h1 className="text-base font-medium">Documents</h1> */}
//         <div className="ml-auto flex items-center gap-2">
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="theme"
//               checked={theme === "dark"}
//               onCheckedChange={(checked) =>
//                 setTheme(checked ? "dark" : "light")
//               }
//             />
//             <Label htmlFor="theme">
//               <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} />
//               Theme
//             </Label>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center space-x-2">
            {mounted && (
              <>
                <Switch
                  id="theme"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
                <Label htmlFor="theme">
                  <FontAwesomeIcon icon={theme === "dark" ? faMoon : faSun} />
                  {theme === "dark" ? "Dark" : "Light"} Theme
                </Label>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
