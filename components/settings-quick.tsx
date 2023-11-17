import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import SettingsModel from "@/components/settings-model";
import { Separator } from "@/components/ui/separator";
import SettingsTemperature from "@/components/settings-temperature";
import SettingsGoogle from "@/components/settings-google";
import { Settings2 } from "lucide-react";
import { useConfig } from "@/lib/store/config";
import { clsx } from "clsx";

function SettingsQuick() {
  const loginEnable = useConfig((state) => state.login.enable);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    disabled !== loginEnable && setDisabled(loginEnable);
  }, [loginEnable]);

  return (
    <Card
      className={clsx(
        "mb-3 flex flex-col gap-4 p-4",
        disabled && "bg-secondary/60",
      )}
    >
      <div className="flex justify-center gap-1 md:justify-start">
        <Settings2 size={20} strokeWidth={1.8} />
        <h3 className="font-medium">快捷设置</h3>
      </div>
      <Separator />
      <div className="flex flex-col gap-4 md:flex-row md:justify-between">
        <SettingsModel className="md:max-w-xs md:flex-1" disabled={disabled} />
        <SettingsTemperature
          className="md:max-w-xs md:flex-1"
          disabled={disabled}
        />
        <SettingsGoogle className="md:w-[180px]" disabled={disabled} />
      </div>
    </Card>
  );
}

export default React.memo(SettingsQuick);
