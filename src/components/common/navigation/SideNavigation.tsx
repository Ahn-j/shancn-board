"use client";

import styles from "./SideNavigation.module.scss";
//shadcn UI
import { Button, Input } from "@/components/ui";
import { Dot, Search } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

//custom Hook
import { useGetTasks, useCreateTask } from "@/hooks/apis";
import { Todo } from "@/types";
import { ChangeEvent, useEffect, useRef, useState } from "react";

function SideNavigation() {
  const router = useRouter();
  const { id } = useParams();
  const { tasks, getTasks } = useGetTasks();
  const [searchV, setSearchV] = useState<string>("");
  const searchData = useRef<Todo[]>([]);

  const handleCreate = useCreateTask();

  useEffect(() => {
    getTasks();
    //setSearchData([]);
    searchData.current = [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (id: number) => {
    router.push(`/create/${id}`);
  };

  //검색
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchV(value);

    //검색어가 있을경우
    //테스크 리스트에 일치하는값이 있는지확인후,
    //있으면 서치데이터에 담고, 화면에 나타냄
    //검색한 내용과 일치하는값이 없으면 빈배열을 셋팅하고
    //화면에는 전체 테스크리스트 나타냄
    if (value) {
      const data = tasks.filter((item) => item.title.includes(value));

      if (data.length > 0) {
        searchData.current = data;
      } else {
        searchData.current = [];
      }
    } else {
      searchData.current = [];
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__searchBox}>
        <Input
          type="text"
          value={searchV}
          placeholder="검색어 입력해줘"
          className="focus-visible:ring-0"
          onChange={handleChangeValue}
        />
        <Button variant="outline" size="icon">
          <Search className="w-18 h-18" />
        </Button>
      </div>
      <div className={styles.container__buttonBox}>
        <Button
          variant="outline"
          className="w-full text-orange-500 border-orange-500 hover:bg-orange-50 hover:text-orange-500"
          onClick={handleCreate}
        >
          Add New page
        </Button>
      </div>
      <div className={styles.container__todos}>
        <span className={styles.container__todos__label}>Your to do</span>
        <div className={styles.container__todos__list}>
          {searchV ? (
            <>
              {searchData.current.length > 0 ? (
                searchData.current.map((item: Todo) => {
                  return (
                    <div
                      key={item.id}
                      className={`${item.id === Number(id) && "bg-[#f5f5f6]"} flex items-center  rounded-sm  cursor-pointer`}
                      onClick={() => handleClick(item.id)}
                    >
                      <Dot
                        className={`${item.id === Number(id) ? "text-green-400" : "text-neutral-400"} mr-4`}
                      />
                      <span
                        className={`${item.id !== Number(id) && "text-neutral-400"} text-sm`}
                      >
                        {item.title === "" ? "no title" : item.title}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center bg-[#f5f5f4] rounded-sm ">
                  <Dot className="mr-4 text-gray-500" />
                  일치하는데이터가없습니다
                </div>
              )}
            </>
          ) : (
            <>
              {tasks.length > 0 ? (
                tasks.map((item: Todo) => {
                  return (
                    <div
                      key={item.id}
                      className={`${item.id === Number(id) && "bg-[#f5f5f6]"} flex items-center  rounded-sm  cursor-pointer`}
                      onClick={() => handleClick(item.id)}
                    >
                      <Dot
                        className={`${item.id === Number(id) ? "text-green-400" : "text-neutral-400"} mr-4`}
                      />
                      <span
                        className={`${item.id !== Number(id) && "text-neutral-400"} text-sm`}
                      >
                        {item.title === "" ? "no title" : item.title}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center bg-[#f5f5f4] rounded-sm ">
                  <Dot className="mr-4 text-gray-500" />
                  No todos
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
