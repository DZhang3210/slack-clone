"use client";
import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useCreateChannelModal } from "@/features/channels/store/use-create-workspace-modal";
import useChannelId from "@/hooks/use-channel-id";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "./header";
import ChatInput from "./chat-input";

const ChannelIdPage = () => {
  const channelId = useChannelId();
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading) {
    return (
      <div className="h-screen flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }
  if (!channel) {
    return (
      <div className="h-screen flex-1 flex-col gap-y-2 flex items-center justify-center">
        <TriangleAlert className="size-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <div className="flex-1" />
      <ChatInput />
    </div>
  );
};

export default ChannelIdPage;
