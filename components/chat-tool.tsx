import React from "react";
import { Loader } from "lucide-react";
import { ToolInvocation } from "ai";

// TODO: 暂时只支持谷歌搜索工具调用
function ChatTool({ tool }: { tool: ToolInvocation }) {
  return (
    <div className="max-w-full rounded-md border">
      <div className="flex items-center p-2">
        <span className="font-medium">谷歌搜索：</span>
        {tool.args.keyword}
        {tool.state !== "result" && (
          <Loader
            size={20}
            className="ml-1 inline animate-spin"
            strokeWidth={1.5}
          />
        )}
      </div>
      {tool.state === "result" && (
        <div className="space-y-2 border-t p-2">
          {typeof tool.result === "string" && tool.result}
          {Array.isArray(tool.result) &&
            tool.result.map((v: any, i: number) => (
              <a
                key={i}
                className="block w-fit cursor-pointer underline decoration-transparent underline-offset-4 transition-colors hover:text-blue-400 hover:decoration-blue-400"
                href={v.link}
                target="_blank"
              >
                {v.title}
              </a>
            ))}
        </div>
      )}
    </div>
  );
}

export default ChatTool;
