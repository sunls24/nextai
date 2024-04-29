import React, { ReactElement } from "react";
import { clsx } from "clsx";
import { Label } from "@/components/ui/label";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SelectInfo } from "@/lib/types";

function SelectWarp({
  label,
  select,
  infoList,
  onValueChange,
  className,
  widthClass,
  disabled,
  icon,
}: {
  label?: string;
  select: string;
  infoList: SelectInfo[];
  onValueChange: (v: string) => void;
  className?: string;
  widthClass?: string;
  disabled?: boolean;
  icon?: ReactElement;
}) {
  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {icon}
      {label && <Label className="shrink-0">{label}</Label>}
      <div className="flex-1" />
      <Mounted fallback={<Skeleton className={clsx("h-9", widthClass)} />}>
        <Select
          value={select}
          disabled={disabled}
          onValueChange={onValueChange}
        >
          <SelectTrigger className={widthClass}>
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            {infoList.map((info, index) => (
              <SelectGroup key={index}>
                <SelectLabel>{info.name}</SelectLabel>
                {info.list.map((item, i) => (
                  <SelectItem key={i} value={item}>
                    {item}
                  </SelectItem>
                ))}
                {index < infoList.length - 1 && (
                  <Separator className="mx-auto mb-0.5 mt-1 w-11/12" />
                )}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </Mounted>
    </div>
  );
}

export default SelectWarp;
