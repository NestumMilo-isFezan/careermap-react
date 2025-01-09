import { FC } from 'react';
import {
    TreePine,
    Building2,
    Music,
    BookOpen,
    LineChart,
    Computer,
    Cog,
    Flame,
    BarChart,
    Brain,
    Hospital,
    Utensils,
    FlaskConical,
    Users,
    GraduationCap
} from 'lucide-react';

interface RoadmapIconProps {
    domain: string;
    className?: string;
}

const RoadmapIcon: FC<RoadmapIconProps> = ({ domain, className }) => {
    const defaultIcons = [
        TreePine,           // 0 - Nature related (Agriculture, Forestry)
        Building2,      // 1 - Business related
        Music,          // 2 - Arts & Entertainment
        BookOpen,       // 3 - Islamic Studies
        LineChart,      // 4 - Finance & Marketing
        Computer,       // 5 - Computer Sciences
        Cog,           // 6 - Engineering
        Flame,         // 7 - Oil & Gas
        BarChart,      // 8 - Economics
        Brain,         // 9 - Psychology (using Brain from Lucide)
        Hospital,      // 10 - Health & Nursing
        Utensils,      // 11 - Food Science
        FlaskConical,         // 12 - Nature Science
        Users,         // 13 - Social Science
        GraduationCap  // 14 - Education
    ];

    const domains: { [key: string]: number } = {
        'Arts & Entertainment': 2,
        'Islamic Studies': 3,
        'International Finance & Marketing': 4,
        'Computer Sciences': 5,
        'Engineering': 6,
        'Oil & Gas': 7,
        'Economics': 8,
        'Psychology': 9,
        'Agriculture': 0,
        'Education': 14,
        'Health & Nursing': 10,
        'Forestry Science': 0,
        'Food Science': 11,
        'Nature Science': 12,
        'Social Science': 13
    };

    const IconComponent = defaultIcons[domains[domain] ?? 0];

    return <IconComponent className={className} />;
};

export default RoadmapIcon;
