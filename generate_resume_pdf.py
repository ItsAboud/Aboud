from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
)

OUTPUT_FILE = "resume-aboud.pdf"


def build_resume():
    doc = SimpleDocTemplate(
        OUTPUT_FILE,
        pagesize=A4,
        leftMargin=0.8 * inch,
        rightMargin=0.8 * inch,
        topMargin=0.8 * inch,
        bottomMargin=0.8 * inch,
    )

    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="SectionHeader",
            parent=styles["Heading3"],
            fontSize=14,
            textColor=colors.HexColor("#1f1f1f"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontSize=11,
            leading=16,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Meta",
            parent=styles["BodyText"],
            fontSize=10,
            textColor=colors.HexColor("#555555"),
        )
    )

    elements = []

    title = Paragraph("<b>Curriculum Vitae</b>", styles["Heading1"])
    subtitle = Paragraph(
        "Abduljabbar Safwan Hammoud · Informatics Engineering Student", styles["Meta"]
    )
    elements.extend([title, subtitle, Spacer(1, 12)])

    summary = (
        "Motivated Informatics Engineering student with over 6 years of programming "
        "experience, starting from 2019. Skilled in multiple programming languages and "
        "passionate about software development, problem-solving, and building efficient digital "
        "solutions. Strong ability to learn new technologies and work on both web and software projects."
    )
    elements.extend(
        [
            Paragraph("Professional Summary", styles["SectionHeader"]),
            Paragraph(summary, styles["Body"]),
            Spacer(1, 10),
        ]
    )

    contact_data = [
        ["Field:", "Informatics Engineering Student"],
        ["Country of Residence:", "Syria"],
        ["Phone:", "+963 985 031 125"],
        ["Email:", "aboodhammoud54@gmail.com"],
    ]
    contact_table = Table(contact_data, hAlign="LEFT", colWidths=[160, 260])
    contact_table.setStyle(
        TableStyle(
            [
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#555555")),
                ("TEXTCOLOR", (1, 0), (1, -1), colors.HexColor("#111111")),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    elements.extend(
        [
            Paragraph("Personal Details", styles["SectionHeader"]),
            contact_table,
            Spacer(1, 10),
        ]
    )

    elements.extend(
        [
            Paragraph("Education", styles["SectionHeader"]),
            Paragraph(
                "<b>Bachelor of Informatics Engineering</b>", styles["Body"]
            ),
            Paragraph("Syrian Virtual University (SVU) · Start Year: 2025", styles["Meta"]),
            Spacer(1, 10),
        ]
    )

    programming_langs = [
        "Python",
        "JavaScript",
        "C++",
        "C#",
        "PHP",
        "SQL",
    ]
    web_techs = ["HTML", "CSS"]

    elements.append(Paragraph("Technical Skills", styles["SectionHeader"]))
    elements.append(Paragraph("<b>Programming Languages</b>", styles["Body"]))
    elements.append(
        Paragraph(", ".join(programming_langs), styles["Meta"])
    )
    elements.append(Spacer(1, 4))
    elements.append(Paragraph("<b>Web Technologies</b>", styles["Body"]))
    elements.append(
        Paragraph(", ".join(web_techs), styles["Meta"])
    )
    elements.append(Spacer(1, 10))

    experience_points = [
        "Developed small- to medium-scale applications using multiple programming languages.",
        "Built and designed basic web pages using HTML & CSS.",
        "Worked on database integration using SQL.",
        "Solved different programming challenges and improved existing code.",
        "Collaborated with clients on small freelance projects.",
        "Continued learning and improving through self-study and practice.",
    ]
    experience_list = ListFlowable(
        [ListItem(Paragraph(item, styles["Body"]), leftIndent=10) for item in experience_points],
        bulletType="bullet",
        start="•",
    )

    elements.extend(
        [
            Paragraph("Work Experience (6 Years)", styles["SectionHeader"]),
            Paragraph("<b>Freelance Programmer / Developer</b> · 2019 – Present", styles["Body"]),
            Spacer(1, 4),
            experience_list,
            Spacer(1, 10),
        ]
    )

    additional_skills = [
        "Strong understanding of Object-Oriented Programming (OOP)",
        "Good analytical and problem-solving skills",
        "Ability to learn new tools quickly",
        "Basic knowledge of software architecture",
        "Good communication and teamwork abilities",
    ]
    languages = ["Arabic: Native", "English: Good"]
    interests = [
        "Software development",
        "Web development",
        "Learning new technologies",
        "Building personal coding projects",
    ]

    def bullet_section(title, items):
        elements.append(Paragraph(title, styles["SectionHeader"]))
        elements.append(
            ListFlowable(
                [ListItem(Paragraph(it, styles["Body"]), leftIndent=10) for it in items],
                bulletType="bullet",
                start="•",
            )
        )
        elements.append(Spacer(1, 10))

    bullet_section("Additional Skills", additional_skills)
    bullet_section("Languages", languages)
    bullet_section("Interests", interests)

    doc.build(elements)


if __name__ == "__main__":
    build_resume()

