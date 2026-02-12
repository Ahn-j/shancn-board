"use client";

import styles from "./LabelCalender.module.scss";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar/calendar";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { useEffect, useState } from "react";

interface Props {
  label: string;
  readonly?: boolean;
  startEndDate?: Date | string;
  handleDate?: (value: Date | undefined) => void;
}

function LabelCalender({ label, readonly, startEndDate, handleDate }: Props) {
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (startEndDate) {
      setDate(new Date(startEndDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startEndDate]);

  const handleSelect = (value: Date | undefined) => {
    setDate(value);
    if (handleDate) handleDate(value);
  };

  return (
    <div className={styles.container}>
      <span className={styles.container__label}>{label}</span>
      {/* calendar + popover (dataPicker) UI */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-40 justify-start text-left font-normal"
          >
            <CalendarIcon />
            {date ? format(date, "yyyy/MM/dd") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        {!readonly && (
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(val) => handleSelect(val)}
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}

export default LabelCalender;
