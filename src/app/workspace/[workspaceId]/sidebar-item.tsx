import { Button } from "@/components/ui/button";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconType } from "react-icons/lib";

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
}

const SidebarItem = ({ label, id, icon: Icon }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button asChild variant={"tranparent"} size="sm">
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon />
        <span>{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
