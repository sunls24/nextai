import React from "react";
import { Card } from "@/components/ui/card";
import SettingsInput from "@/components/settings/settings-input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import SettingsGoogle from "@/components/settings/settings-google";
import { Input } from "@/components/ui/input";
import TooltipWrap from "@/components/tooltip-wrap";
import { Info } from "lucide-react";
import { Plugins } from "@/lib/store/config-chat";
import SettingsSwitch from "@/components/settings/settings-switch";

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
      <Separator />
      <SettingsSwitch
        label="图像生成"
        checked={plugins.imageGeneration.enabled}
        onChange={(v) => updatePlugins((p) => (p.imageGeneration.enabled = v))}
      />
      <Separator />
      <SettingsSwitch
        label="浏览网页"
        checked={plugins.browseWebsite.enabled}
        onChange={(v) => updatePlugins((p) => (p.browseWebsite.enabled = v))}
      />
      {plugins.browseWebsite.enabled && (
        <div className="flex items-center gap-2">
          <Label>最大长度</Label>
          <TooltipWrap
            trigger={<Info className="hidden sm:block" size={16} />}
            content="避免触发 Token 限制"
          />
          <span className="flex-1" />
          <Input
            type="number"
            className="w-[25%]"
            value={plugins.browseWebsite.maxLength}
            onChange={(e) =>
              updatePlugins(
                (p) =>
                  (p.browseWebsite.maxLength = e.currentTarget.valueAsNumber),
              )
            }
          />
        </div>
      )}
      <Separator />
      <SettingsSwitch
        label="查询天气"
        checked={plugins.weatherInfo.enabled}
        onChange={(v) => updatePlugins((p) => (p.weatherInfo.enabled = v))}
      />
      {plugins.weatherInfo.enabled && (
        <SettingsInput
          label="高德 Key"
          placeholder="自定义高德 Key"
          value={plugins.weatherInfo.amapKey}
          onChange={(v) => updatePlugins((p) => (p.weatherInfo.amapKey = v))}
        />
      )}
    </Card>
  );
}

export default SettingsPlugins;
