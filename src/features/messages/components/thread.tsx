import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { AlertTriangle, Loader, XIcon } from "lucide-react";
import { useGetMessage } from "../api/use-get-message";
import Message from "@/components/message";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "../api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import useChannelId from "@/hooks/use-channel-id";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/ui/editor"), { ssr: false });

interface ThreadProps {
  messageId: Id<"messages">;
  onClose: () => void;
}

type ChatMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

const Thread = ({ messageId, onClose }: ThreadProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [pending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    // console.log({ body, image });
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      let values: ChatMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
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
          channelId,
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

  if (loadingMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 border-b h-[49px]">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="h-full flex items-center justify-center">
          <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 border-b h-[49px]">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 h-full items-center justify-center">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Message not found</p>
      </div>
    </div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 border-b h-[49px]">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div>
        <Message
          hideThreadButton
          memberId={message!.memberId as Id<"members">}
          authorImage={message!.user.image}
          isAuthor={message!.memberId === currentMember?._id}
          body={message!.body as string}
          image={message!.image}
          createdAt={message!._creationTime}
          updatedAt={message!.updatedAt}
          id={message!._id as Id<"messages">}
          reactions={message!.reactions}
          isEditing={editingId === message!._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          key={editorKey}
          variant="create"
          onSubmit={handleSubmit}
          disabled={pending}
          innerRef={editorRef}
          placeholder="Reply..."
        />
      </div>
    </div>
  );
};

export default Thread;
