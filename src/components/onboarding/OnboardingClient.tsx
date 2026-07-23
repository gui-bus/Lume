"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  RocketLaunch,
  Article,
  ArrowRight,
  ArrowLeft,
  Check,
  LinkedinLogo,
  FilePlus,
  Sparkle,
  DeviceMobile,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { setOnboarded, saveResume } from "@/app/actions/resumeActions";
import { toast } from "sonner";

interface OnboardingClientProps {
  userId: string;
}

export function OnboardingClient({ userId }: OnboardingClientProps) {
  const t = useTranslations("common");
  const activeLocale = useLocale();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinish = async (importLinkedIn: boolean) => {
    try {
      await setOnboarded();

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

      toast.success("Perfil configurado!");

      if (importLinkedIn) {
        router.push(`/${activeLocale}/?id=${newResume.id}&import=linkedin`);
      } else {
        router.push(`/${activeLocale}/?id=${newResume.id}`);
      }
    } catch (err: any) {
      toast.error("Erro ao finalizar configuração");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" as any },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0 pointer-events-none" />

      <div className="w-full relative z-10 space-y-8">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-colors ${step >= num ? "bg-primary border-primary text-white" : "border-border text-muted-foreground bg-muted/20"}`}
              >
                {step > num ? <Check size={16} weight="bold" /> : num}
              </div>
              {num < 3 && (
                <div
                  className={`h-0.5 w-16 md:w-24 transition-colors ${step > num ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-card/40 border border-border/40 p-8 md:p-10 rounded-3xl backdrop-blur-md text-center space-y-6 w-full shadow-2xl shadow-black/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                <RocketLaunch size={32} weight="duotone" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-none">
                  Bem-vindo ao Lume!
                </h2>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-md mx-auto">
                  Vamos configurar seu ambiente profissional em apenas 2
                  minutos. Seu próximo emprego dos sonhos começa aqui.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
                <div className="p-4 rounded-2xl border border-border/20 bg-muted/10 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Sparkle className="text-primary" size={16} /> Otimização
                    ATS
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scaneie palavras-chave e otimize a estrutura do texto
                    localmente.
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-border/20 bg-muted/10 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                    <Article className="text-primary" size={16} /> PDF Vetorial
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Exportação e download instantâneos de arquivos em alta
                    definição.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleNext}
                className="w-full rounded-2xl py-6 bg-primary hover:bg-primary/95 text-white font-bold flex items-center justify-center gap-2 mt-4 text-lg"
              >
                Começar Configuração
                <ArrowRight size={18} weight="bold" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-card/40 border border-border/40 p-8 md:p-10 rounded-3xl backdrop-blur-md text-center space-y-6 w-full shadow-2xl shadow-black/5"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mx-auto">
                <Sparkle size={32} weight="duotone" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight">
                  Como deseja iniciar?
                </h2>
                <p className="text-muted-foreground font-medium">
                  Você pode acelerar o preenchimento importando seus dados do
                  LinkedIn ou construir seu perfil do zero.
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => handleFinish(true)}
                  className="w-full p-5 rounded-2xl border border-border/40 bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all text-left flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <LinkedinLogo size={24} weight="fill" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors">
                      Importar do LinkedIn
                    </h4>
                    <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                      Suba seu PDF exportado do perfil do LinkedIn e extraia
                      dados automaticamente.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => handleFinish(false)}
                  className="w-full p-5 rounded-2xl border border-border/40 bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all text-left flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <FilePlus size={24} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-foreground group-hover:text-primary transition-colors">
                      Iniciar do Zero
                    </h4>
                    <p className="text-xs text-muted-foreground leading-normal mt-0.5">
                      Preencha suas informações manualmente passo a passo usando
                      nosso editor intuitivo.
                    </p>
                  </div>
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="rounded-2xl flex-1 font-bold py-6 border border-border/40"
                >
                  <ArrowLeft size={16} weight="bold" /> Voltar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
