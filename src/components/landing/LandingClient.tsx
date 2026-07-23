"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  RocketLaunch,
  Sparkle,
  ShieldCheck,
  ClipboardText,
  ArrowRight,
  Monitor,
  Compass,
  Key,
  Quotes,
  ArrowSquareUpRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";

export function LandingClient() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleStart = () => {
    router.push(`/${locale}/sign-in`);
  };

  const handleLogin = () => {
    router.push(`/${locale}/sign-in`);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any },
    },
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] z-0 pointer-events-none" />

      <header className="w-full mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Logo width={100} height={26} />
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full h-8 w-8 hover:bg-muted/40"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogin}
            className="rounded-xl font-bold px-4 py-2 text-sm hover:bg-muted/40"
          >
            {t("landing.ctaLogin")}
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full mx-auto px-6 py-12 md:py-24 flex flex-col gap-24 relative z-10">
        <section className="flex flex-col items-center justify-center text-center space-y-8 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.25em] text-primary"
          >
            A nova era de currículos
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-foreground"
            >
              {t("landing.heroTitle")} <br />
              <span className="text-primary italic font-serif bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                {t("landing.heroSubtitle")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground font-medium text-lg md:text-xl leading-relaxed max-w-2xl mx-auto pt-2"
            >
              {t("landing.heroDesc")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm"
          >
            <Button
              onClick={handleStart}
              className="rounded-2xl py-7 px-8 bg-primary hover:bg-primary/95 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] text-md"
            >
              {t("landing.ctaStart")}
              <ArrowRight size={18} weight="bold" />
            </Button>
          </motion.div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {t("landing.featuresTitle")}
            </h2>
            <p className="text-muted-foreground font-semibold max-w-md mx-auto text-sm">
              {t("landing.featuresDesc")}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div
              variants={cardVariants}
              className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkle size={20} weight="duotone" />
              </div>
              <h3 className="font-extrabold text-lg">
                {t("landing.featureAtsTitle")}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                {t("landing.featureAtsDesc")}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldCheck size={20} weight="duotone" />
              </div>
              <h3 className="font-extrabold text-lg">
                {t("landing.featurePrivacyTitle")}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                {t("landing.featurePrivacyDesc")}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ClipboardText size={20} weight="duotone" />
              </div>
              <h3 className="font-extrabold text-lg">
                {t("landing.featureTemplatesTitle")}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                {t("landing.featureTemplatesDesc")}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Quotes size={20} weight="duotone" />
              </div>
              <h3 className="font-extrabold text-lg">
                {t("landing.featureQrcodeTitle")}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                {t("landing.featureQrcodeDesc")}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Compass size={20} weight="duotone" />
              </div>
              <h3 className="font-extrabold text-lg">
                {t("landing.featureCommandTitle")}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                {t("landing.featureCommandDesc")}
              </p>
            </motion.div>

            <motion.div
              variants={cardVariants}
              className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Key size={20} weight="duotone" />
              </div>
              <h3 className="font-extrabold text-lg">Links Seguros</h3>
              <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                Defina expirações e limites de visualizações para seus links
                públicos.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <section className="space-y-12 pb-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {t("landing.templatesTitle")}
            </h2>
            <p className="text-muted-foreground font-semibold max-w-md mx-auto text-sm">
              {t("landing.templatesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            {[
              {
                name: "Modern",
                desc: "Estrutura de 2 colunas para perfis de Tecnologia, Design e Marketing.",
                color: "from-blue-600 to-indigo-600",
              },
              {
                name: "Classic",
                desc: "Design formal e sóbrio ideal para advocacia, finanças e posições executivas.",
                color: "from-slate-700 to-slate-900",
              },
              {
                name: "Minimal",
                desc: "Visual limpo, espaçado e direto com foco no conteúdo puro das experiências.",
                color: "from-zinc-500 to-zinc-700",
              },
              {
                name: "Executive",
                desc: "Cabeçalho robusto com foco em conquistas consolidadas e cargos sêniores.",
                color: "from-amber-600 to-amber-800",
              },
            ].map((tpl, i) => (
              <Card
                key={i}
                className="border-border/40 overflow-hidden hover:border-primary/30 transition-all bg-card/30 rounded-2xl flex flex-col h-full"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                  <div className="space-y-1.5">
                    <h4 className="font-black text-lg text-foreground">
                      {tpl.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tpl.desc}
                    </p>
                  </div>
                  <div
                    className={`h-24 w-full rounded-xl bg-gradient-to-tr ${tpl.color} opacity-30 mt-2`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border/40 bg-card/10 py-10 relative z-10 mt-auto text-center">
        <div className="mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo width={80} height={21} />
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              &bull; © 2026
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold">
            <a
              href="https://github.com/gui-bus"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              GitHub <ArrowSquareUpRight size={14} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              LinkedIn <ArrowSquareUpRight size={14} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
