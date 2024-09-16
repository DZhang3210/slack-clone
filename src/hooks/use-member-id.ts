"use client";
import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";

const useMemberId = () => {
  const params = useParams();
  return params.memberId as Id<"members">;
};
export default useMemberId;
