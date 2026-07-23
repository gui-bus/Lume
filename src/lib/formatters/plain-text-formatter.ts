import { ResumeData } from "@/types/resume";

export function formatResumeToPlainText(data: ResumeData): string {
  const lines: string[] = [];

  const pi = data.personalInfo;
  if (pi.name) {
    lines.push(pi.name.toUpperCase());

    const contactInfo: string[] = [];
    if (pi.email) contactInfo.push(pi.email);
    if (pi.phone) contactInfo.push(pi.phone);
    if (pi.location) contactInfo.push(pi.location);
    lines.push(contactInfo.join(" | "));

    const socialLinks: string[] = [];
    if (pi.linkedin) socialLinks.push(`LinkedIn: ${pi.linkedin}`);
    if (pi.github) socialLinks.push(`GitHub: ${pi.github}`);
    if (pi.website) socialLinks.push(`Website: ${pi.website}`);
    if (socialLinks.length > 0) {
      lines.push(socialLinks.join(" | "));
    }

    lines.push("");
  }

  if (pi.summary) {
    lines.push("RESUMO PROFISSIONAL");
    lines.push("-------------------");
    lines.push(pi.summary);
    lines.push("");
  }

  if (data.experiences && data.experiences.length > 0) {
    lines.push("EXPERIÊNCIA PROFISSIONAL");
    lines.push("------------------------");
    data.experiences.forEach((exp) => {
      const headerParts: string[] = [exp.position, exp.company];
      if (exp.location) headerParts.push(exp.location);

      const dateStr = `${exp.startDate} - ${exp.current ? "Presente" : exp.endDate || ""}`;
      lines.push(`${headerParts.join(" em ")} (${dateStr})`);

      if (exp.description) {
        lines.push(exp.description);
      }
      lines.push("");
    });
  }

  if (data.educations && data.educations.length > 0) {
    lines.push("EDUCAÇÃO / FORMAÇÃO ACADÊMICA");
    lines.push("-----------------------------");
    data.educations.forEach((edu) => {
      lines.push(`${edu.degree} em ${edu.field}`);
      lines.push(`${edu.school} (Graduação: ${edu.graduationDate})`);
      lines.push("");
    });
  }

  if (data.skills && data.skills.length > 0) {
    lines.push("PRINCIPAIS HABILIDADES");
    lines.push("----------------------");
    lines.push(data.skills.join(", "));
    lines.push("");
  }

  if (data.projects && data.projects.length > 0) {
    lines.push("PROJETOS");
    lines.push("--------");
    data.projects.forEach((proj) => {
      lines.push(proj.name);
      const links: string[] = [];
      if (proj.link) links.push(`Link: ${proj.link}`);
      if (proj.github) links.push(`GitHub: ${proj.github}`);
      if (proj.deploy) links.push(`Deploy: ${proj.deploy}`);
      if (links.length > 0) {
        lines.push(links.join(" | "));
      }
      if (proj.description) {
        lines.push(proj.description);
      }
      lines.push("");
    });
  }

  if (data.languages && data.languages.length > 0) {
    lines.push("IDIOMAS");
    lines.push("-------");
    data.languages.forEach((lang) => {
      lines.push(
        `${lang.name} (Conversação: ${lang.conversation} | Escrita: ${lang.writing} | Leitura: ${lang.reading})`,
      );
    });
    lines.push("");
  }

  if (data.certifications && data.certifications.length > 0) {
    lines.push("CERTIFICAÇÕES");
    lines.push("-------------");
    data.certifications.forEach((cert) => {
      lines.push(`${cert.name} - Emitido por: ${cert.issuer} (${cert.date})`);
    });
    lines.push("");
  }

  if (data.volunteering && data.volunteering.length > 0) {
    lines.push("TRABALHO VOLUNTÁRIO");
    lines.push("-------------------");
    data.volunteering.forEach((vol) => {
      const dateStr = `${vol.startDate} - ${vol.current ? "Presente" : vol.endDate || ""}`;
      lines.push(`${vol.role} na organização ${vol.organization} (${dateStr})`);
      if (vol.description) {
        lines.push(vol.description);
      }
      lines.push("");
    });
  }

  if (data.courses && data.courses.length > 0) {
    lines.push("CURSOS E TREINAMENTOS");
    lines.push("---------------------");
    data.courses.forEach((course) => {
      const dateStr = course.startDate
        ? `(${course.startDate}${course.endDate ? ` - ${course.endDate}` : ""})`
        : "";
      lines.push(`${course.name} ${dateStr}`);
    });
    lines.push("");
  }

  if (data.customSections && data.customSections.length > 0) {
    data.customSections.forEach((section) => {
      lines.push(section.title.toUpperCase());
      lines.push("-".repeat(section.title.length));
      section.items.forEach((item) => {
        const dateStr = item.date ? ` (${item.date})` : "";
        lines.push(`${item.title}${dateStr}`);
        if (item.description) {
          lines.push(item.description);
        }
        lines.push("");
      });
    });
  }

  return lines.join("\n").trim();
}
