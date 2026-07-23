"use client";

import { ResumeData } from "@/types/resume";
import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

interface ResumeViewProps {
  data: ResumeData;
  colorTheme?: string;
  qrCodeUrl?: string;
  labels?: any;
  sectionsOrder?: string[];
  templateId?: string;
}

export function ResumeView({
  data,
  colorTheme = "#18181b",
  qrCodeUrl,
  labels,
  sectionsOrder,
}: ResumeViewProps) {
  const tOriginal = useTranslations("common.resume");
  const locale = useLocale();

  const t = useMemo(() => {
    if (!labels) return tOriginal;

    return (key: string) => {
      if (key === "yourName") return labels.yourName || tOriginal(key);
      if (key === "portfolio") return labels.portfolio || tOriginal(key);
      if (key === "experience") return labels.experience || tOriginal(key);
      if (key === "education") return labels.education || tOriginal(key);
      if (key === "skills") return labels.skills || tOriginal(key);
      if (key === "languages") return labels.languages || tOriginal(key);
      if (key === "certifications")
        return labels.certifications || tOriginal(key);
      if (key === "projects") return labels.projects || tOriginal(key);
      if (key === "volunteering") return labels.volunteering || tOriginal(key);
      if (key === "courses") return labels.courses || tOriginal(key);
      if (key === "current") return labels.current || tOriginal(key);
      if (key === "at") return labels.at || tOriginal(key);
      if (key === "repo") return labels.repo || tOriginal(key);
      if (key === "demo") return labels.demo || tOriginal(key);
      if (key === "extras.languages.conversation")
        return labels.langLabels?.conversation || tOriginal(key);
      if (key === "extras.languages.writing")
        return labels.langLabels?.writing || tOriginal(key);
      if (key === "extras.languages.reading")
        return labels.langLabels?.reading || tOriginal(key);

      if (key.startsWith("extras.languages.levels.")) {
        const levelKey = key.replace(
          "extras.languages.levels.",
          "",
        ) as keyof typeof labels.langLevels;
        return labels.langLevels?.[levelKey] || tOriginal(key);
      }

      return tOriginal(key);
    };
  }, [labels, tOriginal]);

  const {
    personalInfo,
    experiences,
    educations,
    skills,
    projects,
    languages,
    certifications,
    volunteering,
    courses,
    customSections,
  } = data;

  const renderSectionHeader = (titleKey: string) => {
    return (
      <div className="flex items-center gap-4 mb-4">
        <h2
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color: colorTheme }}
        >
          {t(titleKey)}
        </h2>
        <div className="flex-1 h-[0.5px] bg-slate-200" />
      </div>
    );
  };

  const content = useMemo(() => {
    const sectionRenderers: Record<string, React.ReactNode> = {
      summary: personalInfo.summary ? (
        <section key="summary" className="mb-6">
          {renderSectionHeader("summary")}
          <p className="text-[12px] text-slate-600 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      ) : null,
      experiences:
        experiences?.length > 0 ? (
          <section key="experiences">
            {renderSectionHeader("experience")}
            {experiences.map((exp, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[14px] text-slate-900 uppercase">
                    {exp.company} —{" "}
                    <span className="font-semibold normal-case text-slate-600">
                      {exp.position}
                    </span>
                    {exp.featured && (
                      <span className="ml-2 text-yellow-500">⭐</span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {exp.startDate} — {exp.current ? t("current") : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-[12px] text-slate-600 leading-relaxed prose prose-sm max-w-none mt-1">
                    <ReactMarkdown>{exp.description}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          </section>
        ) : null,
      educations:
        educations?.length > 0 ? (
          <section key="educations">
            {renderSectionHeader("education")}
            {educations.map((edu, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[13px] text-slate-900 uppercase">
                    {edu.school}{" "}
                    <span className="font-semibold normal-case text-slate-600">
                      | {edu.degree} — {edu.field}
                    </span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {edu.graduationDate}
                  </span>
                </div>
              </div>
            ))}
          </section>
        ) : null,
      courses:
        courses?.length > 0 ? (
          <section key="courses">
            {renderSectionHeader("courses")}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {courses.map((c, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[12px] text-slate-900 truncate pr-2">
                    {c.name}
                  </h3>
                  <span className="text-[9px] text-slate-400 font-bold uppercase whitespace-nowrap">
                    {c.startDate && `${c.startDate} — `}
                    {c.current ? t("current") : c.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null,
      skills:
        skills?.length > 0 ? (
          <section key="skills">
            {renderSectionHeader("skills")}
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        ) : null,
      languages:
        languages?.length > 0 ? (
          <section key="languages">
            {renderSectionHeader("languages")}
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              {languages.map((l, i) => {
                const translateLevel = (level: string) => {
                  const map: Record<string, string> = {
                    Básico: "basico",
                    Intermediário: "intermediario",
                    Avançado: "avancado",
                    Fluente: "fluente",
                    Nativo: "nativo",
                  };
                  const key = map[level] || "basico";
                  return t(`extras.languages.levels.${key}`);
                };

                const getLevelDots = (level: string) => {
                  const levels = [
                    "Básico",
                    "Intermediário",
                    "Avançado",
                    "Fluente",
                    "Nativo",
                  ];
                  const index = levels.indexOf(level) + 1;
                  return (
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((dot) => (
                        <div
                          key={dot}
                          className={`w-1.5 h-1.5 rounded-full ${
                            dot <= index ? "bg-slate-400" : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                  );
                };

                return (
                  <div key={i} className="space-y-2">
                    <span className="font-black text-[11px] text-slate-800 uppercase tracking-wider block mb-1">
                      {l.name}
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      <div className="flex items-center justify-between group">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          {t("extras.languages.conversation")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase">
                            {translateLevel(l.conversation)}
                          </span>
                          {getLevelDots(l.conversation)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          {t("extras.languages.writing")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase">
                            {translateLevel(l.writing)}
                          </span>
                          {getLevelDots(l.writing)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between group">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                          {t("extras.languages.reading")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-slate-600 uppercase">
                            {translateLevel(l.reading)}
                          </span>
                          {getLevelDots(l.reading)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null,
      certifications:
        certifications?.length > 0 ? (
          <section key="certifications">
            {renderSectionHeader("certifications")}
            {certifications.map((c, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[12px] text-slate-900">
                    {c.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {c.date}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{c.issuer}</p>
              </div>
            ))}
          </section>
        ) : null,
      projects:
        projects?.length > 0 ? (
          <section key="projects">
            {renderSectionHeader("projects")}
            {projects.map((p, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-[13px] text-slate-900">
                    {p.name}
                    {p.featured && (
                      <span className="ml-2 text-yellow-500">⭐</span>
                    )}
                  </h3>
                  <div className="flex gap-3 text-[9px] font-bold uppercase">
                    {p.github && (
                      <a
                        href={p.github}
                        target="_blank"
                        className="text-blue-600"
                      >
                        {t("repo")}
                      </a>
                    )}
                    {p.deploy && (
                      <a
                        href={p.deploy}
                        target="_blank"
                        className="text-blue-600"
                      >
                        {t("demo")}
                      </a>
                    )}
                  </div>
                </div>
                {p.description && (
                  <p className="text-[11.5px] text-slate-600 leading-relaxed">
                    {p.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        ) : null,
      volunteering:
        volunteering?.length > 0 ? (
          <section key="volunteering">
            {renderSectionHeader("volunteering")}
            {volunteering.map((v, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-[13px] text-slate-900">
                    {v.organization}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {v.role}
                  </span>
                </div>
                {v.description && (
                  <p className="text-[11.5px] text-slate-600 leading-relaxed mt-1">
                    {v.description}
                  </p>
                )}
              </div>
            ))}
          </section>
        ) : null,
      customSections:
        customSections && customSections.length > 0 ? (
          <div key="customSections" className="space-y-8">
            {customSections.map((sec, idx) => (
              <section key={sec.id || idx}>
                <div className="flex items-center gap-4 mb-4">
                  <h2
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: colorTheme }}
                  >
                    {sec.title}
                  </h2>
                  <div className="flex-1 h-[0.5px] bg-slate-200" />
                </div>
                {sec.items?.map((item, i) => (
                  <div key={item.id || i} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[13px] text-slate-900">
                        {item.title}
                        {item.featured && (
                          <span className="ml-2 text-yellow-500">⭐</span>
                        )}
                      </h3>
                      {item.date && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-[11.5px] text-slate-600 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </div>
        ) : null,
    };

    const defaultSectionsOrder = [
      "summary",
      "experiences",
      "educations",
      "skills",
      "projects",
      "languages",
      "certifications",
      "volunteering",
      "courses",
      "customSections",
    ];

    const orderToUse = sectionsOrder || defaultSectionsOrder;

    return (
      <div className="a4-page flex flex-col shadow-none text-left">
        {/* Header */}
        <div className="flex flex-col gap-2 pb-8">
          <h1
            className="text-[28px] font-bold tracking-tight leading-tight uppercase"
            style={{ color: colorTheme }}
          >
            {personalInfo.name || t("yourName")}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold text-slate-500">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="text-lume-blue hover:underline"
              >
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && (
              <>
                <span className="text-slate-300 font-medium">•</span>
                <a
                  href={`https://wa.me/${personalInfo.phone.replace(/\D/g, "")}?text=${encodeURIComponent(locale === "en" ? "I saw your resume" : "Vim pelo seu currículo")}`}
                  target="_blank"
                  className="text-lume-blue hover:underline"
                >
                  {personalInfo.phone}
                </a>
              </>
            )}
            {personalInfo.location && (
              <>
                <span className="text-slate-300">•</span>
                <span>{personalInfo.location}</span>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  className="text-lume-blue font-bold uppercase tracking-wider"
                >
                  LinkedIn
                </a>
              </>
            )}
            {personalInfo.github && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  className="text-lume-blue font-bold uppercase tracking-wider"
                >
                  GitHub
                </a>
              </>
            )}
            {personalInfo.website && (
              <>
                <span className="text-slate-300">•</span>
                <a
                  href={personalInfo.website}
                  target="_blank"
                  className="text-lume-blue font-bold uppercase tracking-wider"
                >
                  {t("portfolio")}
                </a>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Sections */}
        <div className="space-y-8">
          {orderToUse.map((sectionId) => sectionRenderers[sectionId])}

          {qrCodeUrl && (
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-100 no-print">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-right max-w-[150px]">
                {labels?.qrCodeLabel || "Acesse a versão digital do meu perfil"}
              </span>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-12 h-12 rounded border border-slate-100 p-0.5 bg-white"
              />
            </div>
          )}
        </div>
      </div>
    );
  }, [data, colorTheme, qrCodeUrl, t, sectionsOrder, labels]);

  return content;
}
