"use client";

import { tasksAtom } from "@/store";
import { supabase } from "@/utils/supabase/client";
import { useAtom } from "jotai";
import { toast } from "sonner";

function useGetTasks() {
  const [tasks, setTasks] = useAtom(tasksAtom);

  const getTasks = async () => {
    try {
      const { data, error, status } = await supabase.from("todos").select("*");

      if (error) {
        toast.error(`Error fetching todos : ${error}`);
      }

      if (data && status === 200) {
        setTasks(data);
      }
    } catch (error) {
      toast.error(`server Error fetching todos : ${error}`);
    }
  };

  return { getTasks, tasks };
}

export { useGetTasks };
