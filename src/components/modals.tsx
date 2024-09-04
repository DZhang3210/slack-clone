"use client";

import CreateWorkSpaceModal from "@/features/workspaces/components/create-workspace-modal";
import React, { useEffect, useState } from "react";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CreateWorkSpaceModal />
    </>
  );
};

export default Modals;
