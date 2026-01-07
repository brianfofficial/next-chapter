import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2pt solid #D4AF37",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 10,
    color: "#555555",
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#D4AF37",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  athleticInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: "1pt solid #eeeeee",
  },
  athleticInfoColumn: {
    width: "48%",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#333333",
    width: 100,
  },
  infoValue: {
    color: "#555555",
    flex: 1,
  },
  summary: {
    lineHeight: 1.6,
    color: "#333333",
    textAlign: "justify",
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 15,
    fontSize: 10,
    color: "#D4AF37",
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.5,
    color: "#333333",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#999999",
    borderTop: "1pt solid #eeeeee",
    paddingTop: 10,
  },
})

interface ResumeTemplateProps {
  athleteData: {
    name: string
    email: string
    sport?: string
    position?: string
    school?: string
    graduation_year?: number
    gpa?: number
    major?: string
    translated_summary?: string
    translated_bullets?: string[]
  }
}

export function ResumeTemplate({ athleteData }: ResumeTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{athleteData.name}</Text>
          <Text style={styles.contactInfo}>{athleteData.email}</Text>
          {athleteData.school && (
            <Text style={styles.contactInfo}>
              {athleteData.school}
              {athleteData.graduation_year && ` • Class of ${athleteData.graduation_year}`}
            </Text>
          )}
        </View>

        {/* Athletic Background */}
        {(athleteData.sport || athleteData.position || athleteData.gpa || athleteData.major) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Athletic Background</Text>
            <View style={styles.athleticInfo}>
              <View style={styles.athleticInfoColumn}>
                {athleteData.sport && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Sport:</Text>
                    <Text style={styles.infoValue}>{athleteData.sport}</Text>
                  </View>
                )}
                {athleteData.position && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Position:</Text>
                    <Text style={styles.infoValue}>{athleteData.position}</Text>
                  </View>
                )}
              </View>
              <View style={styles.athleticInfoColumn}>
                {athleteData.major && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Major:</Text>
                    <Text style={styles.infoValue}>{athleteData.major}</Text>
                  </View>
                )}
                {athleteData.gpa && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>GPA:</Text>
                    <Text style={styles.infoValue}>{athleteData.gpa}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Professional Summary */}
        {athleteData.translated_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{athleteData.translated_summary}</Text>
          </View>
        )}

        {/* Key Skills & Achievements */}
        {athleteData.translated_bullets && athleteData.translated_bullets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Skills & Achievements</Text>
            {athleteData.translated_bullets.map((bullet, index) => (
              <View key={index} style={styles.bullet}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.bulletText}>{bullet}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Professional profile created with Next Chapter • {new Date().getFullYear()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
