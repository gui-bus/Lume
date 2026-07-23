"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  TextB,
  TextItalic,
  ListBullets,
  Link as LinkIcon,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const MarkdownTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const localRef = useRef<HTMLTextAreaElement | null>(null);

    const handleRef = (node: HTMLTextAreaElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          node;
      }
    };

    const insertMarkdown = (syntax: string) => {
      const textarea = localRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const selectedText = text.substring(start, end);

      let replacement = "";
      if (syntax === "bold") {
        replacement = `**${selectedText || "texto"}**`;
      } else if (syntax === "italic") {
        replacement = `*${selectedText || "texto"}*`;
      } else if (syntax === "list") {
        replacement = `\n- ${selectedText || "item"}`;
      } else if (syntax === "link") {
        replacement = `[${selectedText || "link"}](https://url.com)`;
      }

      const newValue =
        text.substring(0, start) + replacement + text.substring(end);
      textarea.value = newValue;

      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);

      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    };

    return (
      <div className="relative w-full flex flex-col group">
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute -top-10 left-3 z-30 flex items-center gap-1 p-1 bg-popover border border-border/40 rounded-xl shadow-lg backdrop-blur-md"
            >
              <button
                type="button"
                onClick={() => insertMarkdown("bold")}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Negrito"
              >
                <TextB size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("italic")}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Itálico"
              >
                <TextItalic size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("list")}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Lista"
              >
                <ListBullets size={14} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown("link")}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Link"
              >
                <LinkIcon size={14} weight="bold" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          ref={handleRef}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setTimeout(() => setIsFocused(false), 200);
            if (onBlur) onBlur(e);
          }}
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
MarkdownTextarea.displayName = "MarkdownTextarea";

export { MarkdownTextarea };
