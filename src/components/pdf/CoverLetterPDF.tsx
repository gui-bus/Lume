import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
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

const styles = StyleSheet.create({
  page: {
    paddingTop: "25mm",
    paddingLeft: "25mm",
    paddingRight: "25mm",
    paddingBottom: "15mm",
    backgroundColor: "#FFFFFF",
    fontFamily: "Roboto",
    color: "#1e293b",
    fontSize: 10.5,
    lineHeight: 1.6,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
    paddingBottom: 16,
    marginBottom: 24,
  },
  senderName: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: -0.5,
    textTransform: "uppercase",
    color: "#1e293b",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    fontSize: 9,
    color: "#64748b",
    alignItems: "center",
    marginTop: 8,
  },
  contactLink: {
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "bold",
  },
  bullet: {
    color: "#64748b",
  },
  metaSection: {
    marginBottom: 24,
  },
  dateText: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 16,
  },
  recipientInfo: {
    color: "#1e293b",
  },
  recipientLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  recipientName: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#1e293b",
    marginBottom: 2,
  },
  recipientCompany: {
    fontWeight: "bold",
    fontSize: 11,
    color: "#1e293b",
  },
  subjectText: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 20,
    color: "#0f172a",
  },
  bodyContent: {
    fontSize: 10.5,
    color: "#1e293b",
    textAlign: "justify",
  },
  paragraph: {
    marginBottom: 16,
  },
});

interface CoverLetterPDFProps {
  data: {
    title: string;
    senderName: string;
    senderEmail: string;
    senderPhone?: string | null;
    senderLocation?: string | null;
    senderLinkedin?: string | null;
    senderGithub?: string | null;
    senderPortfolio?: string | null;
    recipientName?: string | null;
    recipientCompany?: string | null;
    date?: string | null;
    subject?: string | null;
    content: string;
  };
}

export function CoverLetterPDF({ data }: CoverLetterPDFProps) {
  const paragraphs = data.content
    ? data.content.split("\n").filter((p) => p.trim() !== "")
    : [];

  return (
    <Document title={data.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.senderName}>{data.senderName}</Text>

          <View style={styles.contactRow}>
            <Link
              href={`mailto:${data.senderEmail}`}
              style={styles.contactLink}
            >
              {data.senderEmail}
            </Link>

            {data.senderPhone && (
              <>
                <Text style={styles.bullet}>&bull;</Text>
                <Link
                  href={`tel:${data.senderPhone}`}
                  style={styles.contactLink}
                >
                  {data.senderPhone}
                </Link>
              </>
            )}

            {data.senderLocation && (
              <>
                <Text style={styles.bullet}>&bull;</Text>
                <Text style={{ color: "#64748b" }}>{data.senderLocation}</Text>
              </>
            )}

            {data.senderLinkedin && (
              <>
                <Text style={styles.bullet}>&bull;</Text>
                <Link href={data.senderLinkedin} style={styles.contactLink}>
                  LinkedIn
                </Link>
              </>
            )}

            {data.senderGithub && (
              <>
                <Text style={styles.bullet}>&bull;</Text>
                <Link href={data.senderGithub} style={styles.contactLink}>
                  GitHub
                </Link>
              </>
            )}

            {data.senderPortfolio && (
              <>
                <Text style={styles.bullet}>&bull;</Text>
                <Link href={data.senderPortfolio} style={styles.contactLink}>
                  Portfólio
                </Link>
              </>
            )}
          </View>
        </View>

        <View style={styles.metaSection}>
          {data.date && <Text style={styles.dateText}>{data.date}</Text>}

          {(data.recipientName || data.recipientCompany) && (
            <View style={styles.recipientInfo}>
              <Text style={styles.recipientLabel}>Para:</Text>
              {data.recipientName && (
                <Text style={styles.recipientName}>{data.recipientName}</Text>
              )}
              {data.recipientCompany && (
                <Text style={styles.recipientCompany}>
                  {data.recipientCompany}
                </Text>
              )}
            </View>
          )}
        </View>

        {data.subject && (
          <Text style={styles.subjectText}>Assunto: {data.subject}</Text>
        )}

        <View style={styles.bodyContent}>
          {paragraphs.map((p, index) => (
            <Text key={index} style={styles.paragraph}>
              {p}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}
