"use client";

import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useGetTaskById } from "./useGetTaskById";

function useDeleteBoard() {
  const { getOneTasks } = useGetTaskById();

  const deleteBoard = async (
    taskId: number,
    boardId: string,
  ): Promise<boolean> => {
    try {
      const result = await getOneTasks(taskId);
      if (result) {
        const contentsData = result.contents.filter(
          (item) => item.boardId !== boardId,
        );

        const { data, error, status } = await supabase
          .from("todos")
          .update({
            contents: contentsData,
          })
          .eq("id", taskId)
          .select();

        //업데이트만 하면 스테이터스가 204 인데 업데이트후 셀렉트 해서 스테이터스가 200이됨

        if (error) {
          toast.error(`에러발생! ${error}`);
          return false;
        }
        if (data && status === 200) {
          // 정상 처리
          toast.success("New page updated successfully!");
          return true;
        }
      }

      return false;
    } catch (error) {
      toast.error(`server error : ${error}`);
      return false;
    }
  };

  return { deleteBoard };
}

export { useDeleteBoard };
