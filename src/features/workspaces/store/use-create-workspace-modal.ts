import { atom, useAtom } from "jotai";

const modelAtom = atom(false);

export const useCreateWorkspaceModal = () => {
  return useAtom(modelAtom);
};
