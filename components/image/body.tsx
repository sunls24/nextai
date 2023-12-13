"use client";
import React, { useState } from "react";
import Settings from "@/components/image/settings";
import Result from "@/components/image/result";
import { useImageConfig } from "@/lib/store/image/config";

function Body() {
  const config = useImageConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState<string>();

  async function onGenerate(text: string) {
    setIsLoading(true);
    // Todo
    setTimeout(() => setIsLoading(false), 1000);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Settings isLoading={isLoading} onGenerate={onGenerate} />
      <Result img={img} isLoading={isLoading} />
    </div>
  );
}

export default Body;
