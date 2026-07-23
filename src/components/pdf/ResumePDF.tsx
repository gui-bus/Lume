import { ResumeData } from "@/types/resume";
import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const PX = 0.75;

const commonStyles = StyleSheet.create({
  qrContainer: {
    position: "absolute",
    bottom: 20 * PX,
    right: 20 * PX,
    flexDirection: "row",
    alignItems: "center",
    gap: 6 * PX,
  },
  qrImage: {
    width: 45 * PX,
    height: 45 * PX,
  },
  qrText: {
    fontSize: 7 * PX,
    color: "#64748b",
    maxWidth: 70 * PX,
  },
});

const translateLevel = (level: string, labels: any) => {
  const map: Record<string, keyof typeof labels.langLevels> = {
    Básico: "basico",
    Intermediário: "intermediario",
    Avançado: "avancado",
    Fluente: "fluente",
    Nativo: "nativo",
  };
  const key = map[level] || "basico";
  return labels.langLevels[key];
};

const getLevelDots = (level: string) => {
  const dots = [];
  const map: Record<string, number> = {
    Básico: 1,
    Basic: 1,
    Intermediário: 2,
    Intermediate: 2,
    Avançado: 3,
    Advanced: 3,
    Fluente: 4,
    Fluent: 4,
    Nativo: 5,
    Native: 5,
  };
  const activeCount = map[level] || 1;
  for (let i = 1; i <= 5; i++) {
    dots.push(
      <View
        key={i}
        style={{
          width: 5 * PX,
          height: 5 * PX,
          borderRadius: 2.5 * PX,
          backgroundColor: i <= activeCount ? "#2563eb" : "#e2e8f0",
          marginLeft: 2 * PX,
        }}
      />,
    );
  }
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>{dots}</View>
  );
};

const getRelativeOrder = (defaultOrder: string[], sectionsOrder?: string[]) => {
  if (!sectionsOrder) return defaultOrder;
  return defaultOrder.slice().sort((a, b) => {
    const idxA = sectionsOrder.indexOf(a);
    const idxB = sectionsOrder.indexOf(b);
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
};

const getFullOrder = (defaultOrder: string[], sectionsOrder?: string[]) => {
  if (!sectionsOrder) return defaultOrder;
  const combined = [...sectionsOrder];
  defaultOrder.forEach((sec) => {
    if (!combined.includes(sec)) combined.push(sec);
  });
  return combined;
};

const ModernTemplate = ({
  data,
  colorTheme,
  labels,
  qrCodeDataUrl,
  sectionsOrder,
}: {
  data: ResumeData;
  colorTheme: string;
  labels: any;
  qrCodeDataUrl?: string;
  sectionsOrder?: string[];
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: "20mm",
      backgroundColor: "#FFFFFF",
      fontFamily: "Roboto",
      color: "#1e293b",
      flexDirection: "row",
      gap: 20 * PX,
    },
    leftCol: {
      width: "30%",
      borderRight: 0.5 * PX,
      borderColor: "#e2e8f0",
      paddingRight: 15 * PX,
    },
    rightCol: {
      width: "70%",
      paddingLeft: 5 * PX,
    },
    name: {
      fontSize: 24 * PX,
      fontWeight: "bold",
      letterSpacing: -0.5,
      marginBottom: 4 * PX,
      color: colorTheme,
      textTransform: "uppercase",
    },
    summary: {
      fontSize: 10.5 * PX,
      lineHeight: 1.5,
      color: "#475569",
      marginBottom: 15 * PX,
    },
    sidebarTitle: {
      fontSize: 9 * PX,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: colorTheme,
      marginBottom: 10 * PX,
      marginTop: 15 * PX,
    },
    contactText: {
      fontSize: 9 * PX,
      color: "#475569",
      marginBottom: 5 * PX,
    },
    link: {
      fontSize: 9 * PX,
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "bold",
      marginBottom: 5 * PX,
    },
    sectionTitle: {
      fontSize: 11 * PX,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.2,
      color: colorTheme,
      marginBottom: 10 * PX,
      marginTop: 12 * PX,
      borderBottom: 0.5 * PX,
      borderColor: "#e2e8f0",
      paddingBottom: 4 * PX,
    },
    item: {
      marginBottom: 12 * PX,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    itemTitle: {
      fontSize: 11 * PX,
      fontWeight: "bold",
      color: "#0f172a",
    },
    itemCompany: {
      fontSize: 10 * PX,
      fontWeight: "bold",
      color: "#475569",
    },
    itemDate: {
      fontSize: 9 * PX,
      color: "#64748b",
    },
    description: {
      fontSize: 9.5 * PX,
      lineHeight: 1.4,
      color: "#475569",
      marginTop: 2 * PX,
    },
    badge: {
      fontSize: 9 * PX,
      padding: "2 6",
      backgroundColor: "#f1f5f9",
      borderRadius: 4 * PX,
      marginRight: 4 * PX,
      marginBottom: 4 * PX,
      color: "#475569",
    },
  });

  const rightColDefault = [
    "summary",
    "experiences",
    "educations",
    "projects",
    "customSections",
  ];
  const rightOrder = getRelativeOrder(rightColDefault, sectionsOrder);

  const sectionsMap: Record<string, React.ReactNode> = {
    summary: data.personalInfo.summary ? (
      <Text key="summary" style={styles.summary}>
        {data.personalInfo.summary}
      </Text>
    ) : null,
    experiences:
      data.experiences && data.experiences.length > 0 ? (
        <View key="experiences">
          <Text style={styles.sectionTitle}>{labels.experience}</Text>
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {exp.featured ? "⭐ " : ""}
                  {exp.position}
                </Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.current ? labels.current : exp.endDate}
                </Text>
              </View>
              <Text style={styles.itemCompany}>
                {exp.company} {exp.location ? `| ${exp.location}` : ""}
              </Text>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    educations:
      data.educations && data.educations.length > 0 ? (
        <View key="educations">
          <Text style={styles.sectionTitle}>{labels.education}</Text>
          {data.educations.map((edu, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.school}</Text>
                <Text style={styles.itemDate}>{edu.graduationDate}</Text>
              </View>
              <Text style={styles.itemCompany}>
                {edu.degree} em {edu.field}
              </Text>
            </View>
          ))}
        </View>
      ) : null,
    projects:
      data.projects && data.projects.length > 0 ? (
        <View key="projects">
          <Text style={styles.sectionTitle}>{labels.projects}</Text>
          {data.projects.map((proj, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {proj.featured ? "⭐ " : ""}
                  {proj.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 6 * PX }}>
                  {proj.github && (
                    <Link style={styles.link} src={proj.github}>
                      {labels.repo}
                    </Link>
                  )}
                  {proj.deploy && (
                    <Link style={styles.link} src={proj.deploy}>
                      {labels.demo}
                    </Link>
                  )}
                </View>
              </View>
              {proj.description && (
                <Text style={styles.description}>{proj.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    customSections:
      data.customSections && data.customSections.length > 0 ? (
        <View key="customSections">
          {data.customSections.map((sec, i) => (
            <View key={i}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map((item, j) => (
                <View key={j} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {item.featured ? "⭐ " : ""}
                      {item.title}
                    </Text>
                    {item.date && (
                      <Text style={styles.itemDate}>{item.date}</Text>
                    )}
                  </View>
                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.leftCol}>
        <Text style={styles.sidebarTitle}>Contato</Text>
        {data.personalInfo.email && (
          <Link style={styles.link} src={`mailto:${data.personalInfo.email}`}>
            {data.personalInfo.email}
          </Link>
        )}
        {data.personalInfo.phone && (
          <Text style={styles.contactText}>{data.personalInfo.phone}</Text>
        )}
        {data.personalInfo.location && (
          <Text style={styles.contactText}>{data.personalInfo.location}</Text>
        )}
        {data.personalInfo.linkedin && (
          <Link style={styles.link} src={data.personalInfo.linkedin}>
            LinkedIn
          </Link>
        )}
        {data.personalInfo.github && (
          <Link style={styles.link} src={data.personalInfo.github}>
            GitHub
          </Link>
        )}
        {data.personalInfo.website && (
          <Link style={styles.link} src={data.personalInfo.website}>
            Portfólio
          </Link>
        )}

        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={styles.sidebarTitle}>{labels.skills}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {data.skills.map((s, i) => (
                <Text key={i} style={styles.badge}>
                  {s}
                </Text>
              ))}
            </View>
          </View>
        )}

        {data.languages && data.languages.length > 0 && (
          <View>
            <Text style={styles.sidebarTitle}>{labels.languages}</Text>
            {data.languages.map((l, i) => (
              <View key={i} style={{ marginBottom: 6 * PX }}>
                <Text style={{ fontSize: 9 * PX, fontWeight: "bold" }}>
                  {l.name}
                </Text>
                <Text style={{ fontSize: 7 * PX, color: "#64748b" }}>
                  {labels.langLabels.conversation}:{" "}
                  {translateLevel(l.conversation, labels)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.name}>
          {data.personalInfo.name || labels.yourName}
        </Text>
        {rightOrder.map((key) => sectionsMap[key])}
      </View>

      {qrCodeDataUrl && (
        <View style={commonStyles.qrContainer} wrap={false}>
          <Text style={commonStyles.qrText}>
            {labels?.qrCodeLabel || "Acesse a versão digital do meu perfil"}
          </Text>
          <Image src={qrCodeDataUrl} style={commonStyles.qrImage} />
        </View>
      )}
    </Page>
  );
};

const ClassicTemplate = ({
  data,
  colorTheme,
  labels,
  qrCodeDataUrl,
  sectionsOrder,
}: {
  data: ResumeData;
  colorTheme: string;
  labels: any;
  qrCodeDataUrl?: string;
  sectionsOrder?: string[];
}) => {
  const styles = StyleSheet.create({
    page: {
      paddingTop: "20mm",
      paddingLeft: "20mm",
      paddingRight: "20mm",
      paddingBottom: "15mm",
      backgroundColor: "#FFFFFF",
      fontFamily: "Roboto",
      color: "#1e293b",
    },
    header: {
      alignItems: "center",
      marginBottom: 20 * PX,
    },
    name: {
      fontSize: 26 * PX,
      fontWeight: "bold",
      color: colorTheme,
      textTransform: "uppercase",
      marginBottom: 6 * PX,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 6 * PX,
      fontSize: 9.5 * PX,
      color: "#475569",
    },
    link: {
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "bold",
    },
    summary: {
      fontSize: 10.5 * PX,
      lineHeight: 1.5,
      color: "#475569",
      marginBottom: 15 * PX,
      textAlign: "justify",
    },
    sectionTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10 * PX,
      marginBottom: 10 * PX,
      marginTop: 15 * PX,
    },
    sectionTitle: {
      fontSize: 10 * PX,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: colorTheme,
    },
    sectionLine: {
      flex: 1,
      height: 0.5 * PX,
      backgroundColor: "#cbd5e1",
    },
    item: {
      marginBottom: 12 * PX,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    itemTitle: {
      fontSize: 12 * PX,
      fontWeight: "bold",
      color: "#0f172a",
    },
    itemSubtitle: {
      fontSize: 10.5 * PX,
      fontWeight: "bold",
      color: "#475569",
      marginTop: 2 * PX,
    },
    itemDate: {
      fontSize: 9 * PX,
      color: "#64748b",
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    description: {
      fontSize: 10 * PX,
      lineHeight: 1.4,
      color: "#475569",
      marginTop: 4 * PX,
    },
    skillsText: {
      fontSize: 10 * PX,
      color: "#475569",
      lineHeight: 1.5,
    },
  });

  const renderSectionTitle = (title: string) => (
    <View style={styles.sectionTitleContainer} wrap={false}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionLine} />
    </View>
  );

  const defaultOrder = [
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
  const order = getFullOrder(defaultOrder, sectionsOrder);

  const sectionsMap: Record<string, React.ReactNode> = {
    summary: data.personalInfo.summary ? (
      <Text key="summary" style={styles.summary}>
        {data.personalInfo.summary}
      </Text>
    ) : null,
    experiences:
      data.experiences && data.experiences.length > 0 ? (
        <View key="experiences">
          {renderSectionTitle(labels.experience)}
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {exp.featured ? "⭐ " : ""}
                  {exp.position}
                </Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.current ? labels.current : exp.endDate}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {exp.company} {exp.location ? `| ${exp.location}` : ""}
              </Text>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    educations:
      data.educations && data.educations.length > 0 ? (
        <View key="educations">
          {renderSectionTitle(labels.education)}
          {data.educations.map((edu, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.school}</Text>
                <Text style={styles.itemDate}>{edu.graduationDate}</Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {edu.degree} em {edu.field}
              </Text>
            </View>
          ))}
        </View>
      ) : null,
    skills:
      data.skills && data.skills.length > 0 ? (
        <View key="skills">
          {renderSectionTitle(labels.skills)}
          <Text style={styles.skillsText}>{data.skills.join(", ")}</Text>
        </View>
      ) : null,
    projects:
      data.projects && data.projects.length > 0 ? (
        <View key="projects">
          {renderSectionTitle(labels.projects)}
          {data.projects.map((proj, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {proj.featured ? "⭐ " : ""}
                  {proj.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 6 * PX }}>
                  {proj.github && (
                    <Link style={styles.link} src={proj.github}>
                      {labels.repo}
                    </Link>
                  )}
                  {proj.deploy && (
                    <Link style={styles.link} src={proj.deploy}>
                      {labels.demo}
                    </Link>
                  )}
                </View>
              </View>
              {proj.description && (
                <Text style={styles.description}>{proj.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    languages:
      data.languages && data.languages.length > 0 ? (
        <View key="languages">
          {renderSectionTitle(labels.languages)}
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 * PX }}
          >
            {data.languages.map((l, i) => (
              <View key={i} style={{ width: "30%" }}>
                <Text style={{ fontSize: 10 * PX, fontWeight: "bold" }}>
                  {l.name}
                </Text>
                <Text style={{ fontSize: 8 * PX, color: "#64748b" }}>
                  {labels.langLabels.conversation}:{" "}
                  {translateLevel(l.conversation, labels)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null,
    certifications:
      data.certifications && data.certifications.length > 0 ? (
        <View key="certifications">
          {renderSectionTitle(labels.certifications || "Certificações")}
          {data.certifications.map((cert, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemDate}>{cert.date}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      ) : null,
    volunteering:
      data.volunteering && data.volunteering.length > 0 ? (
        <View key="volunteering">
          {renderSectionTitle(labels.volunteering || "Voluntariado")}
          {data.volunteering.map((vol, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{vol.role}</Text>
                <Text style={styles.itemDate}>
                  {vol.startDate} - {vol.current ? labels.current : vol.endDate}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{vol.organization}</Text>
              {vol.description && (
                <Text style={styles.description}>{vol.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    courses:
      data.courses && data.courses.length > 0 ? (
        <View key="courses">
          {renderSectionTitle(labels.courses || "Cursos")}
          {data.courses.map((course, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{course.name}</Text>
                {(course.startDate || course.endDate) && (
                  <Text style={styles.itemDate}>
                    {course.startDate ? course.startDate + " - " : ""}
                    {course.current ? labels.current : course.endDate}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : null,
    customSections:
      data.customSections && data.customSections.length > 0 ? (
        <View key="customSections">
          {data.customSections.map((sec, i) => (
            <View key={i}>
              {renderSectionTitle(sec.title)}
              {sec.items.map((item, j) => (
                <View key={j} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {item.featured ? "⭐ " : ""}
                      {item.title}
                    </Text>
                    {item.date && (
                      <Text style={styles.itemDate}>{item.date}</Text>
                    )}
                  </View>
                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {data.personalInfo.name || labels.yourName}
        </Text>
        <View style={styles.contactRow}>
          {data.personalInfo.email && (
            <Link style={styles.link} src={`mailto:${data.personalInfo.email}`}>
              {data.personalInfo.email}
            </Link>
          )}
          {data.personalInfo.phone && (
            <Text>&bull; {data.personalInfo.phone}</Text>
          )}
          {data.personalInfo.location && (
            <Text>&bull; {data.personalInfo.location}</Text>
          )}
          {data.personalInfo.linkedin && (
            <Link style={styles.link} src={data.personalInfo.linkedin}>
              &bull; LinkedIn
            </Link>
          )}
          {data.personalInfo.github && (
            <Link style={styles.link} src={data.personalInfo.github}>
              &bull; GitHub
            </Link>
          )}
          {data.personalInfo.website && (
            <Link style={styles.link} src={data.personalInfo.website}>
              &bull; Portfólio
            </Link>
          )}
        </View>
      </View>

      {order.map((key) => sectionsMap[key])}

      {qrCodeDataUrl && (
        <View style={commonStyles.qrContainer} wrap={false}>
          <Text style={commonStyles.qrText}>
            {labels?.qrCodeLabel || "Acesse a versão digital do meu perfil"}
          </Text>
          <Image src={qrCodeDataUrl} style={commonStyles.qrImage} />
        </View>
      )}
    </Page>
  );
};
const MinimalTemplate = ({
  data,
  colorTheme,
  labels,
  qrCodeDataUrl,
  sectionsOrder,
}: {
  data: ResumeData;
  colorTheme: string;
  labels: any;
  qrCodeDataUrl?: string;
  sectionsOrder?: string[];
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: "22mm",
      backgroundColor: "#FFFFFF",
      fontFamily: "Roboto",
      color: "#27272a",
    },
    name: {
      fontSize: 28 * PX,
      fontWeight: "bold",
      color: colorTheme,
      letterSpacing: -0.8,
      marginBottom: 8 * PX,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8 * PX,
      fontSize: 9 * PX,
      color: "#71717a",
      marginBottom: 20 * PX,
    },
    link: {
      color: "#27272a",
      textDecoration: "none",
      fontWeight: "bold",
    },
    summary: {
      fontSize: 10 * PX,
      lineHeight: 1.6,
      color: "#52525b",
      marginBottom: 20 * PX,
    },
    sectionTitle: {
      fontSize: 9 * PX,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 2.0,
      color: colorTheme,
      marginBottom: 8 * PX,
      marginTop: 18 * PX,
    },
    item: {
      marginBottom: 10 * PX,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    itemTitle: {
      fontSize: 11 * PX,
      fontWeight: "bold",
      color: "#18181b",
    },
    itemSubtitle: {
      fontSize: 9.5 * PX,
      color: "#71717a",
      marginTop: 1 * PX,
    },
    itemDate: {
      fontSize: 8.5 * PX,
      color: "#a1a1aa",
    },
    description: {
      fontSize: 9.5 * PX,
      lineHeight: 1.45,
      color: "#52525b",
      marginTop: 3 * PX,
    },
  });

  const defaultOrder = [
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
  const order = getFullOrder(defaultOrder, sectionsOrder);

  const sectionsMap: Record<string, React.ReactNode> = {
    summary: data.personalInfo.summary ? (
      <Text key="summary" style={styles.summary}>
        {data.personalInfo.summary}
      </Text>
    ) : null,
    experiences:
      data.experiences && data.experiences.length > 0 ? (
        <View key="experiences">
          <Text style={styles.sectionTitle}>{labels.experience}</Text>
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {exp.featured ? "⭐ " : ""}
                  {exp.position} em {exp.company}
                </Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.current ? labels.current : exp.endDate}
                </Text>
              </View>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    educations:
      data.educations && data.educations.length > 0 ? (
        <View key="educations">
          <Text style={styles.sectionTitle}>{labels.education}</Text>
          {data.educations.map((edu, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.school}</Text>
                <Text style={styles.itemDate}>{edu.graduationDate}</Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {edu.degree} in {edu.field}
              </Text>
            </View>
          ))}
        </View>
      ) : null,
    skills:
      data.skills && data.skills.length > 0 ? (
        <View key="skills">
          <Text style={styles.sectionTitle}>{labels.skills}</Text>
          <Text
            style={{ fontSize: 9.5 * PX, color: "#52525b", lineHeight: 1.5 }}
          >
            {data.skills.join("   /   ")}
          </Text>
        </View>
      ) : null,
    projects:
      data.projects && data.projects.length > 0 ? (
        <View key="projects">
          <Text style={styles.sectionTitle}>{labels.projects}</Text>
          {data.projects.map((proj, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {proj.featured ? "⭐ " : ""}
                  {proj.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 8 * PX }}>
                  {proj.github && (
                    <Link style={styles.link} src={proj.github}>
                      {labels.repo}
                    </Link>
                  )}
                  {proj.deploy && (
                    <Link style={styles.link} src={proj.deploy}>
                      {labels.demo}
                    </Link>
                  )}
                </View>
              </View>
              {proj.description && (
                <Text style={styles.description}>{proj.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    languages:
      data.languages && data.languages.length > 0 ? (
        <View key="languages">
          <Text style={styles.sectionTitle}>{labels.languages}</Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 * PX }}
          >
            {data.languages.map((l, i) => (
              <View key={i} style={{ width: "30%" }}>
                <Text style={{ fontSize: 10 * PX, fontWeight: "bold" }}>
                  {l.name}
                </Text>
                <Text style={{ fontSize: 8 * PX, color: "#64748b" }}>
                  {labels.langLabels.conversation}:{" "}
                  {translateLevel(l.conversation, labels)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null,
    certifications:
      data.certifications && data.certifications.length > 0 ? (
        <View key="certifications">
          <Text style={styles.sectionTitle}>
            {labels.certifications || "Certificações"}
          </Text>
          {data.certifications.map((cert, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemDate}>{cert.date}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      ) : null,
    volunteering:
      data.volunteering && data.volunteering.length > 0 ? (
        <View key="volunteering">
          <Text style={styles.sectionTitle}>
            {labels.volunteering || "Voluntariado"}
          </Text>
          {data.volunteering.map((vol, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {vol.role} em {vol.organization}
                </Text>
                <Text style={styles.itemDate}>
                  {vol.startDate} - {vol.current ? labels.current : vol.endDate}
                </Text>
              </View>
              {vol.description && (
                <Text style={styles.description}>{vol.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    courses:
      data.courses && data.courses.length > 0 ? (
        <View key="courses">
          <Text style={styles.sectionTitle}>{labels.courses || "Cursos"}</Text>
          {data.courses.map((course, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{course.name}</Text>
                {(course.startDate || course.endDate) && (
                  <Text style={styles.itemDate}>
                    {course.startDate ? course.startDate + " - " : ""}
                    {course.current ? labels.current : course.endDate}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : null,
    customSections:
      data.customSections && data.customSections.length > 0 ? (
        <View key="customSections">
          {data.customSections.map((sec, i) => (
            <View key={i}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map((item, j) => (
                <View key={j} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {item.featured ? "⭐ " : ""}
                      {item.title}
                    </Text>
                    {item.date && (
                      <Text style={styles.itemDate}>{item.date}</Text>
                    )}
                  </View>
                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.name}>
        {data.personalInfo.name || labels.yourName}
      </Text>
      <View style={styles.contactRow}>
        {data.personalInfo.email && (
          <Link style={styles.link} src={`mailto:${data.personalInfo.email}`}>
            {data.personalInfo.email}
          </Link>
        )}
        {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
        {data.personalInfo.location && (
          <Text>{data.personalInfo.location}</Text>
        )}
        {data.personalInfo.linkedin && (
          <Link style={styles.link} src={data.personalInfo.linkedin}>
            LinkedIn
          </Link>
        )}
        {data.personalInfo.github && (
          <Link style={styles.link} src={data.personalInfo.github}>
            GitHub
          </Link>
        )}
        {data.personalInfo.website && (
          <Link style={styles.link} src={data.personalInfo.website}>
            Portfólio
          </Link>
        )}
      </View>

      {order.map((key) => sectionsMap[key])}

      {qrCodeDataUrl && (
        <View style={commonStyles.qrContainer} wrap={false}>
          <Text style={commonStyles.qrText}>
            {labels?.qrCodeLabel || "Acesse a versão digital do meu perfil"}
          </Text>
          <Image src={qrCodeDataUrl} style={commonStyles.qrImage} />
        </View>
      )}
    </Page>
  );
};
const ExecutiveTemplate = ({
  data,
  colorTheme,
  labels,
  qrCodeDataUrl,
  sectionsOrder,
}: {
  data: ResumeData;
  colorTheme: string;
  labels: any;
  qrCodeDataUrl?: string;
  sectionsOrder?: string[];
}) => {
  const styles = StyleSheet.create({
    page: {
      padding: "24mm",
      backgroundColor: "#FFFFFF",
      fontFamily: "Roboto",
      color: "#18181b",
    },
    header: {
      borderBottom: 1.5 * PX,
      borderColor: colorTheme,
      paddingBottom: 12 * PX,
      marginBottom: 16 * PX,
    },
    name: {
      fontSize: 30 * PX,
      fontWeight: "bold",
      color: colorTheme,
      letterSpacing: -1,
      marginBottom: 6 * PX,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10 * PX,
      fontSize: 9 * PX,
      color: "#475569",
    },
    link: {
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "bold",
    },
    summary: {
      fontSize: 10 * PX,
      lineHeight: 1.5,
      color: "#3f3f46",
      marginBottom: 16 * PX,
    },
    sectionTitle: {
      fontSize: 10 * PX,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: colorTheme,
      marginBottom: 8 * PX,
      marginTop: 16 * PX,
      backgroundColor: "#f4f4f5",
      padding: "4 8",
    },
    item: {
      marginBottom: 10 * PX,
      paddingLeft: 8 * PX,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    itemTitle: {
      fontSize: 11.5 * PX,
      fontWeight: "bold",
      color: "#09090b",
    },
    itemSubtitle: {
      fontSize: 10 * PX,
      fontWeight: "bold",
      color: "#475569",
      marginTop: 1 * PX,
    },
    itemDate: {
      fontSize: 9 * PX,
      color: "#71717a",
    },
    description: {
      fontSize: 9.5 * PX,
      lineHeight: 1.4,
      color: "#3f3f46",
      marginTop: 3 * PX,
    },
  });

  const defaultOrder = [
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
  const order = getFullOrder(defaultOrder, sectionsOrder);

  const sectionsMap: Record<string, React.ReactNode> = {
    summary: data.personalInfo.summary ? (
      <Text key="summary" style={styles.summary}>
        {data.personalInfo.summary}
      </Text>
    ) : null,
    experiences:
      data.experiences && data.experiences.length > 0 ? (
        <View key="experiences">
          <Text style={styles.sectionTitle}>{labels.experience}</Text>
          {data.experiences.map((exp, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {exp.featured ? "⭐ " : ""}
                  {exp.position}
                </Text>
                <Text style={styles.itemDate}>
                  {exp.startDate} - {exp.current ? labels.current : exp.endDate}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {exp.company} {exp.location ? `| ${exp.location}` : ""}
              </Text>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    educations:
      data.educations && data.educations.length > 0 ? (
        <View key="educations">
          <Text style={styles.sectionTitle}>{labels.education}</Text>
          {data.educations.map((edu, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.school}</Text>
                <Text style={styles.itemDate}>{edu.graduationDate}</Text>
              </View>
              <Text style={styles.itemSubtitle}>
                {edu.degree} em {edu.field}
              </Text>
            </View>
          ))}
        </View>
      ) : null,
    skills:
      data.skills && data.skills.length > 0 ? (
        <View key="skills">
          <Text style={styles.sectionTitle}>{labels.skills}</Text>
          <View style={{ paddingLeft: 8 * PX }}>
            <Text style={{ fontSize: 9.5 * PX, color: "#3f3f46" }}>
              {data.skills.join(", ")}
            </Text>
          </View>
        </View>
      ) : null,
    projects:
      data.projects && data.projects.length > 0 ? (
        <View key="projects">
          <Text style={styles.sectionTitle}>{labels.projects}</Text>
          {data.projects.map((proj, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>
                  {proj.featured ? "⭐ " : ""}
                  {proj.name}
                </Text>
                <View style={{ flexDirection: "row", gap: 6 * PX }}>
                  {proj.github && (
                    <Link style={styles.link} src={proj.github}>
                      {labels.repo}
                    </Link>
                  )}
                  {proj.deploy && (
                    <Link style={styles.link} src={proj.deploy}>
                      {labels.demo}
                    </Link>
                  )}
                </View>
              </View>
              {proj.description && (
                <Text style={styles.description}>{proj.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    languages:
      data.languages && data.languages.length > 0 ? (
        <View key="languages">
          <Text style={styles.sectionTitle}>{labels.languages}</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10 * PX,
              paddingLeft: 8 * PX,
            }}
          >
            {data.languages.map((l, i) => (
              <View key={i} style={{ width: "30%" }}>
                <Text
                  style={{
                    fontSize: 10 * PX,
                    fontWeight: "bold",
                    color: "#09090b",
                  }}
                >
                  {l.name}
                </Text>
                <Text style={{ fontSize: 8 * PX, color: "#71717a" }}>
                  {labels.langLabels.conversation}:{" "}
                  {translateLevel(l.conversation, labels)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null,
    certifications:
      data.certifications && data.certifications.length > 0 ? (
        <View key="certifications">
          <Text style={styles.sectionTitle}>
            {labels.certifications || "Certificações"}
          </Text>
          {data.certifications.map((cert, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{cert.name}</Text>
                <Text style={styles.itemDate}>{cert.date}</Text>
              </View>
              <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
            </View>
          ))}
        </View>
      ) : null,
    volunteering:
      data.volunteering && data.volunteering.length > 0 ? (
        <View key="volunteering">
          <Text style={styles.sectionTitle}>
            {labels.volunteering || "Voluntariado"}
          </Text>
          {data.volunteering.map((vol, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{vol.role}</Text>
                <Text style={styles.itemDate}>
                  {vol.startDate} - {vol.current ? labels.current : vol.endDate}
                </Text>
              </View>
              <Text style={styles.itemSubtitle}>{vol.organization}</Text>
              {vol.description && (
                <Text style={styles.description}>{vol.description}</Text>
              )}
            </View>
          ))}
        </View>
      ) : null,
    courses:
      data.courses && data.courses.length > 0 ? (
        <View key="courses">
          <Text style={styles.sectionTitle}>{labels.courses || "Cursos"}</Text>
          {data.courses.map((course, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{course.name}</Text>
                {(course.startDate || course.endDate) && (
                  <Text style={styles.itemDate}>
                    {course.startDate ? course.startDate + " - " : ""}
                    {course.current ? labels.current : course.endDate}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : null,
    customSections:
      data.customSections && data.customSections.length > 0 ? (
        <View key="customSections">
          {data.customSections.map((sec, i) => (
            <View key={i}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map((item, j) => (
                <View key={j} style={styles.item} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>
                      {item.featured ? "⭐ " : ""}
                      {item.title}
                    </Text>
                    {item.date && (
                      <Text style={styles.itemDate}>{item.date}</Text>
                    )}
                  </View>
                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {data.personalInfo.name || labels.yourName}
        </Text>
        <View style={styles.contactRow}>
          {data.personalInfo.email && (
            <Link style={styles.link} src={`mailto:${data.personalInfo.email}`}>
              {data.personalInfo.email}
            </Link>
          )}
          {data.personalInfo.phone && <Text>{data.personalInfo.phone}</Text>}
          {data.personalInfo.location && (
            <Text>{data.personalInfo.location}</Text>
          )}
          {data.personalInfo.linkedin && (
            <Link style={styles.link} src={data.personalInfo.linkedin}>
              LinkedIn
            </Link>
          )}
          {data.personalInfo.github && (
            <Link style={styles.link} src={data.personalInfo.github}>
              GitHub
            </Link>
          )}
          {data.personalInfo.website && (
            <Link style={styles.link} src={data.personalInfo.website}>
              Portfólio
            </Link>
          )}
        </View>
      </View>

      {order.map((key) => sectionsMap[key])}

      {qrCodeDataUrl && (
        <View style={commonStyles.qrContainer} wrap={false}>
          <Text style={commonStyles.qrText}>
            {labels?.qrCodeLabel || "Acesse a versão digital do meu perfil"}
          </Text>
          <Image src={qrCodeDataUrl} style={commonStyles.qrImage} />
        </View>
      )}
    </Page>
  );
};

export const ResumePDF = ({
  data,
  colorTheme = "#18181b",
  templateId = "modern",
  qrCodeDataUrl,
  labels,
  sectionsOrder,
}: {
  data: ResumeData;
  colorTheme?: string;
  templateId?: string;
  qrCodeDataUrl?: string;
  sectionsOrder?: string[];
  labels: {
    title: string;
    yourName: string;
    portfolio: string;
    experience: string;
    education: string;
    skills: string;
    languages: string;
    certifications?: string;
    projects: string;
    volunteering?: string;
    courses?: string;
    current: string;
    at: string;
    repo: string;
    demo: string;
    langLabels: {
      conversation: string;
      writing: string;
      reading: string;
    };
    langLevels: {
      basico: string;
      intermediario: string;
      avancado: string;
      fluente: string;
      nativo: string;
    };
    qrCodeLabel?: string;
  };
}) => {
  return (
    <Document
      title={`${labels.title} - ${data.personalInfo.name || "Lume"}`}
      author="Lume"
    >
      {templateId === "classic" && (
        <ClassicTemplate
          data={data}
          colorTheme={colorTheme}
          labels={labels}
          qrCodeDataUrl={qrCodeDataUrl}
          sectionsOrder={sectionsOrder}
        />
      )}
      {templateId === "minimal" && (
        <MinimalTemplate
          data={data}
          colorTheme={colorTheme}
          labels={labels}
          qrCodeDataUrl={qrCodeDataUrl}
          sectionsOrder={sectionsOrder}
        />
      )}
      {templateId === "executive" && (
        <ExecutiveTemplate
          data={data}
          colorTheme={colorTheme}
          labels={labels}
          qrCodeDataUrl={qrCodeDataUrl}
          sectionsOrder={sectionsOrder}
        />
      )}
      {templateId === "modern" && (
        <ModernTemplate
          data={data}
          colorTheme={colorTheme}
          labels={labels}
          qrCodeDataUrl={qrCodeDataUrl}
          sectionsOrder={sectionsOrder}
        />
      )}
    </Document>
  );
};
