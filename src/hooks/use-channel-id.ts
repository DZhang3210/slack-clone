import { useParams } from "next/navigation";
import React from "react";
import { Id } from "../../convex/_generated/dataModel";

const useChannelId = () => {
  const params = useParams();
  return params.channelId as Id<"channels">;
};
export default useChannelId;
