import React from "react";
import { Card } from "@/components/ui/card";
import SettingsInput from "@/components/settings/settings-input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import SettingsGoogle from "@/components/settings/settings-google";
import { Plugins } from "@/lib/store/config-chat";

function SettingsPlugins({
  plugins,
  updatePlugins,
}: {
  plugins: Plugins;
  updatePlugins: (fn: (p: Plugins) => void) => void;
}) {
  return (
    <Card className="flex flex-col gap-4 p-4">
      <Label>插件设置</Label>
      <Separator />
      <SettingsGoogle />
      {plugins.googleSearch.enabled && (
        <>
          <SettingsInput
            label="API Key"
            placeholder="自定义 Search API Key"
            value={plugins.googleSearch.apiKey}
            onChange={(v) => updatePlugins((p) => (p.googleSearch.apiKey = v))}
          />
          <SettingsInput
            label="Engine ID"
            placeholder="自定义 Search Engine ID"
            value={plugins.googleSearch.engineId}
            onChange={(v) =>
              updatePlugins((p) => (p.googleSearch.engineId = v))
            }
          />
        </>
      )}
    </Card>
  );
}

export default SettingsPlugins;
