import { Todo } from "@/types";
import { atom } from "jotai";

//todo 젠체목록
export const tasksAtom = atom<Todo[]>([]);

//todo리스트중 한건
export const onTaskAtom = atom<Todo | null>(null);
