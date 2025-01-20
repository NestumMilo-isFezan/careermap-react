import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 4,
    },
    profileDetails: {
        flex: 1,
    },
    section: {
        marginBottom: 20,
    },
    twoColumnSection: {
        flexDirection: 'row',
        gap: 20,
    },
    column: {
        flex: 1,
    },
    heading: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        color: '#047857',
        marginBottom: 5,
    },
    subHeading: {
        fontSize: 16,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 3,
    },
    divider: {
        borderBottom: 1,
        borderBottomColor: '#047857',
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        fontFamily: 'Helvetica',
        marginBottom: 5,
    },
    itemContainer: {
        marginBottom: 8,
    },
    dateText: {
        fontSize: 11,
        fontFamily: 'Helvetica-Oblique',
        color: '#4B5563',
    },
    regularSection: {
        marginBottom: 20,
        paddingHorizontal: '0%',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    boldText: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
    },
    italicText: {
        fontSize: 12,
        fontFamily: 'Helvetica-Oblique',
    },
    skillItem: {
        fontSize: 12,
        fontFamily: 'Helvetica',
        marginBottom: 16,
        paddingVertical: 2,
    },
});

type ResumeFormData = {
    _method?: string;
    profile: {
        name: string;
        email: string;
        phone: string;
        address: string;
        image: File | null;
        image_preview: string;
    },
    summary: string;
    education: Array<{
        school: string;
        education_level: string;
        start_date: string;
        end_date: string;
    }>,
    experiences: Array<{
        activity: string;
        position: string;
        start_date: string;
        end_date: string;
    }>,
    certifications: Array<{
        certification: string;
        date_of_issue: string;
    }>,
    skills: Array<{
        skill: string;
        level: string;
    }>,
    soft_skills: Array<{
        soft_skill: string;
    }>,
    languages: Array<{
        language: string;
        level: string;
    }>,
}

interface Props {
    data: ResumeFormData;
}

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function ResumePDF({ data }: Props) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header: Image and Profile Section */}
                <View style={styles.header}>
                    {data.profile.image_preview && (
                        <Image
                            style={styles.profileImage}
                            src={data.profile.image_preview}
                        />
                    )}
                    <View style={styles.profileDetails}>
                        <Text style={styles.heading}>{data.profile.name}</Text>
                        <Text style={styles.text}>{data.profile.email}</Text>
                        <Text style={styles.text}>{data.profile.phone}</Text>
                        <Text style={styles.text}>{data.profile.address}</Text>
                    </View>
                </View>

                {/* Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.subHeading}>Professional Summary</Text>
                    <View style={styles.divider} />
                    <Text style={styles.text}>{data.summary}</Text>
                </View>

                {/* Education Section */}
                <View style={styles.regularSection}>
                    <Text style={styles.subHeading}>Education</Text>
                    <View style={styles.divider} />
                    {data.education.map((edu, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.boldText}>{edu.school}</Text>
                                <Text style={styles.dateText}>{`${edu.start_date} - ${edu.end_date}`}</Text>
                            </View>
                            <Text style={styles.text}>{edu.education_level}</Text>
                        </View>
                    ))}
                </View>

                {/* Experience Section */}
                <View style={styles.regularSection}>
                    <Text style={styles.subHeading}>Experience</Text>
                    <View style={styles.divider} />
                    {data.experiences.map((exp, index) => (
                        <View key={index} style={styles.itemContainer}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.boldText}>{exp.activity}</Text>
                                <Text style={styles.dateText}>{`${exp.start_date} - ${exp.end_date}`}</Text>
                            </View>
                            <Text style={styles.text}>{exp.position}</Text>
                        </View>
                    ))}
                </View>

                {/* Skills and Soft Skills Section */}
                <View style={styles.twoColumnSection}>
                    <View style={styles.column}>
                        <Text style={styles.subHeading}>Skills</Text>
                        <View style={styles.divider} />
                        {data.skills.map((skill, index) => (
                            <Text key={index} style={styles.skillItem}>
                                {skill.skill} - {capitalizeFirstLetter(skill.level)}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.subHeading}>Soft Skills</Text>
                        <View style={styles.divider} />
                        {data.soft_skills.map((skill, index) => (
                            <Text key={index} style={styles.skillItem}>
                                {skill.soft_skill}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Certificates and Languages Section */}
                <View style={styles.twoColumnSection}>
                    <View style={styles.column}>
                        <Text style={styles.subHeading}>Certificates</Text>
                        <View style={styles.divider} />
                        {data.certifications.map((cert, index) => (
                            <View key={index} style={styles.skillItem}>
                                <Text style={styles.text}>{cert.certification}</Text>
                                <Text style={styles.dateText}>{cert.date_of_issue}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.subHeading}>Languages</Text>
                        <View style={styles.divider} />
                        {data.languages.map((lang, index) => (
                            <Text key={index} style={styles.skillItem}>
                                {lang.language} - {capitalizeFirstLetter(lang.level)}
                            </Text>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
}
