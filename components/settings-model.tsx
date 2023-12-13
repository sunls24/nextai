import React, { useEffect, useState } from "react";
import { useConfig } from "@/lib/store/config";
import SelectWarp from "@/components/select-warp";
import { models } from "@/lib/constants";

function SettingsModel({ className }: { className?: string }) {
  const UpdateConfig = useConfig((state) => state.Update);
  const modelConfig = useConfig((state) => state.apiConfig.model);
  const [model, setModel] = useState(modelConfig);

  useEffect(() => {
    model !== modelConfig && setModel(modelConfig);
  }, [modelConfig]);

  function onModelChange(value: string) {
    setModel(value);
    UpdateConfig((c) => (c.apiConfig.model = value));
  }

  return (
    <SelectWarp
      label="Model"
      infoList={models}
      select={model}
      onValueChange={onModelChange}
      className={className}
      widthClass="w-[180px]"
    />
  );
}

export default SettingsModel;
