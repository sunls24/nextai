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
import { ClipboardCopy, Dot } from "lucide-react";
import { clsx } from "clsx";
import { DOT_FLAG } from "@/lib/constants";

function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code: Code,
        a: (props) => {
          if (props.href === "dot") {
            return <DotIcon className="mb-[2px] inline" />;
          }
          return <a {...props} target="_blank" />;
        },
      }}
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
  const [content, dot] = useMemo(() => {
    if (inline) return ["", false];
    const content = String(children).replace(/\n$/, "");
    const dot = content.endsWith(DOT_FLAG);
    return [dot ? content.slice(0, -DOT_FLAG.length) : content, dot];
  }, [children]);
  const copyClick = useCallback(() => copyToClipboard(content), [content]);

  const { resolvedTheme } = useTheme();
  return !inline ? (
    <div className="hover-trigger relative">
      <CopyBtn click={copyClick} className={lang && "top-[22px]"} />
      {dot && <DotIcon className="absolute bottom-1 right-1" />}
      {lang && <Lang lang={lang} />}
      <SyntaxHighlighter
        {...props}
        style={resolvedTheme === "dark" ? oneDark : oneLight}
        customStyle={{
          margin: "0",
          padding: "8px",
          paddingTop: lang ? "28px" : "8px",
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
  className,
}: {
  click: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={click}
      className={clsx(
        "hover-show absolute right-0.5 top-0.5 h-8 w-8 text-foreground",
        className,
      )}
    >
      <ClipboardCopy strokeWidth={1.5} size={18} />
    </Button>
  );
});

const DotIcon = React.memo(function DotIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <Dot
      className={clsx(
        "animate-[pulse_.6s_cubic-bezier(0.4,0,0.6,1)_infinite] text-foreground",
        className,
      )}
      size={20}
      strokeWidth={10}
    />
  );
});

const Lang = React.memo(function Lang({ lang }: { lang: string }) {
  return (
    <div className="absolute w-full bg-border/50 px-2 py-0.5 text-xs text-muted-foreground">
      {lang}
    </div>
  );
});
