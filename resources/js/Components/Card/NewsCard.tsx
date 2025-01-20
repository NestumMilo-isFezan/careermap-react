interface News {
    id: number;
    title: string;
    description: string;
    image: string;
    created_at: string;
}

interface NewsCardProps {
    news: News;
    children: React.ReactNode;
}

export default function NewsCard({ news, children }: NewsCardProps) {
    const truncatedDescription = news.description.substring(0, 100) + '...';

    return (
        <div className="bg-white border border-emerald-500 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {news.image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover transition duration-300 ease-in-out hover:scale-105"
                    />
                </div>
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-emerald-800 mb-2 line-clamp-1">
                    {news.title}
                </h3>
                <p className="text-emerald-600 text-sm mb-4 line-clamp-2">
                    {truncatedDescription}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-500 px-4 py-1 bg-amber-50 border border-amber-500 rounded-full">
                        {news.created_at}
                    </span>
                    <div className="flex items-center gap-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
