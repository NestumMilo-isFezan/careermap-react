import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Auth({ children }: PropsWithChildren) {
    return (
        <div className="font-sans text-gray-900 antialiased bg-yellow-50 md:px-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ">
            <div className="flex fixed inset-0 z-[99] w-screen h-screen bg-white">
                <div className="w-full h-full flex flex-row">
                    <div className="relative top-0 bottom-0 right-0 flex-shrink-0 hidden w-1/3 overflow-hidden bg-cover lg:block">
                        <div className="absolute inset-0 z-20 w-full h-full opacity-70 bg-gradient-to-t from-black"></div>
                        <img src="https://cdn.devdojo.com/images/may2023/pines-bg-1.png" className="z-10 object-cover w-full h-full" />
                    </div>

                    <div className="relative flex flex-wrap justify-center items-center w-full h-full px-5 bg-yellow-50/30 md:px-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                        <div className="relative w-full max-w-md mx-auto lg:mb-0">
                            <div className="group flex rounded-md max-w-md flex-col overflow-hidden border border-green-300 bg-green-50 text-neutral-600">
                                <div className="flex flex-col gap-4 p-6">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
