"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function useCreateTask() {
  const router = useRouter();

  const createTask = async () => {
    try {
      const { data, error, status } = await supabase
        .from("todos")
        .insert({
          title: "",
          start_date: new Date(),
          end_date: new Date(),
          contents: [],
        })
        .select();

      if (data && status === 201) {
        // 정상 처리
        toast.success("New page created successfully!");

        router.push(`/create/${data[0].id}`);
      }
      if (error) {
        toast.error(`에러발생! ${error}`);
      }
    } catch (error) {
      toast.error(`네트워크 에러발생! ${error}`);
    }
  };

  return createTask;
}

export { useCreateTask };
