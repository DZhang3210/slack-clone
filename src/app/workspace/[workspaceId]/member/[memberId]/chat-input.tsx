"use client";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import useWorkspaceId from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
// import Editor from "@/components/ui/editor";

const Editor = dynamic(() => import("@/components/ui/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<"conversations">;
}
type ChatMessageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      let values: ChatMessageValues = {
        conversationId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        // console.log("URL", { url });\
        // console.log("1");
        if (!url) {
          throw new Error("Url not found");
        }
        // console.log("2");
        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        // console.log("3", result);
        if (!result.ok) {
          throw new Error("Failed to upload image");
        }
        // console.log("4");
        const { storageId } = await result.json();
        // console.log("5", storageId);
        values.image = storageId;
      }

      createMessage(
        {
          ...values,
          workspaceId,
          conversationId,
          body,
        },
        { throwError: true }
      );
      setEditorKey((prevKey) => prevKey + 1);
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        variant="create"
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={false}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
