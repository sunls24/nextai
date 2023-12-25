import React from "react";
import { useConfig } from "@/lib/store/config-chat";
import SelectWarp from "@/components/select-warp";
import { providerModel } from "@/lib/constants";

function SettingsModel({ className }: { className?: string }) {
  const model = useConfig((state) => state.apiConfig().model);
  const provider = useConfig((state) => state.provider);
  const updateConfig = useConfig((state) => state.update);

  return (
    <SelectWarp
      label="Model"
      infoList={providerModel[provider]}
      select={model}
      onValueChange={(v) => updateConfig((c) => (c.apiConfig().model = v))}
      className={className}
      widthClass="w-[180px]"
    />
  );
}

export default SettingsModel;
