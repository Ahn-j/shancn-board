"use client";

import { BoardContent } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

function useCreateBoard() {
  const createBoard = async (
    taskId: number,
    column: string,
    newValue: BoardContent[],
  ): Promise<boolean> => {
    try {
      const { data, error, status } = await supabase
        .from("todos")
        .update({
          [column]: newValue,
        })
        .eq("id", taskId)
        .select();

      if (data && status === 200) {
        // 정상 처리
        toast.success("New page created successfully!");
        return true;
      }
      if (error) {
        toast.error(`에러발생! ${error}`);
        return false;
      }

      return false;
    } catch (error) {
      toast.error(`네트워크 에러발생! ${error}`);
      return false;
    }
  };

  return { createBoard };
}

export { useCreateBoard };
