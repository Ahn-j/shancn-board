"use client";

import { onTaskAtom } from "@/store";
import { Todo } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { toast } from "sonner";

function useGetTaskById() {
  const [oneTask, setOneTask] = useAtom(onTaskAtom);

  const getOneTasks = async (taskId: number): Promise<Todo | null> => {
    try {
      const { data, error, status } = await supabase
        .from("todos")
        .select("*")
        .eq("id", taskId);

      if (error) {
        toast.error(`Error fetching todos : ${error}`);
        return null;
      }

      if (data && status === 200) {
        toast.message(`"${taskId}"に対するデータを取得しました。`);
        setOneTask(data[0]);
        return data[0];
      }
      return null;
    } catch (error) {
      toast.error(`server Error fetching todos : ${error}`);
      return null;
    }
  };

  return { getOneTasks, oneTask };
}

export { useGetTaskById };
