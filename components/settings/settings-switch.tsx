import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function SettingsSwitch({
  label,
  checked,
  onChange,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex h-9 items-center justify-between gap-2">
      <Label>{label}</Label>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

export default SettingsSwitch;
