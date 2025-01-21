"use client";

import * as React from "react";
import { SquareTerminal, Hospital } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "MedClover",
      logo: Hospital,
      plan: "User Area",
    },
  ],
  navMain: [
    {
      title: "User Area",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Add Case",
          url: "/addcase",
        },
        {
          title: "Case History",
          url: "/cases-list",
        },
        {
          title: "View Doctors",
          url: "#",
        },
      ],
    },
  ],
};
export const userButtonAppearance = {
  elements: {
    userButtonAvatarBox: "w-10 h-10", // Custom width and height
    userButtonBox: {
      flexDirection: "row-reverse",
    },
  },
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.teams[0]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} groupTitle="User Dashboard" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
