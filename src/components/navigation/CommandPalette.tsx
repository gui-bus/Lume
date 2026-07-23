"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Command } from "cmdk";
import {
  Monitor,
  Moon,
  Sun,
  Globe,
  House,
  FileText,
  Keyboard,
  ChartBar,
  Key,
  Gear,
} from "@phosphor-icons/react";
import { useTheme } from "@/components/theme-provider";

export function CommandPalette() {
  const t = useTranslations("common");
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey || e.altKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCommand = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const currentResumeId = searchParams.get("id");

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-card border border-border/40 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="flex flex-col h-full focus-visible:outline-none">
          <Command.Input
            autoFocus
            placeholder={t("commandPalette.placeholder")}
            className="w-full bg-transparent px-4 py-4 text-sm outline-none border-b border-border/40 text-foreground placeholder:text-muted-foreground font-semibold"
          />
          <Command.List className="max-h-[300px] overflow-y-auto p-2 space-y-1">
            <Command.Empty className="px-4 py-6 text-center text-sm text-muted-foreground font-medium">
              {t("commandPalette.empty")}
            </Command.Empty>

            <Command.Group
              heading={t("commandPalette.navigation")}
              className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-3 py-2"
            >
              <Command.Item
                onSelect={() =>
                  handleCommand(() => router.push(`/${activeLocale}/dashboard`))
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
              >
                <House size={18} />
                {t("commandPalette.goDashboard")}
              </Command.Item>

              {currentResumeId && (
                <>
                  <Command.Item
                    onSelect={() =>
                      handleCommand(() =>
                        router.push(`/${activeLocale}/?id=${currentResumeId}`),
                      )
                    }
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
                  >
                    <FileText size={18} />
                    {t("commandPalette.editCurrent")}
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      handleCommand(() =>
                        router.push(
                          `/${activeLocale}/editor/${currentResumeId}/ats-reader`,
                        ),
                      )
                    }
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
                  >
                    <Monitor size={18} />
                    {t("commandPalette.openAts")}
                  </Command.Item>
                  <Command.Item
                    onSelect={() =>
                      handleCommand(() =>
                        router.push(
                          `/${activeLocale}/dashboard/analytics/${currentResumeId}`,
                        ),
                      )
                    }
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
                  >
                    <ChartBar size={18} />
                    {t("commandPalette.viewMetrics")}
                  </Command.Item>
                </>
              )}
            </Command.Group>

            <Command.Group
              heading={t("commandPalette.preferences")}
              className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-3 py-2"
            >
              <Command.Item
                onSelect={() =>
                  handleCommand(() =>
                    setTheme(theme === "dark" ? "light" : "dark"),
                  )
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {t("commandPalette.toggleTheme")}
              </Command.Item>
              <Command.Item
                onSelect={() =>
                  handleCommand(() => {
                    const target = activeLocale === "pt" ? "en" : "pt";
                    const newPath = pathname.replace(
                      `/${activeLocale}`,
                      `/${target}`,
                    );
                    router.push(newPath);
                  })
                }
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
              >
                <Globe size={18} />
                {t("commandPalette.changeLang")}
              </Command.Item>
            </Command.Group>

            {currentResumeId && (
              <Command.Group
                heading={t("commandPalette.editorActions")}
                className="text-[10px] uppercase font-black tracking-widest text-muted-foreground px-3 py-2"
              >
                <Command.Item
                  onSelect={() =>
                    handleCommand(() => {
                      const btn = document.querySelector(
                        '[data-action="download-pdf"]',
                      ) as HTMLButtonElement;
                      if (btn) btn.click();
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
                >
                  <FileText size={18} />
                  {t("commandPalette.downloadPdf")}
                </Command.Item>
                <Command.Item
                  onSelect={() =>
                    handleCommand(() => {
                      const btn = document.querySelector(
                        '[data-action="copy-plain-text"]',
                      ) as HTMLButtonElement;
                      if (btn) btn.click();
                    })
                  }
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold hover:bg-muted text-foreground/90 transition-colors"
                >
                  <FileText size={18} />
                  {t("commandPalette.copyPlainText")}
                </Command.Item>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
