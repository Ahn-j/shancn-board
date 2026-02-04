"use client";

import { Button } from "@/components/ui/button";
import styles from "./MarkdownDialog.module.scss";

import MDEditor from "@uiw/react-md-editor";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import LabelCalender from "../calender/LabelCalender";
import { Separator } from "@/components/ui/separator";
import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { start } from "repl";
import { usePathname } from "next/navigation";

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
  setDoneflg: (value: boolean) => void;
}

function MarkdownDialog({ data, setDoneflg }: Props) {
  console.log("mock data", data);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [content, setContent] = useState<string | undefined>("");

  console.log("startDate; ", startDate);
  console.log("endDate; ", endDate);
  //初期処理
  useEffect(() => {
    console.log("first ssssssssss--------");
    setTitle(data.title);
    // console.log("data.startDate : ", data.startDate);
    // console.log("data.startDate : ", new Date(data.startDate));
    // setStartDate(new Date(data.startDate));
    // setEndDate(new Date(data.endDate));
    setContent(data.content);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  //------------------------------------------------------------
  const onSubmit = async () => {
    if (title.trim().length === 0) {
      toast.error("Please enter a title for the content.");
      return;
    }
    if (!startDate) {
      toast.error("시작날짜 입력");
      return;
    }
    if (!endDate) {
      toast.error("끝 날짜 입력");
      return;
    }
    if (!content || content.trim().length === 0) {
      toast.error("Please enter content in the markdown editor.");
      return;
    }

    //해당 보드에 대한 데이터만 수정이 되도록한다.
    const { data: todos } = await supabase.from("todos").select("*");
    console.log("todos : ", todos);
    if (todos !== null) {
      todos.forEach(async (item: Todo) => {
        if (item.id === Number(pathname.split("/")[2])) {
          console.log("item : ", item);
          item.contents.forEach((el: BoardContent) => {
            console.log("el : ", el);
            console.log("data boardId: ", data.boardId);
            if (el.boardId === data.boardId) {
              el.title = title;
              el.content = content;
              el.startDate = startDate;
              el.endDate = endDate;
            } else {
              el.title = el.title;
              el.content = el.content;
              el.startDate = el.startDate;
              el.endDate = el.endDate;
            }
          });

          console.log("item.contents : ", item.contents);
          //supabase 연동
          const { error, status } = await supabase
            .from("todos")
            .update({
              contents: item.contents,
            })
            .eq("id", pathname.split("/")[2]);

          if (error) {
            toast.error("Error updating error: " + error.message);
            return;
          }

          if (status === 204) {
            toast.success("Data updated successfully!");

            //모든 입력값 초기화
            setTitle("");
            setContent("");

            setIsOpen(false);

            setDoneflg(true);
          }
        }
      });
    } else {
      return;
    }
  };

  const handleChgTitle = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("title : ", e.target.value);
    setTitle(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {data.title ? (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            update Contents
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="font-normal text-gray-400 hover:text-gray-500 cursor-pointer"
          >
            add Contents
          </Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className={styles.dialog__titleBox}>
              <Checkbox className="w-5 h-5" />
              <input
                type="text"
                value={title}
                placeholder="Please enter content title"
                className={styles.dialog__titleBox__title}
                onChange={handleChgTitle}
              />
            </div>
          </DialogTitle>
          <div className={styles.dialog__calendarBox}>
            <LabelCalender
              label="From"
              startEndDate={data.startDate}
              handleDate={setStartDate}
            />
            <LabelCalender
              label="To"
              startEndDate={data.endDate}
              handleDate={setEndDate}
            />
          </div>
          <Separator className="my-4" />
          <div className={styles.dialog__markdownBox}>
            <MDEditor
              value={content}
              onChange={(e) => setContent(e)}
              height={"100%"}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className={styles.dialog__buttonBox}>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="font-normal text-gray-400 hover:bg-green-50 hover:text-gray-500"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="ghost"
              className="font-normal border-orange-500 bg-orange-400  text-white hover:bg-orange-400 hover:text-white"
              onClick={onSubmit}
            >
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MarkdownDialog;
