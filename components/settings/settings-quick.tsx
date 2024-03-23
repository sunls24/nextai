import React from "react";
import { Card } from "@/components/ui/card";
import SettingsModel from "@/components/settings/settings-model";
import { Separator } from "@/components/ui/separator";
import SettingsTemperature from "@/components/settings/settings-temperature";
import SettingsGoogle from "@/components/settings/settings-google";
import { Settings2 } from "lucide-react";

function SettingsQuick() {
  return (
    <Card className="mb-3 flex flex-col gap-4 p-4">
      <div className="flex items-center gap-1">
        <Settings2 size={20} strokeWidth={1.8} />
        <h3 className="font-medium">快捷设置</h3>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <SettingsModel className="md:max-w-xs md:flex-1" />
        <SettingsTemperature className="md:max-w-xs md:flex-1" />
        <SettingsGoogle className="md:w-[180px]" />
      </div>
    </Card>
  );
}

export default React.memo(SettingsQuick);
