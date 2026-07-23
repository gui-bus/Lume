"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  FileArrowDown,
  Spinner,
  Sun,
  Moon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveCoverLetter } from "@/app/actions/coverLetterActions";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/theme-provider";
import { UserButton, Show } from "@clerk/nextjs";

interface CoverLetterEditorClientProps {
  initialLetter: {
    id: string;
    title: string;
    senderName: string;
    senderEmail: string;
    senderPhone: string | null;
    senderLocation: string | null;
    senderLinkedin: string | null;
    senderGithub: string | null;
    senderPortfolio: string | null;
    recipientName: string | null;
    recipientCompany: string | null;
    date: string | null;
    subject: string | null;
    content: string;
    colorTheme: string;
    templateId: string;
    groupId: string;
  };
}

export function CoverLetterEditorClient({
  initialLetter,
}: CoverLetterEditorClientProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState(initialLetter);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedData = useDebounce(formData, 2500);
  const lastSavedRef = useRef(JSON.stringify(initialLetter));

  useEffect(() => {
    const performSave = async () => {
      const currentStr = JSON.stringify(debouncedData);
      if (currentStr === lastSavedRef.current) return;

      setIsSaving(true);
      try {
        await saveCoverLetter(
          debouncedData.id,
          debouncedData,
          locale,
          debouncedData.groupId,
        );
        lastSavedRef.current = currentStr;
      } catch (error) {
        console.error(error);
        toast.error(
          locale === "en" ? "Error saving letter" : "Erro ao salvar carta",
        );
      } finally {
        setIsSaving(false);
      }
    };

    performSave();
  }, [debouncedData, locale]);

  useEffect(() => {
    if (formData.title) {
      document.title = `${formData.title} | Lume`;
    }
  }, [formData.title]);

  const handleChange = (field: keyof typeof initialLetter, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { CoverLetterPDF } =
        await import("@/components/pdf/CoverLetterPDF");

      const formatNameForFilename = (name: string) => {
        if (!name) return "";
        return name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .replace(/[^A-Z0-9\s]/g, "")
          .trim()
          .replace(/\s+/g, "_");
      };

      const formattedName = formatNameForFilename(formData.senderName);
      const filename = formattedName
        ? `CARTA_DE_APRESENTACAO_${formattedName}.pdf`
        : "CARTA_DE_APRESENTACAO.pdf";

      const blob = await pdf(<CoverLetterPDF data={formData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(
        locale === "en"
          ? "Cover letter downloaded successfully!"
          : "Carta de apresentação baixada com sucesso!",
      );
    } catch (error) {
      console.error(error);
      toast.error(
        locale === "en" ? "Error generating PDF" : "Erro ao gerar PDF da carta",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden text-left">
      <header className="no-print h-16 border-b border-border/40 bg-card/30 backdrop-blur-md z-40 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <a href={`/${locale}/dashboard`} className="cursor-pointer">
            <Logo width={100} height={26} />
          </a>

          <div className="hidden md:flex items-center gap-3 border-l border-border/40 pl-6">
            <span className="text-sm font-bold text-foreground">
              {formData.title ||
                (locale === "en" ? "Cover Letter" : "Carta de Apresentação")}
            </span>
            {isSaving ? (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-black flex items-center gap-2">
                <Spinner size={12} className="animate-spin" />{" "}
                {t("coverLetters.savingState")}
              </span>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-black flex items-center gap-2">
                <Check size={12} /> {t("coverLetters.savedState")}
              </span>
            )}
          </div>
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
          <Show when="signed-in">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
            />
          </Show>
          <Button
            onClick={handleDownload}
            disabled={isGenerating}
            size="sm"
            className="rounded-xl font-bold gap-2 text-xs"
          >
            {isGenerating ? (
              <Spinner size={14} className="animate-spin" />
            ) : (
              <FileArrowDown size={14} />
            )}
            {t("coverLetters.downloadPDF")}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[45%] h-full border-r border-border/40 flex flex-col no-print bg-card/10">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div className="space-y-2">
              <Label>{t("coverLetters.titleInternal")}</Label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder={
                  locale === "en"
                    ? "e.g., React Developer Letter"
                    : "Ex: Carta para Desenvolvedor React"
                }
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {t("coverLetters.senderSection")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderName")}</Label>
                  <Input
                    value={formData.senderName}
                    placeholder={
                      locale === "en" ? "e.g., John Doe" : "Ex: Guilherme Silva"
                    }
                    onChange={(e) => handleChange("senderName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderEmail")}</Label>
                  <Input
                    value={formData.senderEmail}
                    placeholder={
                      locale === "en"
                        ? "e.g., john@email.com"
                        : "Ex: guilherme@email.com"
                    }
                    onChange={(e) =>
                      handleChange("senderEmail", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderPhone")}</Label>
                  <Input
                    value={formData.senderPhone || ""}
                    placeholder={
                      locale === "en"
                        ? "e.g., +1 (555) 000-0000"
                        : "Ex: (11) 98765-4321"
                    }
                    onChange={(e) =>
                      handleChange("senderPhone", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderLocation")}</Label>
                  <Input
                    value={formData.senderLocation || ""}
                    placeholder={
                      locale === "en"
                        ? "e.g., New York, NY"
                        : "Ex: São Paulo - SP"
                    }
                    onChange={(e) =>
                      handleChange("senderLocation", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderLinkedin")}</Label>
                  <Input
                    value={formData.senderLinkedin || ""}
                    placeholder="Ex: linkedin.com/in/usuario"
                    onChange={(e) =>
                      handleChange("senderLinkedin", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderGithub")}</Label>
                  <Input
                    value={formData.senderGithub || ""}
                    placeholder="Ex: github.com/usuario"
                    onChange={(e) =>
                      handleChange("senderGithub", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coverLetters.senderPortfolio")}</Label>
                  <Input
                    value={formData.senderPortfolio || ""}
                    placeholder="Ex: meuportfolio.com"
                    onChange={(e) =>
                      handleChange("senderPortfolio", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border/30 pt-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {t("coverLetters.recipientSection")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("coverLetters.recipientName")}</Label>
                  <Input
                    value={formData.recipientName || ""}
                    placeholder={
                      locale === "en"
                        ? "e.g., Jane Smith (or Hiring Team)"
                        : "Ex: Mariana Costa (ou Depto. de R&S)"
                    }
                    onChange={(e) =>
                      handleChange("recipientName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coverLetters.recipientCompany")}</Label>
                  <Input
                    value={formData.recipientCompany || ""}
                    placeholder={
                      locale === "en" ? "e.g., Google" : "Ex: Google Brasil"
                    }
                    onChange={(e) =>
                      handleChange("recipientCompany", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border/30 pt-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {t("coverLetters.content")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("coverLetters.date")}</Label>
                  <Input
                    value={formData.date || ""}
                    placeholder={
                      locale === "en"
                        ? "e.g., July 23, 2026"
                        : "Ex: 23 de Julho de 2026"
                    }
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("coverLetters.subject")}</Label>
                  <Input
                    value={formData.subject || ""}
                    placeholder={
                      locale === "en"
                        ? "e.g., Application for Software Engineer"
                        : "Ex: Candidatura à vaga de Engenheiro de Software"
                    }
                    onChange={(e) => handleChange("subject", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("coverLetters.content")}</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleChange("content", e.target.value)}
                  rows={12}
                  placeholder={
                    locale === "en"
                      ? "Dear [Recruiter Name], I am writing to express my interest..."
                      : "Prezado(a) [Nome do Recrutador], escrevo para manifestar meu interesse..."
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 flex-col bg-muted/5 relative overflow-hidden h-full">
          <div className="flex-1 overflow-y-auto p-12 flex justify-center items-start custom-scrollbar">
            <div className="w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[20mm] shadow-lg border border-border/20 text-left font-sans flex flex-col leading-relaxed">
              <div className="pb-4 mb-6 border-b-2 border-slate-800">
                <h1 className="text-2xl font-bold uppercase tracking-tight text-slate-800">
                  {formData.senderName ||
                    (locale === "en" ? "Your Name" : "Seu Nome")}
                </h1>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mt-2 font-medium">
                  <a
                    href={`mailto:${formData.senderEmail}`}
                    className="text-primary hover:underline font-bold"
                  >
                    {formData.senderEmail || "seuemail@provedor.com"}
                  </a>
                  {formData.senderPhone && (
                    <>
                      <span>&bull;</span>
                      <a
                        href={`tel:${formData.senderPhone}`}
                        className="text-primary hover:underline font-bold"
                      >
                        {formData.senderPhone}
                      </a>
                    </>
                  )}
                  {formData.senderLocation && (
                    <>
                      <span>&bull;</span>
                      <span className="text-slate-500">
                        {formData.senderLocation}
                      </span>
                    </>
                  )}
                  {formData.senderLinkedin && (
                    <>
                      <span>&bull;</span>
                      <a
                        href={formData.senderLinkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-bold"
                      >
                        LinkedIn
                      </a>
                    </>
                  )}
                  {formData.senderGithub && (
                    <>
                      <span>&bull;</span>
                      <a
                        href={formData.senderGithub}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-bold"
                      >
                        GitHub
                      </a>
                    </>
                  )}
                  {formData.senderPortfolio && (
                    <>
                      <span>&bull;</span>
                      <a
                        href={formData.senderPortfolio}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-bold"
                      >
                        {locale === "en" ? "Portfolio" : "Portfólio"}
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6 flex flex-col gap-4 text-xs">
                {formData.date && (
                  <span className="text-slate-400 font-medium">
                    {formData.date}
                  </span>
                )}

                {(formData.recipientName || formData.recipientCompany) && (
                  <div className="flex flex-col text-slate-700 leading-tight">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      {t("coverLetters.to")}
                    </span>
                    {formData.recipientName && (
                      <span className="font-bold">
                        {formData.recipientName}
                      </span>
                    )}
                    {formData.recipientCompany && (
                      <span className="font-bold text-slate-900">
                        {formData.recipientCompany}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {formData.subject && (
                <h2 className="text-sm font-bold text-slate-900 mb-6">
                  {t("coverLetters.subjectLabel")} {formData.subject}
                </h2>
              )}

              <div className="text-xs text-slate-800 space-y-4 whitespace-pre-line text-justify flex-1">
                {formData.content ||
                  (locale === "en"
                    ? "Your cover letter text will appear here..."
                    : "O texto da sua carta de apresentação aparecerá aqui...")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
