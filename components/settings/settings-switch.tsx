import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function SettingsSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex h-9 items-center justify-between">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default SettingsSwitch;
