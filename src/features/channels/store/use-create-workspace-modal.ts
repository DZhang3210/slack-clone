import { atom, useAtom } from "jotai";

const modelAtom = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(modelAtom);
};
