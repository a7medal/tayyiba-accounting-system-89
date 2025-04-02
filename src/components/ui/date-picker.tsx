
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  dateFormat?: string;
  withTime?: boolean;
}

export function DatePicker({
  date,
  setDate,
  className,
  placeholder = "اختر تاريخ",
  dateFormat = "yyyy/MM/dd",
  withTime = false,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-right font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="ml-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="pointer-events-auto p-3"
        />
        {withTime && date && (
          <div className="p-3 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm">وقت:</div>
              <input
                type="time"
                className="border rounded px-2 py-1 text-sm"
                value={date ? format(date, "HH:mm") : ""}
                onChange={(e) => {
                  if (date) {
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = new Date(date);
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    setDate(newDate);
                  }
                }}
              />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
