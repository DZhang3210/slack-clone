"use client";
import { useCreateChannelModal } from "@/features/channels/store/use-create-workspace-modal";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import React from "react";

const ChannelIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateChannelModal();
  return <div></div>;
};

export default ChannelIdPage;
