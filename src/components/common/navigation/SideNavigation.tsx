"use client";

import styles from "./SideNavigation.module.scss";
//shadcn UI
import { Button } from "@/components/ui/button";
import { Dot, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";

//전역상태관리
import { useAtom } from "jotai";
import { sidebarStateAtom } from "@/store";

interface Todo {
  id: number;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  contents: BoardContent[];
}

interface BoardContent {
  boardId: string | number;
  inCompleted: boolean;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  content: string;
}

function SideNavigation() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);
  console.log("side : ", sidebarState);
  const onCreate = async () => {
    console.log("navigate to create page");
    //supabase 연동 row 생성
    const { error, status } = await supabase.from("todos").insert([
      {
        title: "",
        start_date: new Date(),
        end_date: new Date(),
        contents: [],
      },
    ]);

    if (error) {
      console.error("Error creating todo:", error);
      return;
    }

    // 방금 생성한 TODOLIST의 ID 값으로 URL파라미터 생성/변경(동적라우팅)
    const { data } = await supabase.from("todos").select();
    console.log("방금 생성한 데이터 : ", data);
    if (status === 201) {
      toast.success("New page created successfully!");

      if (data) {
        router.push(`/create/${data[data.length - 1].id}`);
        getTodos();
      } else {
        return;
      }
    }
  };

  const getTodos = async () => {
    const { data, error, status } = await supabase.from("todos").select("*");

    if (error) {
      console.error("Error fetching todos:", error);
      return;
    }

    if (status === 200) {
      setTodos(data);
    }

    console.log("Fetched todos:", data);
  };
  //supabase에서 todos 불러오기

  useEffect(() => {
    console.log("todos 불러오기");
    getTodos();
  }, [sidebarState]);

  const handleClick = (id: number) => {
    console.log("click : ", id);

    router.push(`/create/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          placeholder="검색어 입력해줘"
          className="focus-visible:ring-0"
        />
        <Button variant="outline" size="icon">
          <Search className="w-18 h-18" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant="outline"
          className="w-full text-orange-500 border-orange-500 hover:bg-orange-50 hover:text-orange-500"
          onClick={onCreate}
        >
          Add New page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your to do</span>
        <div className={styles.container__todos__list}>
          {todos &&
            todos.map((item: Todo) => {
              return (
                <div
                  key={item.id}
                  className="flex items-center bg-[#f5f5f4] rounded-sm cursor-pointer"
                  onClick={() => handleClick(item.id)}
                >
                  <Dot className="mr-4 text-green-400"></Dot>
                  <span className="text-sm">
                    {item.title === "" ? "no title" : item.title}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
