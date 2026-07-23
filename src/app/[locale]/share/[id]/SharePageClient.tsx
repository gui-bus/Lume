"use client";

import enMessages from "../../../../../messages/en.json";
import ptMessages from "../../../../../messages/pt.json";

import { incrementDownload, incrementView } from "@/app/actions/resumeActions";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PageWrapper } from "@/components/preview/PageWrapper";
import { ResumeView } from "@/components/preview/ResumeView";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";
import { ResumeData } from "@/types/resume";
import { FileArrowDown, Lock, Clock } from "@phosphor-icons/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getResumeLabels = (resumeLocale: string) => {
  const messages = (resumeLocale === "en" ? enMessages : ptMessages) as any;
  const resumeTranslations = messages.common.resume;
  return {
    locale: resumeLocale,
    title: resumeTranslations.title,
    yourName: resumeTranslations.yourName,
    portfolio: resumeTranslations.portfolio,
    summary: resumeTranslations.summary,
    experience: resumeTranslations.experience,
    education: resumeTranslations.education,
    skills: resumeTranslations.skills,
    languages: resumeTranslations.languages,
    certifications: resumeTranslations.certifications,
    projects: resumeTranslations.projects,
    volunteering: resumeTranslations.volunteering,
    courses: resumeTranslations.courses,
    current: resumeTranslations.current,
    at: resumeTranslations.at,
    repo: resumeTranslations.repo,
    demo: resumeTranslations.demo,
    qrCodeLabel:
      resumeLocale === "en"
        ? "Access the digital version of my profile"
        : "Acesse a versão digital do meu perfil",
    langLabels: {
      conversation: resumeTranslations.extras.languages.conversation,
      writing: resumeTranslations.extras.languages.writing,
      reading: resumeTranslations.extras.languages.reading,
    },
    langLevels: {
      basico: resumeTranslations.extras.languages.levels.basico,
      intermediario: resumeTranslations.extras.languages.levels.intermediario,
      avancado: resumeTranslations.extras.languages.levels.avancado,
      fluente: resumeTranslations.extras.languages.levels.fluente,
      nativo: resumeTranslations.extras.languages.levels.nativo,
    },
  };
};

interface SharePageClientProps {
  resume: {
    id: string;
    content: any;
    colorTheme?: string;
    showQrCode: boolean;
    slug: string | null;
    hasPassword?: boolean;
    isUnlocked?: boolean;
    isExpired?: boolean;
    locale: string;
    qrCodeUrl: string | null;
    templateId?: string;
    sectionsOrder?: string[] | null;
  };
  hasViewed: boolean;
  viewedCookieName: string;
}

export default function SharePageClient({
  resume,
  hasViewed,
  viewedCookieName,
}: SharePageClientProps) {
  const t = useTranslations("common");
  const tResume = useTranslations("common.resume");
  const locale = useLocale();
  const [isGenerating, setIsGenerating] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const qrCodeUrl = resume.qrCodeUrl || undefined;
  const resumeLabels = getResumeLabels(resume.locale);

  const data = resume.content as unknown as ResumeData;

  useEffect(() => {
    if (!hasViewed && resume.isUnlocked) {
      incrementView(resume.id);
      document.cookie = `${viewedCookieName}=true; path=/; max-age=86400; SameSite=Lax`;
    }
  }, [hasViewed, resume.id, viewedCookieName, resume.isUnlocked]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const { unlockResumeShare } = await import("@/app/actions/resumeActions");
      const success = await unlockResumeShare(resume.id, passwordInput);
      if (success) {
        toast.success(shareTexts.unlockSuccess);
        window.location.reload();
      } else {
        setErrorMsg(shareTexts.wrongPassword);
        toast.error(shareTexts.wrongPassword);
      }
    } catch (err: any) {
      setErrorMsg(shareTexts.validationError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!data) return;

    setIsGenerating(true);

    const downloadPromise = async () => {
      const { pdf } = await import("@react-pdf/renderer");
      const { ResumePDF } = await import("@/components/pdf/ResumePDF");

      const labels = resumeLabels;

      const blob = await pdf(
        <ResumePDF
          data={data}
          colorTheme={resume.colorTheme || "#18181b"}
          templateId={resume.templateId || undefined}
          labels={labels}
          sectionsOrder={resume.sectionsOrder ?? undefined}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const userName = (data.personalInfo.name || "LUME")
        .toUpperCase()
        .replace(/\s+/g, "_");
      const pdfName =
        locale === "pt" ? `CURRICULO_${userName}` : `RESUME_${userName}`;
      link.download = `${pdfName}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await incrementDownload(resume.id);
    };

    toast.promise(downloadPromise(), {
      loading: t("header.actions.generatingPdf") || "Gerando PDF...",
      success: t("header.actions.successPdf") || "Download concluído!",
      error: t("header.actions.errorPdf") || "Erro ao gerar PDF",
    });

    try {
      await downloadPromise;
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const shareTexts =
    resume.locale === "en"
      ? {
          restrictedAccess: "Restricted Access",
          lockedDesc:
            "This resume is password protected. Please enter the password below to view the professional profile.",
          passwordPlaceholder: "Enter password...",
          wrongPassword: "Incorrect password. Please try again.",
          validationError: "Error validating password",
          unlocking: "Validating...",
          viewButton: "View Resume",
          unlockSuccess: "Access granted!",
        }
      : {
          restrictedAccess: "Acesso Restrito",
          lockedDesc:
            "Este currículo está protegido por senha. Por favor, insira a senha abaixo para visualizar o perfil profissional.",
          passwordPlaceholder: "Senha de acesso...",
          wrongPassword: "Senha incorreta. Tente novamente.",
          validationError: "Erro ao validar senha",
          unlocking: "Validando...",
          viewButton: "Visualizar Currículo",
          unlockSuccess: "Acesso liberado!",
        };

  const expiredTexts =
    resume.locale === "en"
      ? {
          title: "Link Expired",
          desc: "This resume link has expired or reached its view limit. Please contact the candidate directly for an updated version.",
          homeButton: "Go to Lume Home",
        }
      : {
          title: "Link Expirado",
          desc: "Este link de currículo expirou ou atingiu o limite de visualizações. Entre em contato diretamente com o candidato para obter uma versão atualizada.",
          homeButton: "Ir para a Home do Lume",
        };

  if (resume.isExpired) {
    return (
      <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] canvas-grid flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/40 p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 text-center">
          <Logo width={100} height={26} />

          <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mt-2">
            <Clock size={32} weight="duotone" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {expiredTexts.title}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {expiredTexts.desc}
            </p>
          </div>

          <Button
            asChild
            className="w-full py-3 h-auto rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            <Link href="/">{expiredTexts.homeButton}</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!resume.isUnlocked) {
    return (
      <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] canvas-grid flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/40 p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 text-center">
          <Logo width={100} height={26} />

          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mt-2">
            <Lock size={32} weight="duotone" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {shareTexts.restrictedAccess}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {shareTexts.lockedDesc}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="w-full space-y-4 pt-2">
            <div className="relative flex items-center">
              <Lock
                className="absolute left-3.5 text-muted-foreground/60"
                size={18}
              />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={shareTexts.passwordPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-background/50 border border-border/40 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/80 transition-all placeholder:text-muted-foreground/50"
                autoComplete="new-password"
                required
              />
            </div>
            {errorMsg && (
              <span className="text-[10px] text-destructive font-bold uppercase tracking-wider block">
                {errorMsg}
              </span>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 h-auto rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              {isLoading ? shareTexts.unlocking : shareTexts.viewButton}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] canvas-grid overflow-y-auto overflow-x-hidden flex flex-col items-center">
      <header className="w-full max-w-5xl px-6 py-8 flex justify-between items-center no-print">
        <Link href="/sign-in">
          <Logo width={80} height={22} />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-2 rounded-full px-4 h-9 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-primary/10"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileArrowDown size={16} weight="duotone" />
            )}
            {isGenerating
              ? t("header.actions.generatingPdf")
              : t("header.actions.downloadPdf")}
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex-1 w-full flex flex-col items-center px-4 sm:px-8 pb-12">
        <PageWrapper className="my-4">
          <ResumeView
            data={data}
            colorTheme={resume.colorTheme}
            qrCodeUrl={qrCodeUrl}
            labels={resumeLabels}
            templateId={resume.templateId}
            sectionsOrder={resume.sectionsOrder ?? undefined}
          />
        </PageWrapper>

        <Link
          href="/sign-in"
          className="mt-16 mb-8 flex items-center gap-3 bg-background/50 backdrop-blur-sm border border-border/40 px-6 py-2.5 rounded-full shadow-sm text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 no-print hover:bg-background/80 hover:text-primary transition-all group"
        >
          <span>Criado com</span>
          <Logo
            width={60}
            height={16}
            className="opacity-60 group-hover:opacity-100 transition-opacity"
          />
        </Link>
      </div>
    </main>
  );
}
