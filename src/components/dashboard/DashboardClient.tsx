"use client";

import { useState, useTransition, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsBoolean } from "nuqs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  Globe,
  Tag as TagIcon,
  SortAscending,
  SortDescending,
  DotsThreeVertical,
  Pencil,
  Copy,
  Trash,
  ChartBar,
  ShareNetwork,
  X,
  Check,
  Lock,
  Calendar,
  Eye,
  Download,
  Info,
  QrCode,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UserButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { EmptyState } from "@/components/ui/empty-state";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "@phosphor-icons/react";
import {
  deleteResume,
  duplicateResume,
  saveResume,
  attachTagToResume,
  detachTagFromResume,
  updateTagsOrder,
} from "@/app/actions/resumeActions";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ResumeCardData {
  id: string;
  title: string;
  locale: string;
  colorTheme: string;
  templateId: string;
  showQrCode: boolean;
  passwordHash: string | null;
  expiresAt: Date | null;
  maxViews: number | null;
  sectionsOrder: string[];
  tagsOrder: string[];
  views: number;
  downloads: number;
  updatedAt: Date;
  groupId: string;
  slug: string | null;
  tags: Tag[];
  content: any;
}

interface DashboardClientProps {
  initialResumes: ResumeCardData[];
  allUserTags: Tag[];
  userEmail: string;
  userName: string;
}

export function DashboardClient({
  initialResumes,
  allUserTags,
  userEmail,
  userName,
}: DashboardClientProps) {
  const t = useTranslations("common");
  const activeLocale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const [resumes, setResumes] = useState<ResumeCardData[]>(initialResumes);
  const [search, setSearch] = useState("");
  const [localeFilter, setLocaleFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"desc" | "asc">("desc");
  const [isShareOpenParam, setIsShareOpenParam] = useQueryState(
    "share",
    parseAsBoolean.withDefault(false),
  );
  const [selectedResume, setSelectedResume] = useState<ResumeCardData | null>(
    null,
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [resumeToDeleteId, setResumeToDeleteId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [password, setPassword] = useState("");
  const [removePassword, setRemovePassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [showQrCode, setShowQrCode] = useState(false);

  const [isTagsOpenParam, setIsTagsOpenParam] = useQueryState(
    "tags",
    parseAsBoolean.withDefault(false),
  );
  const [selectedResumeIdParam, setSelectedResumeIdParam] =
    useQueryState("resumeId");
  const [tagSortOrder, setTagSortOrder] = useState<"name" | "color">("name");

  useEffect(() => {
    if (isTagsOpenParam && selectedResumeIdParam) {
      const found = resumes.find((r) => r.id === selectedResumeIdParam);
      if (found) {
        setSelectedResume(found);
      }
    }
  }, [isTagsOpenParam, selectedResumeIdParam, resumes]);

  useEffect(() => {
    if (isShareOpenParam && selectedResumeIdParam) {
      const found = resumes.find((r) => r.id === selectedResumeIdParam);
      if (found) {
        setSelectedResume(found);
        setSlug(found.slug || "");
        setPassword("");
        setRemovePassword(false);
        setExpiresAt(
          found.expiresAt
            ? new Date(found.expiresAt).toISOString().split("T")[0]
            : "",
        );
        setMaxViews(found.maxViews || "");
        setShowQrCode(found.showQrCode);
      }
    }
  }, [isShareOpenParam, selectedResumeIdParam, resumes]);

  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");

  const tagColors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#6b7280",
  ];

  const handleCreateNew = async () => {
    try {
      const emptyResumeData = {
        personalInfo: {
          name: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
        },
        experiences: [],
        educations: [],
        skills: [],
        projects: [],
        languages: [],
        certifications: [],
        volunteering: [],
        courses: [],
      };

      const newResume = await saveResume(
        undefined,
        emptyResumeData,
        "Meu Currículo Otimizado",
        activeLocale,
        undefined,
        undefined,
        "modern",
      );

      router.push(`/${activeLocale}/?id=${newResume.id}`);
    } catch (err: any) {
      toast.error(t("dashboard.toasts.createError"));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/${activeLocale}/?id=${id}`);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateResume(id);
      toast.success(t("dashboard.toasts.duplicateSuccess"));
      router.push(`/${activeLocale}/?id=${copy.id}`);
    } catch (err: any) {
      toast.error(err.message || t("dashboard.toasts.duplicateError"));
    }
  };

  const handleDelete = async () => {
    if (!resumeToDeleteId) return;
    try {
      await deleteResume(resumeToDeleteId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeToDeleteId));
      toast.success(t("dashboard.toasts.deleteSuccess"));
      setIsDeleteOpen(false);
      setResumeToDeleteId(null);
    } catch (err: any) {
      toast.error(t("dashboard.toasts.deleteError"));
    }
  };

  const openShareSettings = (resume: ResumeCardData) => {
    setSelectedResumeIdParam(resume.id);
    setIsShareOpenParam(true);
  };

  const closeShareSettings = () => {
    setIsShareOpenParam(null);
    setSelectedResumeIdParam(null);
    setSelectedResume(null);
  };

  const handleSaveShareSettings = async () => {
    if (!selectedResume) return;

    try {
      const expirationDate = expiresAt ? new Date(expiresAt) : null;
      const passVal = removePassword ? null : password || undefined;

      await saveResume(
        selectedResume.id,
        selectedResume.content as any,
        selectedResume.title,
        selectedResume.locale,
        selectedResume.groupId,
        slug || undefined,
        selectedResume.templateId,
        showQrCode,
        passVal,
        expirationDate,
        maxViews === "" ? null : Number(maxViews),
        selectedResume.sectionsOrder,
      );

      setResumes((prev) =>
        prev.map((r) => {
          if (r.id === selectedResume.id) {
            return {
              ...r,
              slug: slug || null,
              showQrCode: showQrCode,
              expiresAt: expirationDate,
              maxViews: maxViews === "" ? null : Number(maxViews),
            };
          }
          return r;
        }),
      );

      toast.success(t("dashboard.shareSettings.success"));
      closeShareSettings();

      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar configurações");
    }
  };

  const openTagsSettings = (resume: ResumeCardData) => {
    setSelectedResume(resume);
    setSelectedResumeIdParam(resume.id);
    setIsTagsOpenParam(true);
  };

  const closeTagsSettings = () => {
    setIsTagsOpenParam(null);
    setSelectedResumeIdParam(null);
    setSelectedResume(null);
  };

  const handleAddTag = async () => {
    if (!selectedResume || !newTagName.trim()) return;

    try {
      const tag = await attachTagToResume(
        selectedResume.id,
        newTagName,
        newTagColor,
      );

      setResumes((prev) =>
        prev.map((r) => {
          if (r.id === selectedResume.id) {
            const hasTag = r.tags.some((t) => t.id === tag.id);
            if (!hasTag) {
              return { ...r, tags: [...r.tags, tag] };
            }
          }
          return r;
        }),
      );

      setNewTagName("");
      toast.success(t("dashboard.toasts.tagAddSuccess"));
    } catch (err: any) {
      toast.error(t("dashboard.toasts.tagAddError"));
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    if (!selectedResume) return;

    try {
      await detachTagFromResume(selectedResume.id, tagId);

      setResumes((prev) =>
        prev.map((r) => {
          if (r.id === selectedResume.id) {
            return { ...r, tags: r.tags.filter((t) => t.id !== tagId) };
          }
          return r;
        }),
      );

      toast.success(t("dashboard.toasts.tagRemoveSuccess"));
    } catch (err: any) {
      toast.error(t("dashboard.toasts.tagRemoveError"));
    }
  };

  const filteredResumes = resumes
    .filter((resume) => {
      const matchesSearch = resume.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesLocale =
        localeFilter === "all" || resume.locale === localeFilter;
      const matchesTag =
        tagFilter === "all" || resume.tags.some((t) => t.id === tagFilter);
      return matchesSearch && matchesLocale && matchesTag;
    })
    .sort((a, b) => {
      const timeA = new Date(a.updatedAt).getTime();
      const timeB = new Date(b.updatedAt).getTime();
      return sortBy === "desc" ? timeB - timeA : timeA - timeB;
    });

  return (
    <div className="flex-1 w-full min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full border-b border-border/40 bg-card/30 backdrop-blur-md  z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo width={100} height={26} />
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full h-8 w-8"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <div className="w-px h-6 bg-border/40" />
          <UserButton />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              {t("dashboard.title")}
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="rounded-xl px-5 py-6 bg-primary hover:bg-primary/95 text-white font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
          >
            <Plus size={18} weight="bold" />
            {t("dashboard.newResume")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card/20 border border-border/40 p-4 rounded-2xl backdrop-blur-sm">
          <div className="md:col-span-2 relative flex items-center">
            <MagnifyingGlass
              className="absolute left-3 text-muted-foreground"
              size={18}
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dashboard.searchPlaceholder")}
              autoComplete="off"
              className="pl-10 rounded-xl bg-background/50 border-border/40 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 bg-background/40 px-3 py-1 rounded-xl border border-border/40">
            <Globe className="text-muted-foreground" size={18} />
            <select
              value={localeFilter}
              onChange={(e) => setLocaleFilter(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-foreground font-semibold cursor-pointer"
            >
              <option
                value="all"
                className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
              >
                {t("dashboard.filterLanguage")}
              </option>
              <option
                value="pt"
                className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
              >
                {t("dashboard.langPt")}
              </option>
              <option
                value="en"
                className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
              >
                {t("dashboard.langEn")}
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-background/40 px-3 py-1 rounded-xl border border-border/40">
            <TagIcon className="text-muted-foreground" size={18} />
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-foreground font-semibold cursor-pointer"
            >
              <option
                value="all"
                className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
              >
                {t("dashboard.filterTag")}
              </option>
              {allUserTags.map((tag) => (
                <option
                  key={tag.id}
                  value={tag.id}
                  className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  #{tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t("dashboard.resumesCountFound", {
              count: filteredResumes.length,
            })}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSortBy((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="text-xs font-bold text-muted-foreground flex items-center gap-1.5"
          >
            {sortBy === "desc" ? (
              <SortDescending size={16} />
            ) : (
              <SortAscending size={16} />
            )}
            {sortBy === "desc"
              ? t("dashboard.sortDesc")
              : t("dashboard.sortAsc")}
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredResumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <EmptyState
                icon={MagnifyingGlass}
                title={t("dashboard.emptyStateTitle")}
                description={t("dashboard.emptyStateDesc")}
                action={{
                  label: t("dashboard.emptyStateAction"),
                  onClick: handleCreateNew,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {filteredResumes.map((resume) => (
                <motion.div
                  key={resume.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    onClick={() => handleEdit(resume.id)}
                    className="group border-border/40 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative flex flex-col h-full bg-card/40 backdrop-blur-sm rounded-2xl cursor-pointer"
                  >
                    <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <h3 className="font-extrabold text-xl text-foreground truncate group-hover:text-primary transition-colors">
                              {resume.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded">
                                {resume.locale}
                              </span>
                              <span className="text-xs text-muted-foreground font-medium">
                                {t("dashboard.lastUpdate")}{" "}
                                {new Date(
                                  resume.updatedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-muted/60"
                              >
                                <DotsThreeVertical size={20} weight="bold" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl border-border/40 w-44"
                            >
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(resume.id);
                                }}
                                className="gap-2 font-bold cursor-pointer rounded-lg"
                              >
                                <Pencil size={16} />
                                {t("dashboard.actions.edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicate(resume.id);
                                }}
                                className="gap-2 font-bold cursor-pointer rounded-lg"
                              >
                                <Copy size={16} />
                                {t("dashboard.actions.duplicate")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(
                                    `/${activeLocale}/dashboard/analytics/${resume.id}`,
                                  );
                                }}
                                className="gap-2 font-bold cursor-pointer rounded-lg"
                              >
                                <ChartBar size={16} />
                                {t("dashboard.actions.analytics")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openShareSettings(resume);
                                }}
                                className="gap-2 font-bold cursor-pointer rounded-lg"
                              >
                                <ShareNetwork size={16} />
                                {t("dashboard.actions.share")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTagsSettings(resume);
                                }}
                                className="gap-2 font-bold cursor-pointer rounded-lg"
                              >
                                <TagIcon size={16} />
                                {t("dashboard.actions.manageTags")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setResumeToDeleteId(resume.id);
                                  setIsDeleteOpen(true);
                                }}
                                className="gap-2 font-bold text-destructive hover:text-destructive cursor-pointer rounded-lg"
                              >
                                <Trash size={16} />
                                {t("dashboard.actions.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {resume.tags && resume.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {resume.tags.map((tag) => (
                              <span
                                key={tag.id}
                                style={{
                                  backgroundColor: `${tag.color}15`,
                                  color: tag.color,
                                  borderColor: `${tag.color}30`,
                                }}
                                className="text-[10px] font-bold border px-2 py-0.5 rounded-full"
                              >
                                #{tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-muted-foreground text-xs font-semibold">
                            <Eye size={16} />
                            <span>
                              {resume.views} {t("dashboard.views")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground text-xs font-semibold">
                            <Download size={16} />
                            <span>
                              {resume.downloads} {t("dashboard.downloads")}
                            </span>
                          </div>
                        </div>

                        {resume.slug && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                            <Check size={10} weight="bold" />{" "}
                            {t("dashboard.statusActive")}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Dialog
        open={isShareOpenParam}
        onOpenChange={(open) => {
          if (!open) closeShareSettings();
        }}
      >
        <DialogContent className="rounded-3xl border-border/40 max-w-md w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              {t("dashboard.shareSettings.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-muted-foreground">
                {t("dashboard.shareSettings.slugLabel")}
              </label>
              <div className="flex items-center">
                <span className="bg-muted px-3 py-2 text-sm border border-r-0 border-border/40 rounded-l-xl text-muted-foreground select-none font-semibold">
                  /share/
                </span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={t("dashboard.shareSettings.slugPlaceholder")}
                  autoComplete="off"
                  className="rounded-l-none rounded-r-xl bg-background/50 border-border/40 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-muted-foreground">
                  {t("dashboard.shareSettings.passwordLabel")}
                </label>
                {selectedResume?.passwordHash && (
                  <label className="text-xs font-bold text-destructive flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={removePassword}
                      onChange={(e) => setRemovePassword(e.target.checked)}
                    />
                    Remover senha existente
                  </label>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock
                  className="absolute left-3 text-muted-foreground"
                  size={16}
                />
                <Input
                  type="password"
                  value={password}
                  disabled={removePassword}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("dashboard.shareSettings.passwordPlaceholder")}
                  autoComplete="new-password"
                  className="pl-10 rounded-xl bg-background/50 border-border/40 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground">
                  {t("dashboard.shareSettings.expiresLabel")}
                </label>
                <div className="relative flex items-center">
                  <Calendar
                    className="absolute left-3 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    autoComplete="off"
                    className="pl-10 rounded-xl bg-background/50 border-border/40 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground">
                  {t("dashboard.shareSettings.maxViewsLabel")}
                </label>
                <div className="relative flex items-center">
                  <Eye
                    className="absolute left-3 text-muted-foreground"
                    size={16}
                  />
                  <Input
                    type="number"
                    value={maxViews}
                    onChange={(e) =>
                      setMaxViews(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                    placeholder="ex: 100"
                    autoComplete="off"
                    className="pl-10 rounded-xl bg-background/50 border-border/40 focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="showQrCodeCheckbox"
                checked={showQrCode}
                disabled={!slug}
                onChange={(e) => setShowQrCode(e.target.checked)}
                className="rounded border-border/40 accent-primary"
              />
              <label
                htmlFor="showQrCodeCheckbox"
                className="text-sm font-bold text-foreground flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode size={18} />
                {t("dashboard.shareSettings.enableQrCode")}
              </label>
              {!slug && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Info size={12} /> {t("dashboard.requiresCustomLink")}
                </span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={closeShareSettings}
              className="rounded-xl font-bold"
            >
              {t("previous")}
            </Button>
            <Button
              onClick={handleSaveShareSettings}
              className="rounded-xl bg-primary text-white font-bold"
            >
              {t("dashboard.shareSettings.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTagsOpenParam}
        onOpenChange={(open) => {
          if (!open) closeTagsSettings();
        }}
      >
        <DialogContent className="rounded-3xl border-border/40 max-w-md w-full p-8 shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
              <TagIcon size={24} weight="duotone" className="text-primary" />
              {t("dashboard.tags.title")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                  {t("dashboard.tags.title")}
                </label>
              </div>

              {selectedResume?.tags && selectedResume.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedResume.tags.map((tag) => (
                    <span
                      key={tag.id}
                      style={{
                        backgroundColor: `${tag.color}15`,
                        color: tag.color,
                        borderColor: `${tag.color}35`,
                      }}
                      className="flex items-center gap-1.5 text-xs border font-extrabold px-3 py-1.5 rounded-full transition-all"
                    >
                      #{tag.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTag(tag.id);
                        }}
                        className="hover:text-destructive hover:scale-110 transition-all shrink-0 ml-0.5"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/80 font-medium">
                  {t("dashboard.noTagsLinked")}
                </p>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-border/40">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest block">
                {t("dashboard.createAndLinkTag")}
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <TagIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                    size={16}
                  />
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTag();
                    }}
                    placeholder={t("dashboard.tags.placeholder")}
                    className="pl-10 h-11 rounded-xl bg-background/50 border-border/40 focus-visible:ring-primary font-semibold"
                  />
                </div>
                <Button
                  onClick={handleAddTag}
                  className="rounded-xl h-11 bg-primary text-white font-bold px-5"
                >
                  {t("dashboard.add")}
                </Button>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {t("dashboard.tagColorLabel")}
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {tagColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTagColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full border transition-all hover:scale-105 ${newTagColor === color ? "scale-110 border-white ring-2 ring-primary/45" : "border-transparent opacity-80"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              onClick={closeTagsSettings}
              className="rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold px-6 py-5"
            >
              {t("dashboard.completed")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-3xl border-border/40 max-w-md w-full p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight text-destructive">
              {t("dashboard.deleteDialogTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {t("dashboard.deleteDialogDesc")}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteOpen(false);
                setResumeToDeleteId(null);
              }}
              className="rounded-xl font-bold"
            >
              {t("dashboard.cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              className="rounded-xl bg-destructive hover:bg-destructive/95 text-white font-bold"
            >
              {t("dashboard.confirmDelete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
