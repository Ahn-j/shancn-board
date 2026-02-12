"use client";

import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui";
import { useState } from "react";

interface props {
  btnName: string;
  handleClick: (data: boolean) => void;
}

function DeleteAlertDialog({ btnName, handleClick }: props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = () => {
    // deleteTask(Number(id));
    handleClick(true);
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="text-rose-600 bg-red-50 hover:bg-rose-50"
        >
          {btnName}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you delete sure?</AlertDialogTitle>
          <AlertDialogDescription>
            영구 삭제가됩니다. 그래도 삭제 할래?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="default">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="outline"
            size="default"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlertDialog;
