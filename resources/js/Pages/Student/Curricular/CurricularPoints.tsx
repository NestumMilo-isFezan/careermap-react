interface SkillPoints {
    value: Array<{
        name: string;
        description: string;
        points: number;
    }>
}

export default function CurricularPoints({ skillPoints }: { skillPoints: SkillPoints }) {
    // This would normally come from props, using mock data for example

    return (
        <div className="bg-emerald-100 rounded-lg p-6 border border-emerald-500">
            <div className="flex gap-6">
                {/* Left side with title and image */}
                <div className="w-1/3 flex flex-col">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-700">Your Soft Skills</h2>
                    <div className="flex justify-center h-full">
                        {/* Placeholder image - replace with your actual image */}
                        <img src="/assets/soft-skills-guy.png" alt="Soft Skills" className="h-full" />
                    </div>
                </div>

                {/* Right side with scrollable skills */}
                <div className="w-2/3 flex flex-col">
                    <div className="bg-yellow-50/50 rounded-lg border border-emerald-500 p-4">
                        <div className="overflow-y-auto max-h-[calc(100vh-16rem)] space-y-4 pr-2">
                            {skillPoints.value.map((skill, index) => (
                                <div
                                    key={index}
                                    className="bg-emerald-100 rounded-lg p-4 relative overflow-hidden border border-emerald-500"
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-xl font-semibold">{skill.name}</h3>
                                        <span className="text-xl font-bold">{skill.points}</span>
                                    </div>
                                    <p className="text-gray-600">{skill.description}</p>

                                    {/* Colored bar on the left */}
                                    <div
                                        className={`absolute left-0 top-0 h-full w-2
                                            ${index === 0 ? 'bg-green-500' :
                                            index === 1 ? 'bg-orange-500' :
                                            index === 2 ? 'bg-teal-500' :
                                            index === 3 ? 'bg-red-500' :
                                            index === 4 ? 'bg-blue-500' :
                                            index === 5 ? 'bg-purple-500' :
                                            index === 6 ? 'bg-pink-500' :
                                            'bg-gray-500'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
