import React, { useState } from "react";
import { useImageConfig } from "@/lib/store/image/config";
import SelectWarp from "@/components/select-warp";
import { Button } from "@/components/ui/button";
import Textarea from "@/components/textarea";
import { RefreshCcw } from "lucide-react";
import { ImageSelect } from "@/lib/constants";

function Settings({
  isLoading,
  onGenerate,
}: {
  isLoading: boolean;
  onGenerate: (text: string) => Promise<void>;
}) {
  const UpdateConfig = useImageConfig((state) => state.Update);
  const [model, setModel] = useState(useImageConfig((state) => state.model));
  const [style, setStyle] = useState(useImageConfig((state) => state.style));
  const [size, setSize] = useState(useImageConfig((state) => state.size));
  const [quality, setQuality] = useState(
    useImageConfig((state) => state.quality),
  );

  const [text, setText] = useState<string>();

  function onModelChange(select: string) {
    setModel(select);
    UpdateConfig((cfg) => (cfg.model = select));
  }

  function onStyleChange(select: string) {
    setStyle(select);
    UpdateConfig((cfg) => (cfg.style = select));
  }

  function onSizeChange(select: string) {
    setSize(select);
    UpdateConfig((cfg) => (cfg.size = select));
  }

  function onQualityChange(select: string) {
    setQuality(select);
    UpdateConfig((cfg) => (cfg.quality = select));
  }

  async function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Enter" || e.nativeEvent.isComposing || e.shiftKey) {
      return;
    }
    e.preventDefault();
    await onClick();
  }

  async function onClick() {
    if (isLoading || !text) {
      return;
    }
    await onGenerate(text);
  }

  return (
    <div className="flex w-full flex-col gap-4 px-6 py-4 sm:justify-center sm:gap-5 sm:p-14">
      <SelectWarp
        label="模型"
        select={model}
        infoList={ImageSelect.model}
        onValueChange={onModelChange}
        widthClass="w-[130px]"
        disabled={isLoading}
      />
      <SelectWarp
        label="风格"
        select={style}
        infoList={ImageSelect.style}
        onValueChange={onStyleChange}
        widthClass="w-[130px]"
        disabled={isLoading}
      />
      <SelectWarp
        label="尺寸"
        select={size}
        infoList={ImageSelect.size}
        onValueChange={onSizeChange}
        widthClass="w-[130px]"
        disabled={isLoading}
      />
      <SelectWarp
        label="质量"
        select={quality}
        infoList={ImageSelect.quality}
        onValueChange={onQualityChange}
        widthClass="w-[130px]"
        disabled={isLoading}
      />
      <Textarea
        placeholder="生成图像的文字描述，例如：生成一只可爱的小猫 🐱"
        value={text}
        autoFocus={true}
        disabled={isLoading}
        onChange={(e) => setText(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        rows={3}
        minRows={3}
        maxRows={3}
      />
      <div className="flex flex-row-reverse">
        <Button className="w-32" onClick={onClick} disabled={isLoading}>
          {isLoading && (
            <RefreshCcw
              size={20}
              strokeWidth={1.8}
              className="mr-2 animate-spin"
            />
          )}
          生成
        </Button>
      </div>
    </div>
  );
}

export default Settings;
