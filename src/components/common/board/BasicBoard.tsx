"use client";

import { Checkbox } from "@/components/ui/checkbox";
import styles from "./BasicBoard.module.scss";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import LabelCalender from "../calender/LabelCalender";
import MarkdownDialog from "../dialog/MarkdownDialog";
import { useState } from "react";
import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import MDEditor from "@uiw/react-md-editor";

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

interface Props {
  data: BoardContent;
  setDeleteDate: (value: boolean) => void;
  setUpdateDate: (value: boolean) => void;
}

function BasicBoard({ data, setDeleteDate, setUpdateDate }: Props) {
  const pathname = usePathname();
  const [clickArrow, setClickArrow] = useState<boolean>(false);
  console.log("clickArrow : ", clickArrow);
  console.log("board data : ", data);

  //board데이터 삭제
  const handleDelete = async (boardId: string | number) => {
    console.log("id : ", boardId);
    const {
      data: todos,
      error,
      status,
    } = await supabase.from("todos").select("*");

    if (error) {
      console.log("Error fetching todos:", error);
      return;
    }

    if (todos) {
      console.log("Fetched todos:", todos);
      todos.map((item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])) {
          const result = item.contents.filter(
            (content) => content.boardId !== boardId,
          );
          console.log("result ; ", result);
          upDateRowData(result);
        }
      });
    }
  };

  const upDateRowData = async (contents: BoardContent[]) => {
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
      setDeleteDate(true);
    }
  };

  const handleClickUp = () => {
    console.log("click up ");
    setClickArrow(false);
  };

  const handleClickDown = () => {
    console.log("click down");
    setClickArrow(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.container__header__titleBox}>
          <Checkbox className="w-5 h-5" />
          {data.title !== "" ? (
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              {data.title}
            </h3>
          ) : (
            <span className={styles.title}>
              Please enter a title for the board
            </span>
          )}
        </div>

        {!clickArrow ? (
          <Button variant="ghost" className="p-0" onClick={handleClickDown}>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </Button>
        ) : (
          <Button variant="ghost" className="p-0" onClick={handleClickUp}>
            <ChevronUp className="w-5 h-5 text-gray-400" />
          </Button>
        )}
      </div>
      <div className={styles.container__body}>
        <div className={styles.container__body__calenderBox}>
          <LabelCalender label="From" startEndDate={data.startDate} readonly />
          <LabelCalender label="To" startEndDate={data.endDate} readonly />
          {/* <div className='flex items-center gap-3'>
            <span className='text-[#6d6d6d]'>From</span>
            <input value={data.startDate.split('T')[0]} />
          </div> */}
        </div>
        <div className={styles.container__body__buttonBox}>
          <Button
            variant="ghost"
            className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500"
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500"
            onClick={() => {
              handleDelete(data.boardId);
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      {data.content && !clickArrow && (
        <Card className="w-full p-4 mb-3">
          <MDEditor value={data.content} height={"100%"} />
        </Card>
      )}
      <div className={styles.container__footer}>
        <MarkdownDialog data={data} setDoneflg={setUpdateDate} />
      </div>
    </div>
  );
}

export default BasicBoard;
