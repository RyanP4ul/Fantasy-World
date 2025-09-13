"use client"

import {
  faHome,
  faStore,
  faTrophy,
  faUsersLine,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function WebNav() {

  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-xl font-bold">
            SilverAQ
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-2">
            {["Home", "Launcher", "Ranking", "Wiki", "Store"].map(
              (item) => (
                <NavigationMenuItem key={item}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link
                      href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                    >
                      {item}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-2">
            <NavigationMenuItem>
                  <NavigationMenuTrigger>Help</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4 left-auto">
                      <li>
                        <NavigationMenuLink className="cursor-pointer" asChild>
                          <Link href="/redirect/discord">Discord</Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
            {session ? (
              <>
                {((session?.user?.Access || 0) >= 40) && (
                  <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    <Link href="/panel">Panel</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Account</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4">
                      <li>
                        <NavigationMenuLink className="cursor-pointer" asChild>
                          <Link href="/account">Account</Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink className="cursor-pointer" asChild>
                          <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full text-left"
                          >
                            Logout
                          </button>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
