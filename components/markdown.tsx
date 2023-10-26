import React, { MouseEventHandler, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { copyToClipboard } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ClipboardCopy } from "lucide-react";

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{ code: Code }}
      remarkPlugins={[remarkGfm]}
      className="prose prose-sm prose-zinc max-w-none dark:prose-invert prose-pre:m-0 prose-pre:bg-secondary prose-pre:p-0 prose-pre:text-[15px]"
    >
      {content}
    </ReactMarkdown>
  );
}

export default React.memo(Markdown);

const Code = React.memo(function Code({
  node,
  inline,
  className,
  children,
  ...props
}: CodeProps) {
  const lang = useMemo(
    () => (/language-(\w+)/.exec(className || "") || [""])[1],
    [className],
  );
  const content = useMemo(
    () => String(children).replace(/\n$/, ""),
    [children],
  );
  const copyClick = useCallback(() => copyToClipboard(content), [content]);

  const { resolvedTheme } = useTheme();
  return !inline ? (
    <div className="hover-trigger relative">
      <CopyBtn click={copyClick} />
      <SyntaxHighlighter
        {...props}
        style={resolvedTheme === "dark" ? oneDark : oneLight}
        customStyle={{
          margin: "0",
          padding: "10px",
          lineHeight: "20px",
          borderRadius: "calc(var(--radius)-2px)",
        }}
        language={lang}
        PreTag="div"
      >
        {content}
      </SyntaxHighlighter>
    </div>
  ) : (
    <code {...props} className={className}>
      {children}
    </code>
  );
});

const CopyBtn = React.memo(function CopyBtn({
  click,
}: {
  click: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={click}
      className="hover-show absolute right-1 top-1 h-8 w-8 text-foreground"
    >
      <ClipboardCopy strokeWidth={1.5} size={18} />
    </Button>
  );
});
