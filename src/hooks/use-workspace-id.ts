import { useParams } from "next/navigation";
import React from "react";
import { Id } from "../../convex/_generated/dataModel";

const useWorkspaceId = () => {
  const params = useParams();
  return params.workspaceId as Id<"workspaces">;
};
export default useWorkspaceId;
