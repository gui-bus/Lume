"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  WarningCircle,
  XCircle,
  Terminal,
  FileText,
  Check,
  ListChecks,
  Warning,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RepeatedWordResult } from "@/lib/validations/word-frequency-checker";
import { UserButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/theme-provider";
import { Logo } from "@/components/ui/Logo";
import { Sun, Moon } from "@phosphor-icons/react";

interface AtsAnalysisResult {
  score: number;
  checks: {
    summary: boolean;
    contact: boolean;
    experience: boolean;
    skills: boolean;
    length: "short" | "ideal" | "long";
  };
  wordCount: number;
}

interface AtsReaderClientProps {
  resumeId: string;
  resumeTitle: string;
  plainText: string;
  repeatedWords: RepeatedWordResult[];
  atsAnalysis: AtsAnalysisResult;
}

export function AtsReaderClient({
  resumeId,
  resumeTitle,
  plainText,
  repeatedWords,
  atsAnalysis,
}: AtsReaderClientProps) {
  const t = useTranslations("common");
  const activeLocale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    toast.success("Texto puro copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80)
      return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    if (score >= 50) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
    return "text-rose-500 border-rose-500/20 bg-rose-500/5";
  };

  return (
    <div className="flex-1 w-full min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/${activeLocale}/?id=${resumeId}`)}
            className="rounded-full h-8 w-8 hover:bg-muted/60"
          >
            <ArrowLeft size={18} weight="bold" />
          </Button>
          <Logo width={90} height={23} />
          <div className="w-px h-5 bg-border/40" />
          <div>
            <h2 className="font-extrabold text-sm text-foreground leading-tight">
              {resumeTitle}
            </h2>
            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">
              Leitor ATS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleCopy}
            className="rounded-xl bg-primary hover:bg-primary/95 text-white font-bold flex items-center gap-2 h-9 text-xs"
          >
            {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
            {copied ? "Copiado!" : "Copiar Texto Puro"}
          </Button>
          <div className="w-px h-6 bg-border/40" />
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
          <UserButton afterSignOutUrl={`/${activeLocale}/sign-in`} />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-180px)] min-h-[500px]">
          <div className="flex items-center gap-2 mb-3">
            <Terminal size={18} className="text-muted-foreground" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Texto Puro Extraído
            </h3>
          </div>
          <div className="flex-1 w-full bg-muted/20 border border-border/40 rounded-3xl p-6 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap select-text selection:bg-primary/30 text-foreground/90">
            {plainText}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 h-[calc(100vh-180px)] min-h-[500px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-muted-foreground" />
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Diagnóstico ATS
            </h3>
          </div>

          <Card className="border-border/40 overflow-hidden rounded-3xl bg-card/20 backdrop-blur-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                Score de Otimização
              </span>
              <div
                className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(atsAnalysis.score)}`}
              >
                <span className="text-4xl font-black leading-none">
                  {atsAnalysis.score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">
                  pontos
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Este score avalia a legibilidade estrutural e o volume de
                informações do seu currículo.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="grid grid-cols-2 rounded-2xl bg-muted/40 p-1 border border-border/40">
              <TabsTrigger
                value="structure"
                className="rounded-xl font-bold py-2.5"
              >
                Estrutura
              </TabsTrigger>
              <TabsTrigger
                value="words"
                className="rounded-xl font-bold py-2.5"
              >
                Frequência de Palavras
              </TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="mt-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-card/30 border border-border/40 p-4 rounded-2xl">
                  {atsAnalysis.checks.summary ? (
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-emerald-500 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      weight="fill"
                      className="text-rose-500 shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm">
                      Resumo Profissional
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {atsAnalysis.checks.summary
                        ? "Resumo profissional presente e com extensão adequada."
                        : "Seu resumo profissional está muito curto ou ausente. Adicione pelo menos 50 caracteres."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card/30 border border-border/40 p-4 rounded-2xl">
                  {atsAnalysis.checks.contact ? (
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-emerald-500 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      weight="fill"
                      className="text-rose-500 shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm">Dados de Contato</h4>
                    <p className="text-xs text-muted-foreground">
                      {atsAnalysis.checks.contact
                        ? "E-mail e telefone de contato identificados."
                        : "Inclua e-mail e telefone de contato nas suas informações pessoais."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card/30 border border-border/40 p-4 rounded-2xl">
                  {atsAnalysis.checks.experience ? (
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-emerald-500 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      weight="fill"
                      className="text-rose-500 shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm">
                      Experiências Profissionais
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {atsAnalysis.checks.experience
                        ? "Bom volume de experiências detalhadas no currículo."
                        : "Liste pelo menos duas experiências profissionais detalhadas para os robôs ATS."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card/30 border border-border/40 p-4 rounded-2xl">
                  {atsAnalysis.checks.skills ? (
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-emerald-500 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      weight="fill"
                      className="text-rose-500 shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm">
                      Habilidades Técnicas
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {atsAnalysis.checks.skills
                        ? "Lista robusta de competências e tecnologias cadastradas."
                        : "Liste pelo menos 5 habilidades relevantes para enriquecer as buscas do ATS."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-card/30 border border-border/40 p-4 rounded-2xl">
                  {atsAnalysis.checks.length === "ideal" ? (
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-emerald-500 shrink-0"
                    />
                  ) : atsAnalysis.checks.length === "long" ? (
                    <WarningCircle
                      size={24}
                      weight="fill"
                      className="text-amber-500 shrink-0"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      weight="fill"
                      className="text-rose-500 shrink-0"
                    />
                  )}
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-sm">
                      Extensão de Palavras
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {atsAnalysis.checks.length === "ideal"
                        ? `Seu currículo tem ${atsAnalysis.wordCount} palavras. Extensão perfeita!`
                        : atsAnalysis.checks.length === "long"
                          ? `Seu currículo está muito longo (${atsAnalysis.wordCount} palavras). Tente ser mais conciso e direto.`
                          : `Seu currículo está muito curto (${atsAnalysis.wordCount} palavras). Adicione mais detalhes sobre suas conquistas.`}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="words" className="mt-4 space-y-4">
              <div className="bg-card/30 border border-border/40 p-5 rounded-3xl space-y-4">
                <div className="flex items-start gap-2 text-amber-500">
                  <Warning
                    size={20}
                    weight="fill"
                    className="shrink-0 mt-0.5"
                  />
                  <p className="text-xs font-semibold leading-relaxed">
                    Palavras repetidas em excesso empobrecem o texto. Tente
                    diversificar seu vocabulário utilizando sinônimos
                    profissionais.
                  </p>
                </div>

                {repeatedWords.length === 0 ? (
                  <p className="text-sm text-emerald-500 font-bold flex items-center gap-1.5 pt-2">
                    <CheckCircle size={18} weight="fill" /> Excelente! Nenhuma
                    palavra relevante foi repetida excessivamente.
                  </p>
                ) : (
                  <div className="space-y-3 pt-2">
                    {repeatedWords.map((res, i) => (
                      <div
                        key={i}
                        className="flex flex-col gap-1 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-foreground bg-muted/60 border border-border/40 px-2 py-0.5 rounded-lg">
                            {res.word}
                          </span>
                          <span className="text-xs font-black text-amber-500">
                            Repetido {res.count}x
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                          Ocorrências: {res.locations.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
