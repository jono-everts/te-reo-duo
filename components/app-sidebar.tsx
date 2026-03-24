"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get("topic");
  const topics = useQuery(api.questions.getTopics);
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="font-bold text-lg px-2">Te Reo Duo</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={selectedTopic === null}
                  variant="outline"
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href="/">All Questions</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {topics && topics.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Topics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {topics.map((topic) => (
                  <SidebarMenuItem key={topic}>
                    <SidebarMenuButton
                      asChild
                      isActive={selectedTopic === topic}
                      variant="outline"
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link href={`/?topic=${encodeURIComponent(topic)}`}>
                        {topic}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
