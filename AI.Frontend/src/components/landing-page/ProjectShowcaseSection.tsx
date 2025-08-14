import { useEffect, useRef, useState } from 'react';
import ReactLogo from '@/assets/tech/react.svg?react';
import TypeScriptLogo from '@/assets/tech/typescript.svg?react';
import ShadcnLogo from '@/assets/tech/shadcn.svg?react';
import TailwindLogo from '@/assets/tech/tailwind.svg?react';
import DotNetLogo from '@/assets/tech/dotnet.svg?react';
import CSharpLogo from '@/assets/tech/csharp.svg?react';
import PostgreSQLLogo from '@/assets/tech/postgresql.svg?react';
import DockerLogo from '@/assets/tech/docker.svg?react';
import GitHubLogo from '@/assets/tech/github.svg?react';
import SwaggerLogo from '@/assets/tech/swagger.svg?react';
import JWTLogo from '@/assets/tech/jwt.svg?react';
import GeminiLogo from '@/assets/tech/gemini.svg?react';

interface FeatureCardProps {
    title: string;
    description: string;
}

interface ProjectShowcaseProps {
    startGuestSession: () => void;
}

const FeatureCard = ({ title, description }: FeatureCardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${isHovered
                ? 'bg-gradient-to-br from-purple-600/20 to-primary/30 scale-[1.03] shadow-lg dark:from-purple-600/30 dark:to-primary/40'
                : 'bg-white/90 backdrop-blur-sm shadow-md dark:bg-gray-800/90'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-start">
                <div className={`flex-shrink-0 w-5 h-5 rounded-full mr-4 mt-1 transition-all ${isHovered ? 'bg-purple-500 scale-125' : 'bg-primary'
                    }`}></div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1 dark:text-white">{title}</h3>
                    <p className="text-gray-700 text-sm dark:text-gray-300">{description}</p>
                </div>
            </div>
            {isHovered && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 to-transparent opacity-70"></div>
            )}
        </div>
    );
};

const ProjectShowcase = ({ startGuestSession }: ProjectShowcaseProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1 }
        );

        const sectionEl = sectionRef.current;

        if (sectionEl) {
            observer.observe(sectionEl);
        }

        return () => {
            if (sectionEl) {
                observer.unobserve(sectionEl);
            }
        };
    }, []);


    const features: FeatureCardProps[] = [
        {
            title: "JWT Authentication Flow",
            description: "Secure user authentication with JSON Web Tokens"
        },
        {
            title: "API Integration with Gemini AI",
            description: "Seamless integration with Google's advanced AI"
        },
        {
            title: "Database Management with PostgreSQL",
            description: "Robust data storage and management solution"
        },
        {
            title: "Automated API Documentation",
            description: "Self-generating API docs for developer efficiency"
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-purple-600/5 to-indigo-600/5 dark:from-gray-900/50 dark:via-purple-900/20 dark:to-indigo-900/20"
            id="project-showcase"
        >
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
                <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    } dark:bg-gray-900 dark:border-gray-800`}>
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-primary text-white px-6 py-2 rounded-full mb-6 animate-pulse hover:animate-none transition-all dark:from-purple-700 dark:to-purple-500">
                                <span className="h-2 w-2 rounded-full bg-white mr-2 animate-ping"></span>
                                <span className="text-sm font-semibold">TECH SHOWCASE</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                                Portfolio Project Showcase
                            </h2>

                            <p className="text-lg text-gray-700 max-w-2xl mx-auto dark:text-gray-300">
                                This AI Assistant demo was created to demonstrate full-stack development capabilities using modern technologies.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {[
                                ReactLogo, TypeScriptLogo, ShadcnLogo, TailwindLogo,
                                DotNetLogo, CSharpLogo, PostgreSQLLogo, DockerLogo,
                                GitHubLogo, SwaggerLogo, JWTLogo, GeminiLogo
                            ].map((Logo, index) => (
                                <div
                                    key={index}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <Logo className="w-7 h-7 dark:filter dark:invert" />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <FeatureCard
                                        title={feature.title}
                                        description={feature.description}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="text-center max-w-sm mx-auto px-4">
                            <button
                                onClick={startGuestSession}
                                className="group relative inline-flex items-center justify-center px-6 py-2 font-semibold text-white rounded-full shadow-md overflow-hidden transition hover:shadow-lg"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-primary transition duration-300 ease-out group-hover:from-purple-700 group-hover:to-primary/90 dark:from-purple-700 dark:to-purple-500"></span>
                                <span className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white to-transparent opacity-5"></span>
                                <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>
                                <span className="absolute inset-0 border border-white rounded-full opacity-10"></span>
                                <span className="relative flex items-center space-x-2 text-sm">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse dark:bg-purple-400"></span>
                                    </span>
                                    <span>Experience Demo</span>
                                </span>
                            </button>

                            <p className="mt-3 text-gray-600 text-sm leading-snug dark:text-gray-400">
                                Experience full AI assistant with chat history & multiple chats.
                                Register a demo account, no verification or real data needed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectShowcase;