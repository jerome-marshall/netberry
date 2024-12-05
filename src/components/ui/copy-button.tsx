import * as React from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { cn, copyToClipboard } from "@/utils/utils";
import { Button } from "./button";
import { ClipboardCopy, ClipboardCheck } from "lucide-react";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function CopyButtonSm({
  value,
  className,
  children,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    }
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative z-10 h-7 w-7 bg-background-primary text-text-muted hover:bg-background-alt_hover hover:text-white",
        className
      )}
      onClick={() => {
        copyToClipboard(value)
          .then(() => {
            setHasCopied(true);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      {...props}
    >
      {children || (
        <>
          <span className="sr-only">Copy</span>
          {hasCopied ? (
            <CheckIcon className="h-3.5 w-3.5" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
        </>
      )}
    </Button>
  );
}

export function CopyButton({
  value,
  className,
  children,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      setTimeout(() => {
        setHasCopied(false);
      }, 3000);
    }
  }, [hasCopied]);

  return (
    <button
      className={cn("button", className)}
      onClick={() => {
        copyToClipboard(value)
          .then(() => {
            setHasCopied(true);
          })
          .catch((err) => {
            console.error(err);
          });
      }}
      {...props}
      disabled={hasCopied}
    >
      {children ||
        (hasCopied ? (
          <>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ClipboardCopy className="mr-2 h-4 w-4" />
            <span>Copy</span>
          </>
        ))}
    </button>
  );
}
