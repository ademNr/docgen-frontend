import React, { JSX } from 'react';
import {
    SiNextdotjs, SiReact, SiTypescript, SiRedux,
    SiTailwindcss, SiAxios, SiJavascript, SiNodedotjs,
    SiExpress, SiMongodb, SiMongoose, SiPuppeteer,
    SiCora, SiDotenv
} from 'react-icons/si';
import { TechStackItem } from '../../types/documentation';

interface TechStackIconsProps {
    techStack: TechStackItem[];
}

const TechStackIcons: React.FC<TechStackIconsProps> = ({ techStack }) => {
    const getIcon = (name: string) => {
        const iconMap: Record<string, JSX.Element> = {
            'next.js': <SiNextdotjs className="text-black" />,
            'nextjs': <SiNextdotjs className="text-black" />,
            'react': <SiReact className="text-blue-500" />,
            'typescript': <SiTypescript className="text-blue-600" />,
            'redux': <SiRedux className="text-purple-500" />,
            'tailwindcss': <SiTailwindcss className="text-cyan-500" />,
            'axios': <SiAxios className="text-purple-600" />,
            'javascript': <SiJavascript className="text-yellow-400" />,
            'node.js': <SiNodedotjs className="text-green-600" />,
            'express': <SiExpress className="text-gray-800" />,
            'mongodb': <SiMongodb className="text-green-500" />,
            'mongoose': <SiMongoose className="text-red-500" />,
            'puppeteer': <SiPuppeteer className="text-green-400" />,
            'cors': <SiCora className="text-blue-400" />,
            'dotenv': <SiDotenv className="text-gray-700" />
        };

        return iconMap[name.toLowerCase()] || <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />;
    };

    return (
        <div className="flex flex-wrap gap-4">
            {techStack.map((tech, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="bg-gray-100 p-3 rounded-lg flex items-center justify-center w-16 h-16">
                        {getIcon(tech.name)}
                    </div>
                    <span className="mt-2 text-sm font-medium">{tech.name}</span>
                </div>
            ))}
        </div>
    );
};

export default TechStackIcons;