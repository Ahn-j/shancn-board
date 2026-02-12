"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function useDeleteTask() {
  const router = useRouter();

  const deleteTask = async (taskId: number): Promise<boolean> => {
    try {
      const { status, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", taskId);

      if (status === 204) {
        toast.message(`${taskId} is delete success`);

        router.push("/");
        return true;
      }
      if (error) {
        toast.error(`network error : ${error}`);
        return false;
      }

      return false;
    } catch (error) {
      toast.error(`server error : ${error}`);
      return false;
    }
  };

  return { deleteTask };
}

export { useDeleteTask };
