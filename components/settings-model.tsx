import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfig } from "@/lib/store/config";
import { models } from "@/lib/constants";
import { clsx } from "clsx";
import Mounted from "@/components/mounted";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsModel({
  className,
  disabled = false,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const updateConfig = useConfig((state) => state.Update);
  const modelConfig = useConfig((state) => state.apiConfig.model);
  const [model, setModel] = useState(modelConfig);

  useEffect(() => {
    model !== modelConfig && setModel(modelConfig);
  }, [modelConfig]);

  function onModelChange(value: string) {
    setModel(value);
    updateConfig((c) => (c.apiConfig.model = value));
  }

  return (
    <div className={clsx("flex items-center justify-between", className)}>
      <Label className="shrink-0">Model</Label>
      <Mounted fallback={<Skeleton className="h-9 w-[180px]" />}>
        <Select value={model} onValueChange={onModelChange} disabled={disabled}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((value, index) => (
              <SelectItem key={index} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Mounted>
    </div>
  );
}

export default SettingsModel;
