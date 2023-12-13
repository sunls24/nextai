import React from "react";
import { Loader } from "lucide-react";

function Result({
  img,
  isLoading,
}: {
  isLoading: boolean;
  img: string | undefined;
}) {
  return (
    <div className="w-full sm:aspect-square">
      {img ? (
        <Img url={img} />
      ) : (
        <div className="mx-auto w-10/12 sm:pt-6">
          <Img url="/nothing.svg" />
        </div>
      )}
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

function Img({ url }: { url: string }) {
  return (
    <img
      src={url}
      alt="An error occurred"
      draggable={false}
      className="w-full"
    />
  );
}
