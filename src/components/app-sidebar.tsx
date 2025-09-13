"use client";

import * as React from "react";
import {
  faNewspaper,
  faDashboard,
  faWandSparkles,
  faSkull,
  faQuestion,
  faDharmachakra,
  faBaseballBatBall,
  faHouseFlag,
  faSun,
  faLink,
  faMap,
  faFlag,
  faFile,
  faCode,
  faShop,
  faGamepad,
  faList,
  faBook,
  faHeartPulse,
  faHeading,
  faPersonBooth,
  faUsers,
  faGears,
  faArrowsLeftRight,
  faSolarPanel,
  faImage,
  faUserSecret,
  faStore,
  faBlog,
  faCamera,
  faPerson,
  faTools,
  faLinkSlash,
} from "@fortawesome/free-solid-svg-icons";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
import { useSession } from "next-auth/react";
import { getRoles } from "@/lib/utils";

const navigation = [
  {
    title: "Main",
    access: 40,
    items: [
      {
        title: "Dashboard",
        url: "/panel",
        icon: faDashboard,
        disabled: false,
        access: 40,
      },
      {
        title: "User Management",
        url: "#",
        icon: faDashboard,
        disabled: false,
        access: 90,
      },
    ],
  },
  // {
  //   title: "Server",
  //   access: 60,
  //   items: [
  //     {
  //       title: "Game Rooms",
  //       url: "/",
  //       icon: faPersonBooth,
  //       disabled: true,
  //       access: 60,
  //     },
  //     {
  //       title: "Game Users",
  //       url: "/",
  //       icon: faUsers,
  //       disabled: true,
  //       access: 60,
  //     },
  //     {
  //       title: "Game Settings",
  //       url: "/",
  //       icon: faGears,
  //       disabled: true,
  //       access: 60,
  //     },
  //   ],
  // },
  {
    title: "Web",
    access: 40,
    items: [
      {
        title: "Web Posts",
        url: "/panel/web-posts",
        icon: faBlog,
        disabled: false,
        access: 40,
      },
      {
        title: "Web Store",
        url: "/panel/stores",
        icon: faStore,
        disabled: false,
        access: 60,
      },
      {
        title: "Web Settings",
        url: "/panel/web/settings",
        icon: faGears,
        disabled: false,
        access: 60,
      },
    ],
  },
  {
    title: "Game Data",
    access: 40,
    items: [
      {
        title: "Achievements",
        url: "/panel/achievements",
        icon: faNewspaper,
        disabled: false,
        access: 40,
      },
      {
        title: "Auras",
        url: "#",
        icon: faSun,
        disabled: false,
        access: 60,
        subs: [
          {
            title: "Auras",
            url: "/panel/auras",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
          {
            title: "Auras Effects",
            url: "/panel/auras-effects",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
        ],
      },
      {
        title: "Book",
        url: "#",
        icon: faBook,
        disabled: false,
        access: 60,
        subs: [
          {
            title: "Book Of Lore",
            url: "/panel/book",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
          {
            title: "Book Quests",
            url: "/panel/book/quests",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
        ],
      },
      {
        title: "Classes",
        url: "/panel/classes",
        icon: faLink,
        disabled: false,
        access: 60,
      },
      {
        title: "Factions",
        url: "/panel/factions",
        icon: faHouseFlag,
        disabled: false,
        access: 40,
      },
      {
        title: "Game Menu",
        url: "#",
        icon: faList,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Game Menu",
            url: "/panel/gamemenu",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "News",
            url: "/panel/gamemenu/news",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
        ],
      },
      {
        title: "Enhancements",
        url: "#",
        icon: faHeartPulse,
        disabled: false,
        access: 60,
        subs: [
          {
            title: "Enhancements",
            url: "/panel/enhancements",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
          {
            title: "Patterns",
            url: "/panel/enhancements/patterns",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
        ],
      },
      {
        title: "Items",
        url: "#",
        icon: faBaseballBatBall,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Items",
            url: "/panel/items",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Items Requirements",
            url: "/panel/items/requirements",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Items Skills",
            url: "/panel/items/skills",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
        ],
      },
      {
        title: "Maps",
        url: "#",
        icon: faMap,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Maps",
            url: "/panel/maps",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Maps Items",
            url: "/panel/maps/items",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Maps Monsters",
            url: "/panel/maps/monsters",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Maps Npcs",
            url: "/panel/maps/npcs",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          // { title: "Maps Timeline", url: "/panel/maps/timeline", icon: faFlag },
        ],
      },
      {
        title: "Npcs",
        url: "#",
        icon: faPerson,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Npcs",
            url: "/panel/npcs",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Npcs Contents",
            url: "/panel/npcs/contents",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Npcs Contents Action",
            url: "/panel/npcs/contents/actions",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Npcs Entity Generic",
            url: "/panel/npcs/generic",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Npcs Entity Humanoid",
            url: "/panel/npcs/humanoid",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
        ],
      },
      {
        title: "Monsters",
        url: "#",
        icon: faSkull,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Monsters",
            url: "/panel/monsters",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Monsters Bosses",
            url: "/panel/monsters/bosses",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
          {
            title: "Monsters Drops",
            url: "/panel/monsters/drops",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Monsters Skills",
            url: "/panel/monsters/skills",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
        ],
      },
      {
        title: "Quests",
        url: "#",
        icon: faQuestion,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Quests",
            url: "/panel/quests",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Quests Required Items",
            url: "/panel/quests/required-items",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Quests Requirements",
            url: "/panel/quests/requirements",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Quests Rewards",
            url: "/panel/quests/rewards",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
        ],
      },
      {
        title: "Redeems",
        url: "/panel/redeems",
        icon: faBook,
        disabled: false,
        access: 40,
      },
      {
        title: "Shops",
        url: "#",
        icon: faShop,
        disabled: false,
        access: 40,
        subs: [
          {
            title: "Shops",
            url: "/panel/shops",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Shops Items",
            url: "/panel/shops/items",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
          {
            title: "Shops Seasonal",
            url: "/panel/shops/seasonal",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
        ],
      },
      {
        title: "Skills",
        url: "#",
        icon: faWandSparkles,
        disabled: false,
        access: 60,
        subs: [
          {
            title: "Skills",
            url: "/panel/skills",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
          {
            title: "Skills Assign",
            url: "/panel/skills/assign",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
          {
            title: "Skills Auras",
            url: "/panel/skills/auras",
            icon: faFlag,
            disabled: false,
            access: 60,
          },
        ],
      },
      {
        title: "Titles",
        url: "#",
        icon: faHeading,
        disabled: false,
        access: 40,
        subs: [
          { title: "Titles", url: "/panel/titles", icon: faFlag, access: 40 },
          {
            title: "Titles Decoration",
            url: "/panel/titles/decorations",
            icon: faFlag,
            disabled: false,
            access: 40,
          },
        ],
      },
      {
        title: "Wheels",
        url: "/panel/wheels",
        icon: faDharmachakra,
        disabled: false,
        access: 40,
      },
    ],
  },
  {
    title: "Logs",
    access: 40,
    items: [
      {
        title: "Panel Logs",
        url: "/panel/logs",
        icon: faSolarPanel,
        disabled: false,
        access: 40,
      },
      {
        title: "User Logs",
        url: "/panel/logs/users",
        icon: faUserSecret,
        disabled: false,
        access: 40,
      },
      {
        title: "Trade Logs",
        url: "/panel/logs/trade",
        icon: faArrowsLeftRight,
        disabled: false,
        access: 40,
      },
      {
        title: "Auction Logs",
        url: "/panel/logs/auction",
        icon: faDashboard,
        disabled: false,
        access: 40,
      },
    ],
  },
  {
    title: "Builder",
    access: 40,
    items: [
      {
        title: "Build Character",
        url: "#",
        icon: faFile,
        disabled: true,
        access: 40,
      },
      {
        title: "Class Builder",
        url: "#",
        icon: faLinkSlash,
        disabled: true,
        access: 60,
      },
      {
        title: "Npc Builder",
        url: "#",
        icon: faTools,
        disabled: true,
        access: 40,
      },
    ],
  },
  {
    title: "Others",
    access: 40,
    items: [
      {
        title: "Upload Files",
        url: "/panel/upload",
        icon: faFile,
        disabled: false,
        access: 40,
      },
      {
        title: "Swf to Image",
        url: "/panel/swf-to-img",
        icon: faCamera,
        disabled: true,
        access: 40,
      },
      {
        title: "Functions",
        url: "#",
        icon: faCode,
        disabled: true,
        access: 40,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const currentPath = usePathname();

  console.log(currentPath);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigation.filter(x => (session?.user?.Access || 40) >= x.access).map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenu key={group.title}>
              {group.items.filter(item => (session?.user?.Access || 40) >= item.access).map((item) => {
                const isActive = item.subs
                  ? item.subs.some((sub) => sub.url === currentPath)
                  : currentPath === item.url;

                return (
                  <div key={item.title}>
                    {item.subs ? (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              <FontAwesomeIcon
                                icon={item.icon as IconProp}
                                className="mr-2"
                              />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subs?.filter(subItem => (session?.user?.Access || 40) >= subItem.access).map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={currentPath === subItem.url}
                                  >
                                    <a href={subItem.url}>
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ) : (
                      <>
                        {(session?.user?.Access || 40) >= item.access && (
                          <SidebarMenuItem key={item.title} className="flex">
                            <SidebarMenuButton asChild isActive={isActive}>
                              <a href={item.url}>
                                {item.icon && (
                                  <FontAwesomeIcon
                                    icon={item.icon as IconProp}
                                    className="mr-2"
                                  />
                                )}
                                <span>
                                  {item.title}{" "}
                                  {item.disabled && (
                                    <Badge
                                      className="h-5 min-w-5 px-1 ml-2"
                                      variant="destructive"
                                    >
                                      Disabled
                                    </Badge>
                                  )}
                                </span>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: session?.user?.Name || "",
            email: session?.user?.Email || "",
            role: getRoles(session?.user?.Access || 40),
            avatar: session?.user.Avatar || "/assets/images/default-avatar.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    // <Sidebar collapsible="offcanvas" {...props}>
    //   <SidebarHeader>
    //     <SidebarMenu>
    //       <SidebarMenuItem>
    //         <SidebarMenuButton
    //           asChild
    //           className="data-[slot=sidebar-menu-button]:!p-1.5"
    //         >
    //           <a href="#">
    //             <IconInnerShadowTop className="!size-5" />
    //             <span className="text-base font-semibold">Acme Inc.</span>
    //           </a>
    //         </SidebarMenuButton>
    //       </SidebarMenuItem>
    //     </SidebarMenu>
    //   </SidebarHeader>
    //   <SidebarContent>
    //     <NavMain items={data.navMain} />
    //     <NavSecondary items={data.navSecondary} className="mt-auto" />
    //   </SidebarContent>
    //   <SidebarFooter>
    //     <NavUser user={data.user} />
    //   </SidebarFooter>
    // </Sidebar>
  );
}
