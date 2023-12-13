import React from "react";
import { clsx } from "clsx";
import { Loader } from "lucide-react";

function Result({
  img,
  isLoading,
}: {
  isLoading: boolean;
  img: string | undefined;
}) {
  return (
    <div className="w-full">
      <img
        src={img ?? "/nothing.svg"}
        draggable={false}
        alt="generate image"
        className={clsx("w-full", !img && "mx-auto w-9/12")}
      />
      {isLoading && (
        <div className="flex items-center justify-center gap-2 pb-2">
          <Loader size={22} className="animate-spin" strokeWidth={1.5} />
          <span className="text-muted-foreground">精彩即将呈现</span>
        </div>
      )}
    </div>
  );
}

export default Result;
