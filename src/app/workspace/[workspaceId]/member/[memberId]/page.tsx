"use client";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import useMemberId from "@/hooks/use-member-id";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { Loader, TriangleAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess(data) {
          setConversationId(data);
        },
        onError(error) {
          toast.error("Failed to create conversation");
        },
      }
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span>Conversation not found</span>
      </div>
    );
  }
  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
