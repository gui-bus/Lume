"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  Download,
  Desktop,
  Globe,
  Calendar,
  Clock,
  DeviceMobile,
  DeviceTablet,
  Info,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { UserButton } from "@clerk/nextjs";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTheme } from "@/components/theme-provider";
import { Logo } from "@/components/ui/Logo";
import { Sun, Moon } from "@phosphor-icons/react";

interface DailyData {
  date: string;
  views: number;
  downloads: number;
}

interface HourlyData {
  hour: string;
  views: number;
  downloads: number;
}

interface RefererData {
  source: string;
  count: number;
}

interface DeviceData {
  name: string;
  value: number;
}

interface AnalyticsClientProps {
  resumeId: string;
  resumeTitle: string;
  analyticsData: {
    views: number;
    downloads: number;
    dailyData: DailyData[];
    hourlyData: HourlyData[];
    referers: RefererData[];
    devices: DeviceData[];
  };
}

export function AnalyticsClient({
  resumeId,
  resumeTitle,
  analyticsData,
}: AnalyticsClientProps) {
  const t = useTranslations("common");
  const activeLocale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const getDeviceIcon = (name: string) => {
    switch (name) {
      case "Mobile":
        return <DeviceMobile size={18} />;
      case "Tablet":
        return <DeviceTablet size={18} />;
      default:
        return <Desktop size={18} />;
    }
  };

  const totalEvents = analyticsData.dailyData.reduce(
    (acc, curr) => acc + curr.views + curr.downloads,
    0,
  );

  return (
    <div className="flex-1 w-full min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/${activeLocale}/dashboard`)}
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
              Painel de Métricas
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
          <UserButton />
        </div>
      </header>

      <main className="flex-1 w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border/40 rounded-3xl bg-card/40 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Eye size={24} weight="duotone" />
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Visualizações Totais
                </span>
                <h3 className="text-3xl font-black tracking-tight leading-none mt-1">
                  {analyticsData.views}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 rounded-3xl bg-card/40 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Download size={24} weight="duotone" />
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Downloads Realizados
                </span>
                <h3 className="text-3xl font-black tracking-tight leading-none mt-1">
                  {analyticsData.downloads}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 rounded-3xl bg-card/40 backdrop-blur-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Info size={24} weight="duotone" />
              </div>
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Interações Registradas
                </span>
                <h3 className="text-3xl font-black tracking-tight leading-none mt-1">
                  {totalEvents}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" />
              <h4 className="font-extrabold text-md">
                Acessos ao Longo do Tempo
              </h4>
            </div>

            <div className="h-72 w-full">
              {analyticsData.dailyData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-semibold border border-dashed border-border/60 rounded-2xl bg-muted/10">
                  Nenhum dado registrado para o período.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.dailyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorViews"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorDownloads"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33333333" />
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e24",
                        borderColor: "#333333",
                      }}
                      labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      name="Views"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      strokeWidth={2.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="downloads"
                      name="Downloads"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorDownloads)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card className="border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-muted-foreground" />
              <h4 className="font-extrabold text-md">Horários de Maior Pico</h4>
            </div>

            <div className="h-72 w-full">
              {totalEvents === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-semibold border border-dashed border-border/60 rounded-2xl bg-muted/10">
                  Nenhum dado registrado.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.hourlyData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#33333333" />
                    <XAxis
                      dataKey="hour"
                      stroke="#888888"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e24",
                        borderColor: "#333333",
                      }}
                    />
                    <Bar
                      dataKey="views"
                      name="Views"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="downloads"
                      name="Downloads"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-muted-foreground" />
              <h4 className="font-extrabold text-md">
                Origem do Tráfego (Referers)
              </h4>
            </div>

            <div className="space-y-3">
              {analyticsData.referers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum dado de origem registrado.
                </p>
              ) : (
                analyticsData.referers.map((ref, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="font-semibold text-sm text-foreground">
                      {ref.source}
                    </span>
                    <span className="font-bold text-sm bg-muted px-2.5 py-0.5 rounded-full">
                      {ref.count} acessos
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="border-border/40 rounded-3xl bg-card/20 backdrop-blur-sm p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Desktop size={18} className="text-muted-foreground" />
              <h4 className="font-extrabold text-md">
                Dispositivos Utilizados
              </h4>
            </div>

            <div className="space-y-3">
              {analyticsData.devices.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum dispositivo registrado.
                </p>
              ) : (
                analyticsData.devices.map((dev, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                      {getDeviceIcon(dev.name)}
                      <span>{dev.name}</span>
                    </div>
                    <span className="font-bold text-sm bg-muted px-2.5 py-0.5 rounded-full">
                      {dev.value} acessos
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
