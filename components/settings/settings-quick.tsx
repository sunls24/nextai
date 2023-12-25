import React from "react";
import { Card } from "@/components/ui/card";
import SettingsModel from "@/components/settings/settings-model";
import { Separator } from "@/components/ui/separator";
import SettingsTemperature from "@/components/settings/settings-temperature";
import SettingsGoogle from "@/components/settings/settings-google";
import { Settings2 } from "lucide-react";
import { useConfig } from "@/lib/store/config-chat";
import SelectWarp from "@/components/select-warp";
import { providerSelect } from "@/lib/constants";

function SettingsQuick() {
  const provider = useConfig((state) => state.provider);
  const updateConfig = useConfig((state) => state.update);
  return (
    <Card className="mb-3 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-1">
        <Settings2 size={20} strokeWidth={1.8} />
        <h3 className="font-medium">快捷设置</h3>
        <div className="flex-1" />
        <SelectWarp
          select={provider}
          widthClass="w-[100px]"
          infoList={providerSelect}
          onValueChange={(v) => updateConfig((cfg) => (cfg.provider = v))}
        />
      </div>
      <Separator />
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <SettingsModel className="md:max-w-xs md:flex-1" />
        <SettingsTemperature className="md:max-w-xs md:flex-1" />
        <SettingsGoogle
          className="md:w-[180px]"
          disabled={provider !== "openai"}
        />
      </div>
    </Card>
  );
}

export default React.memo(SettingsQuick);
