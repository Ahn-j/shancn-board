"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

//custom props 추가(indicatorColor)
interface ProgressProps extends React.ComponentProps<
  typeof ProgressPrimitive.Root
> {
  indicatorColor?: string;
}
function Progress({
  className,
  value,
  indicatorColor,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={` h-full w-full flex-1 transition-all ${indicatorColor ? indicatorColor : "bg-primary"}`} //indicatorColor 가 있으면 해당 색상 적용, 없으면 기본색상 적용
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
