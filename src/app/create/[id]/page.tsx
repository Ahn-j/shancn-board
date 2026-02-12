"use client";

import styles from "./page.module.scss";
import Image from "next/image";
//chadn UI
import { Progress, Button } from "@/components/ui";

import LabelCalender from "@/components/common/calender/LabelCalender";
import BasicBoard from "@/components/common/board/BasicBoard";
import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
//고유한 ID지정을 위함
import { nanoid } from "nanoid";
import { ChevronLeft } from "lucide-react";

import { Todo, BoardContent } from "@/types";

//커스텀훅
import {
  useCreateBoard,
  useGetTaskById,
  useDeleteTask,
  useGetTasks,
} from "@/hooks/apis";
import DeleteAlertDialog from "@/components/common/dialog/DeleteAlertDialog";

function Create() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();

  const [boards, setBoards] = useState<Todo>({
    id: 0,
    title: "",
    start_date: new Date(),
    end_date: new Date(),
    contents: [],
  });

  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  // const [isClicked, setIsClicked] = useState<boolean>(false);

  const [count, setCount] = useState<number>(0);

  const [deleteFlg, setDeleteFlg] = useState<boolean>(false);
  const [updateFlg, setUpdateFlg] = useState<boolean>(false);

  const { createBoard } = useCreateBoard();
  const { getOneTasks } = useGetTaskById();
  const { deleteTask } = useDeleteTask();

  const { getTasks } = useGetTasks();

  //add new board버튼 클릭시
  const handelCreateBoard = async () => {
    let newContents: BoardContent[] = [];
    const BoardContent = {
      boardId: nanoid(),
      inCompleted: false,
      title: "",
      startDate: "",
      endDate: "",
      content: "",
    };

    //UI 그리기
    if (boards) {
      if (boards.contents.length > 0) {
        //보드의 내용이 있고, 보드안의 컨텐츠리스트에 내용이있다면
        //그 보드의안의 컨텐츠리스트를 전부 복사(얕은복사)후 newContents에 저장후
        //새로운 데이터를 푸쉬함
        newContents = [...boards.contents];
        newContents.push(BoardContent);
        // insertRowData(newContents);
        //커스텀훅 사용
        const result = await createBoard(Number(id), "contents", newContents);
        if (result) {
          getTodos();
        }
      } else if (boards.contents.length === 0) {
        //컨텐츠리스트에 값이없으면 그냥 newContents에 새로운데이터만 푸쉬
        newContents.push(BoardContent);
        //커스텀훅 사용
        const result = await createBoard(Number(id), "contents", newContents);
        if (result) {
          getTodos();
        }
      }
    }
  };

  //===============================================

  //supabase에서 todos 불러오기
  const getTodos = async () => {
    const result = await getOneTasks(Number(id));

    if (result) {
      setBoards(result);
      setTitle(result.title);
      setStartDate(new Date(result.start_date));
      setEndDate(new Date(result.end_date));

      setCount(result.contents.filter((item) => item.inCompleted).length);

      getTasks();
    }
  };

  //basicBoard에서 삭제처리시
  useEffect(() => {
    if (deleteFlg) {
      getTodos();
      setDeleteFlg(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFlg]);

  //MarkdownDialog에서 갱신처리시
  useEffect(() => {
    if (updateFlg) {
      getTodos();
      setUpdateFlg(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFlg]);

  useEffect(() => {
    //useEffect 안에서는  원칙적으로는 비동기 함수부르는걸 추천하고있지않음
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    const { error, status } = await supabase
      .from("todos")
      .update({
        title: title,
        start_date: startDate,
        end_date: endDate,
      })
      .eq("id", pathname.split("/")[2]);

    if (error) {
      toast.error("error!");
    }

    if (status === 204) {
      toast.message("save 완료");
      getTodos();
    }
  };

  const goDelete = async () => {
    const result = await deleteTask(Number(id));

    if (result) {
      getTasks();
    }
  };

  return (
    <div className={styles.container}>
      <div className="absolute top-6 left-3 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/")}>
          <ChevronLeft />
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleSave}>
            저장
          </Button>
          <DeleteAlertDialog btnName="Remove" handleClick={goDelete} />
        </div>
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
            <span className={styles.progressBar__status}>
              {count}/{boards.contents.length} completed
            </span>
            {/* 프로그래스 UI */}
            <Progress
              value={
                boards.contents.length > 0
                  ? (count / boards.contents.length) * 100
                  : 0
              }
              className="w-50 h-2"
              indicatorColor="bg-green-500"
            />
          </div>
          <div className={styles.calenderBox}>
            <div className={styles.calenderBox__calender}>
              {/* calender UI */}
              <LabelCalender
                label="From"
                startEndDate={startDate}
                handleDate={setStartDate}
              />
              <LabelCalender
                label="To"
                startEndDate={endDate}
                handleDate={setEndDate}
              />
            </div>
            <Button
              variant="outline"
              className="w-[15%] border-orange-500 bg-orange-400  text-white hover:bg-orange-400 hover:text-white"
              onClick={handelCreateBoard}
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
              <button className={styles.button} onClick={handelCreateBoard}>
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
                  setDeleteData={setDeleteFlg}
                  setUpdateData={setUpdateFlg}
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
