"use client";
import React from "react";
import SettingsModel from "@/components/settings/settings-model";
import SettingsTemperature from "@/components/settings/settings-temperature";
import SettingsGoogle from "@/components/settings/settings-google";

function SettingsQuick() {
  return (
    <div className="flex flex-col gap-1 px-4 pb-1 pt-2 md:flex-row md:justify-between md:gap-4 md:py-3">
      <SettingsModel className="md:max-w-xs md:flex-1" />
      <SettingsTemperature className="md:max-w-xs md:flex-1" />
      <SettingsGoogle className="md:w-[180px]" />
    </div>
  );
}

export default React.memo(SettingsQuick);
