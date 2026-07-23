"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Copy,
  Check,
  EnvelopeSimpleOpen,
  Sun,
  Moon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/theme-provider";
import { UserButton, Show } from "@clerk/nextjs";

export function EmailGeneratorClient() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    recruiterName: "",
    companyName: "",
    position: "",
    mainSkills: "",
    tone: "formal",
  });

  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const emailTemplates = useMemo(() => {
    const { recruiterName, companyName, position, mainSkills, tone } = formData;
    const isEn = locale === "en";

    let greeting = "";
    if (isEn) {
      greeting = recruiterName
        ? `Dear ${recruiterName}`
        : "Dear recruitment team";
    } else {
      greeting = recruiterName
        ? `Prezado(a) ${recruiterName}`
        : "Prezada equipe de recrutamento";
    }

    let skillList = "";
    if (mainSkills) {
      skillList = isEn ? ` such as ${mainSkills}` : ` como ${mainSkills}`;
    }

    let subject = "";
    let body = "";

    if (tone === "formal") {
      if (isEn) {
        subject = `Application for ${position || "[Position]"} - ${companyName || "[Company]"}`;
        body = `${greeting},

I am writing to express my strong interest in the ${position || "[Position]"} opportunity at ${companyName || "[Company]"}.

I follow ${companyName || "[Company]"}'s trajectory and greatly identify with the company's culture of excellence and innovation. I believe that my solid background in technology${skillList} qualifies me to make an immediate contribution to the team's goals.

I attach my full resume for your consideration. I remain available for a technical interview to detail my qualifications.

Thank you in advance for your attention.

Sincerely,`;
      } else {
        subject = `Candidatura à vaga de ${position || "[Cargo]"} - ${companyName || "[Empresa]"}`;
        body = `${greeting},

Escrevo para manifestar meu forte interesse na oportunidade de ${position || "[Cargo]"} na ${companyName || "[Empresa]"}.

Acompanho a trajetória da ${companyName || "[Empresa]"} e me identifico muito com a cultura de excelência e inovação da empresa. Acredito que minha sólida experiência em tecnologia${skillList} me qualifica para contribuir de forma imediata com os objetivos da equipe.

Anexo a este e-mail meu currículo completo para apreciação. Fico à disposição para uma entrevista técnica onde poderei detalhar minhas qualificações.

Agradeço antecipadamente pela atenção.

Cordialmente,`;
      }
    } else if (tone === "friendly") {
      if (isEn) {
        subject = `Hi! Interested in the ${position || "[Position]"} opportunity at ${companyName || "[Company]"}`;
        body = `Hi ${recruiterName || "team"}, how are you?

I hope so! I was following ${companyName || "[Company]"}'s updates and saw you are looking for someone to work as a ${position || "[Position]"}. I got very excited about this opportunity!

I have been working a lot with technology${skillList} and see my profile has great synergy with what you are building. I would love to schedule a quick chat to introduce ourselves and discuss how I can contribute to the team.

I am sending my resume in the attachment for you to review.

Best regards,`;
      } else {
        subject = `Olá! Tenho interesse na oportunidade de ${position || "[Cargo]"} na ${companyName || "[Empresa]"}`;
        body = `Olá ${recruiterName || "pessoal"}, tudo bem?

Espero que sim! Estava acompanhando as novidades da ${companyName || "[Empresa]"} e vi que vocês estão buscando alguém para atuar como ${position || "[Cargo]"}. Fiquei muito empolgado(a) com a oportunidade!

Tenho trabalhado bastante com tecnologia${skillList} e vejo que meu perfil tem muita sinergia com o que vocês estão construindo. Adoraria bater um papo para nos conhecermos e contar um pouco mais sobre como posso somar ao time.

Estou enviando meu currículo em anexo para vocês darem uma olhada.

Um abraço,`;
      }
    } else {
      if (isEn) {
        subject = `Application: ${position || "[Position]"} - ${companyName || "[Company]"}`;
        body = `${greeting},

I would like to submit my resume for the ${position || "[Position]"} position at ${companyName || "[Company]"}.

I have solid practical experience in technology${skillList} and aim to apply my knowledge to speed up deliveries and drive results in the team.

My updated resume is attached. I am available for a direct conversation about my professional experiences.

Regards,`;
      } else {
        subject = `Candidatura: ${position || "[Cargo]"} - ${companyName || "[Empresa]"}`;
        body = `${greeting},

Gostaria de submeter meu currículo para a posição de ${position || "[Cargo]"} na ${companyName || "[Empresa]"}.

Tenho sólida vivência prática em tecnologia${skillList} e busco aplicar meus conhecimentos para acelerar entregas e impulsionar resultados na equipe.

Meu currículo atualizado segue em anexo. Estou disponível para uma conversa direta sobre minhas experiências profissionais.

Atenciosamente,`;
      }
    }

    return { subject, body };
  }, [formData, locale]);

  const handleCopy = async (text: string, type: "subject" | "body") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "subject") {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      }
      toast.success(
        type === "subject"
          ? t("emailGenerator.subjectCopied")
          : t("emailGenerator.bodyCopied"),
      );
    } catch (err) {
      toast.error(t("emailGenerator.copyError"));
    }
  };

  const handleOpenEmail = () => {
    const { subject, body } = emailTemplates;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, "_blank");
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
              {t("emailGenerator.openGenerator")}
            </span>
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
            onClick={handleOpenEmail}
            size="sm"
            className="rounded-xl font-bold gap-2 text-xs"
          >
            <EnvelopeSimpleOpen size={14} />
            {t("emailGenerator.sendButton")}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[40%] h-full border-r border-border/40 flex flex-col no-print bg-card/10">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
            <div className="space-y-2">
              <Label>{t("emailGenerator.position")}</Label>
              <Input
                value={formData.position}
                placeholder={
                  locale === "en"
                    ? "e.g., Full Stack React Developer"
                    : "Ex: Desenvolvedor React Full Stack"
                }
                onChange={(e) => handleChange("position", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("emailGenerator.companyName")}</Label>
              <Input
                value={formData.companyName}
                placeholder={
                  locale === "en" ? "e.g., Lume Tech" : "Ex: Lume Tech"
                }
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("emailGenerator.recruiterName")}</Label>
              <Input
                value={formData.recruiterName}
                placeholder={locale === "en" ? "e.g., Jane" : "Ex: Mariana"}
                onChange={(e) => handleChange("recruiterName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("emailGenerator.mainSkills")}</Label>
              <Input
                value={formData.mainSkills}
                placeholder={
                  locale === "en"
                    ? "e.g., React, Next.js, and Tailwind CSS"
                    : "Ex: React, Next.js e Tailwind CSS"
                }
                onChange={(e) => handleChange("mainSkills", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("emailGenerator.tone")}</Label>
              <select
                value={formData.tone}
                onChange={(e) => handleChange("tone", e.target.value)}
                className="w-full bg-background border border-border/40 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground font-semibold cursor-pointer"
              >
                <option value="formal">{t("emailGenerator.toneFormal")}</option>
                <option value="friendly">
                  {t("emailGenerator.toneFriendly")}
                </option>
                <option value="direct">{t("emailGenerator.toneDirect")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 flex-col bg-muted/5 relative overflow-hidden h-full">
          <div className="flex-1 overflow-y-auto p-12 flex flex-col gap-6 custom-scrollbar items-center justify-start">
            <div className="w-full max-w-2xl space-y-4">
              <div className="rounded-2xl border border-border/40 bg-background p-6 space-y-4 text-left shadow-sm">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                      {t("emailGenerator.subjectLine")}
                    </span>
                    <span className="text-sm font-bold text-foreground mt-1">
                      {emailTemplates.subject}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full shrink-0"
                    onClick={() =>
                      handleCopy(emailTemplates.subject, "subject")
                    }
                  >
                    {copiedSubject ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
                      {t("emailGenerator.messageBody")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => handleCopy(emailTemplates.body, "body")}
                    >
                      {copiedBody ? (
                        <Check size={16} className="text-emerald-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-foreground bg-muted/20 p-4 rounded-xl font-mono whitespace-pre-line leading-relaxed border border-border/20">
                    {emailTemplates.body}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
