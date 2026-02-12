"use client";

import styles from "./page.module.scss";
//shadcn UI
import { Button } from "@/components/ui/button/button";

//custom Hook
import { useCreateTask } from "@/hooks/apis";

function InitPage() {
  //페이지 생성 및 Supabase연동
  // const handleCreateTask = async () => {
  //   //Supabase 데이터베이스 row 생성
  //   const { error, status } = await supabase
  //     .from("todos")
  //     .insert([
  //       {
  //         title: "",
  //         start_date: new Date(),
  //         end_date: new Date(),
  //         contents: [],
  //       },
  //     ])
  //     .select();

  //   if (error) {
  //     return;
  //   }

  //   // 방금 생성한 TODOLIST의 ID 값으로 URL파라미터 생성/변경(동적라우팅)
  //   const { data } = await supabase.from("todos").select();

  //   if (status === 201) {
  //     toast.success("새로운 할일리스트 생성완료");
  //     setSidebarState("createPage");
  //     if (data) {
  //       router.push(`/create/${data[data.length - 1].id}`);
  //     } else {
  //       return;
  //     }
  //   }
  // };

  const handleCreateTask = useCreateTask();
  return (
    <div className={styles.container}>
      <div className={styles.container__onBoarding}>
        <span className={styles.container__onBoarding__title}>
          How to create a Page
        </span>
        <div className={styles.container__onBoarding__steps}>
          <span>1.Create a page</span>
          <span>2.Add boards to page</span>
        </div>
        {/* 페이지 추가 버튼 */}
        <Button
          variant="outline"
          className="text-[#E79057] bg-transparent border border-[#E79057] hover:bg-[#FFF9F5] w-45"
          onClick={handleCreateTask}
        >
          Add new page
        </Button>
      </div>
    </div>
  );
}

export default InitPage;
