"use client";

import { Checkbox } from "@/components/ui/checkbox/checkbox";
import styles from "./BasicBoard.module.scss";
import { ChevronDown, ChevronUp } from "lucide-react";
import LabelCalender from "../calender/LabelCalender";
import MarkdownDialog from "../dialog/MarkdownDialog";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Card, Button } from "@/components/ui";
import MDEditor from "@uiw/react-md-editor";
import { Todo, BoardContent } from "@/types";
import { useDeleteBoard } from "@/hooks/apis";
import DeleteAlertDialog from "../dialog/DeleteAlertDialog";

interface Props {
  data: BoardContent;
  setDeleteData: (value: boolean) => void;
  setUpdateData: (value: boolean) => void;
}

function BasicBoard({ data, setDeleteData, setUpdateData }: Props) {
  const pathname = usePathname();
  const { id } = useParams();
  const [clickArrow, setClickArrow] = useState<boolean>(false);

  const { deleteBoard } = useDeleteBoard();

  //board데이터 삭제
  const handleDelete = async (boardId: string | number) => {
    const result = await deleteBoard(Number(id), String(boardId));
    if (result) {
      toast.success("업데이트 완료!!!");
      setDeleteData(true);
    }
  };

  const handleClickUp = () => {
    setClickArrow(false);
  };

  const handleClickDown = () => {
    setClickArrow(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.container__header__titleBox}>
          <Checkbox className="w-5 h-5" disabled checked={data.inCompleted} />
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
        </div>
        <div className={styles.container__body__buttonBox}>
          <Button
            variant="ghost"
            className="font-normal text-gray-400 hover:bg-green-50 hover:text-green-500"
          >
            Duplicate
          </Button>
          {/* <Button
            variant="ghost"
            className="font-normal text-gray-400 hover:bg-red-50 hover:text-red-500"
            onClick={() => {
              handleDelete(data.boardId);
            }}
          >
            Delete
          </Button> */}
          <DeleteAlertDialog
            btnName="Delete"
            handleClick={() => {
              handleDelete(data.boardId);
            }}
          />
        </div>
      </div>
      {data.content && !clickArrow && (
        <Card className="w-full p-4 mb-3">
          <MDEditor value={data.content} height={"100%"} />
        </Card>
      )}
      <div className={styles.container__footer}>
        <MarkdownDialog data={data} setDoneflg={setUpdateData} />
      </div>
    </div>
  );
}

export default BasicBoard;
