interface Props {
    recommendationPercentage: number;
}

export default function RecommendationBadge({ recommendationPercentage }: Props) {
    if (!recommendationPercentage) {
        return (
            <span className="text-xs text-neutral-500 rounded-full px-4 py-1 bg-neutral-500/50 border border-neutral-500">
                No recommendation
            </span>
        );
    }

    if (recommendationPercentage <= 40) {
        return (
            <span className="text-xs text-red-900 rounded-full px-4 py-1 bg-red-100 border border-red-500 group-hover:bg-red-500 group-hover:text-red-50 transition-all duration-300 ease-in-out">
                Not Recommended : {recommendationPercentage}%
            </span>
        );
    }

    if (recommendationPercentage <= 60) {
        return (
            <span className="text-xs text-yellow-900 rounded-full px-4 py-1 bg-yellow-100 border border-yellow-500 group-hover:bg-yellow-200 group-hover:text-amber-900 transition-all duration-300 ease-in-out">
                Suggested : {recommendationPercentage}%
            </span>
        );
    }

    return (
        <span className="text-xs text-green-900 rounded-full px-4 py-1 bg-green-100 border border-green-500 group-hover:bg-green-500 group-hover:text-green-50 transition-all duration-300 ease-in-out">
            Recommended : {recommendationPercentage}%
        </span>
    );
}
