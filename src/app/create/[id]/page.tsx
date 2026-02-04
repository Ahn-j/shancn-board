"use client";

import styles from "./page.module.scss";
import Image from "next/image";
//chadn UI
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import LabelCalender from "@/components/common/calender/LabelCalender";
import BasicBoard from "@/components/common/board/BasicBoard";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
//고유한 ID지정을 위함
import { nanoid } from "nanoid";
import { ChevronLeft } from "lucide-react";

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

function Create() {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarState, setSidebarState] = useAtom(sidebarStateAtom);

  const [boards, setBoards] = useState<Todo>({
    id: 0,
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    contents: [],
  });
  console.log("boards : ", boards);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const [isClicked, setIsClicked] = useState<boolean>(false);

  const [deleteFlg, setDeleteFlg] = useState<boolean>(false);
  const [updateFlg, setUpdateFlg] = useState<boolean>(false);

  console.log("deleteFlg : ", deleteFlg);
  console.log("updateFlg :", updateFlg);

  //====================================================
  const insertRowData = async (contents: BoardContent[]) => {
    //supabase얀동
    console.log("update!!! : ", contents);
    const { data, error, status } = await supabase
      .from("todos")
      .update({
        contents: contents,
      })
      .eq("id", pathname.split("/")[2]); //where문과 같음 첫번째인수가 항목이고 두번쨰인수가 벨류 즉, where id= value

    if (error) {
      console.log("error: ", error);
      toast.error("Error inserting data: " + error.message);
    }
    console.log("status : ", status);
    if (status === 204) {
      toast.success("업데이트 완료!!!");
      getTodos();
    }
  };

  //add new board버튼 클릭시
  const createBoard = () => {
    console.log("gogogogogogogo");
    let newContents: BoardContent[] = [];
    const BoardContent = {
      boardId: nanoid(),
      inCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };
    console.log("boards: ", boards);
    //UI 그리기
    if (boards) {
      console.log("not undefined");
      if (boards.contents.length > 0) {
        console.log("1");
        //보드의 내용이 있고, 보드안의 컨텐츠리스트에 내용이있다면
        //그 보드의안의 컨텐츠리스트를 전부 복사(얕은복사)후 newContents에 저장후
        //새로운 데이터를 푸쉬함
        newContents = [...boards.contents];
        newContents.push(BoardContent);
        insertRowData(newContents);
      } else if (boards.contents.length === 0) {
        console.log("2");
        //컨텐츠리스트에 값이없으면 그냥 newContents에 새로운데이터만 푸쉬
        newContents.push(BoardContent);
        insertRowData(newContents);
      }
    }
  };

  //===============================================

  //supabase에서 todos 불러오기
  const getTodos = async () => {
    const { data: todos, error } = await supabase.from("todos").select("*");
    // .eq("id", pathname.split("/")[2]);

    if (error) {
      toast.error("Error fetching todos");
      console.log("Error fetching todos:", error);
      return;
    }

    if (todos === null || todos.length === 0) {
      toast.message("no find data");
    }
    if (todos) {
      console.log("Fetched todos:", todos);
      todos.map((item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])) {
          setBoards(item);
          setTitle(item.title);
        }
      });
    }
  };

  //basicBoard에서 삭제처리시
  useEffect(() => {
    if (deleteFlg) {
      getTodos();
      setDeleteFlg(false);
    }
  }, [deleteFlg]);

  //MarkdownDialog에서 갱신처리시
  useEffect(() => {
    if (updateFlg) {
      getTodos();
      setUpdateFlg(false);
    }
  }, [updateFlg]);

  useEffect(() => {
    //useEffect 안에서는  원칙적으로는 비동기 함수부르는걸 추천하고있지않음
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("create title ; ", title);
  const onSave = async () => {
    const { data, error, status } = await supabase
      .from("todos")
      .update({
        title: title,
      })
      .eq("id", pathname.split("/")[2]);

    if (error) {
      toast.error("error!");
    }

    if (status === 204) {
      toast.message("엡데이트 완료");
      getTodos();
      setSidebarState("updated");
    }
  };

  return (
    <div className={styles.container}>
      <div className="absolute top-6 sm:left-60 lg:left-36 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" onClick={onSave}>
          저장
        </Button>
      </div>
      <header className={styles.container__header}>
        <div className={styles.container__header__contents}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className={styles.input}
          />
          <div className={styles.progressBar}>
            <span className={styles.progressBar__status}>0/10 completed</span>
            {/* 프로그래스 UI */}
            <Progress
              value={12}
              className="w-50 h-2"
              indicatorColor="bg-green-500"
            />
          </div>
          <div className={styles.calenderBox}>
            <div className={styles.calenderBox__calender}>
              {/* calender UI */}
              <LabelCalender label="From" readonly />
              <LabelCalender label="To" />
            </div>
            <Button
              variant="outline"
              className="w-[15%] border-orange-500 bg-orange-400  text-white hover:bg-orange-400 hover:text-white"
              onClick={createBoard}
            >
              add new board
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.container__body}>
        {boards?.contents.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className={styles.container__body__infoBox}>
              <span className={styles.title}>There is no board yet.</span>
              <span className={styles.subTitle}>
                Click the button and start flashing
              </span>
              <button className={styles.button} onClick={createBoard}>
                <Image
                  src="/assets/images/free-icon-font-add-3914248.png"
                  alt="plus icon"
                  width={74}
                  height={74}
                />
              </button>
            </div>
          </div>
        ) : (
          //페이지안에(보드테이블) 콘텐츠가 잇을경우 표시
          <div className="flex flex-col items-center justify-start w-full h-full gap-4 overflow-y-scroll">
            {boards?.contents.map((board: BoardContent) => {
              return (
                <BasicBoard
                  key={board.boardId}
                  data={board}
                  setDeleteDate={setDeleteFlg}
                  setUpdateDate={setUpdateFlg}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Create;
