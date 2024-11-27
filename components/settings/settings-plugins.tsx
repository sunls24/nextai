import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import SettingsGoogle from "@/components/settings/settings-google";

function SettingsPlugins() {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <Label>插件设置</Label>
      <Separator />
      <SettingsGoogle />
    </Card>
  );
}

export default SettingsPlugins;
