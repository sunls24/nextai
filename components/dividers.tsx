import React from "react";
import clsx from "clsx";

const lineStyle = "h-[1.5px] grow bg-foreground";

function Dividers({
  text,
  className,
  hoverText,
  hoverClick,
}: {
  text: string;
  className?: string;
  hoverText?: string;
  hoverClick?: () => void;
}) {
  return (
    <div className={clsx("flex h-6 items-center gap-2", className)}>
      <span className={lineStyle}></span>
      <div className="hover-trigger relative text-xs">
        <span className={clsx(hoverText && "hover-hidden", "italic")}>
          {text}
        </span>
        {hoverText && (
          <button
            onClick={hoverClick}
            className="hover-show absolute left-0 top-0 font-medium text-red-500"
          >
            {hoverText}
          </button>
        )}
      </div>
      <span className={lineStyle}></span>
    </div>
  );
}

export default React.memo(Dividers);
