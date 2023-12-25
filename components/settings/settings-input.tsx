import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useConfig } from "@/lib/store/config-chat";

function SettingsInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        className="w-[70%]"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value.trim())}
      />
    </div>
  );
}

export default SettingsInput;
