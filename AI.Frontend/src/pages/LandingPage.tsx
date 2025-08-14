import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Logo from '@/assets/logo.svg?react'
import { useAuth } from '@/context'
import { Checkbox } from '@/components/ui/checkbox'
import { useDeleteGuestSessionOnExit } from '@/hooks/useDeleteGuestSession';
import { useStorePreviousLocation } from '@/hooks/useStorePreviousLocation';
import ReactMarkdown from "react-markdown";

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
import ProjectShowcase from '@/components/landing-page/ProjectShowcaseSection'
import { ThemeToggle } from '@/components/shared/ThemeToggleButton'

const LandingPage: React.FC = () => {
  useDeleteGuestSessionOnExit()
  useStorePreviousLocation()

  const { startGuestSession } = useAuth()
  const [contentPrivacy, setContentPrivacy] = useState("");
  const [contentTerms, setContentTerms] = useState("");

  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const [privacyCheckboxEnabled, setPrivacyCheckboxEnabled] = useState(false)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [termsCheckboxEnabled, setTermsCheckboxEnabled] = useState(false)
  const [termsChecked, setTermsChecked] = useState(false)

  const privacyContentRef = useRef<HTMLDivElement>(null)
  const termsContentRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    fetch("/legal/privacy-policy.md")
      .then((res) => res.text())
      .then(setContentPrivacy);
    fetch("/legal/terms-and-conditions.md")
      .then((res) => res.text())
      .then(setContentTerms);
  }, []);

  useEffect(() => {
    const agreed = sessionStorage.getItem('agreedToPolicies');
    if (!agreed) {
      setShowPrivacy(true);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const cards = [...cardRefs.current];

    cards.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      cards.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);


  const handlePrivacyAgree = () => {
    setShowPrivacy(false)
    setShowTerms(true)
  }

  const handleTermsAgree = () => {
    sessionStorage.setItem('agreedToPolicies', 'true')
    setShowTerms(false)
  }

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const el = ref.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setEnabled(true)
    }
  }

  const addToCardRefs = (el: HTMLDivElement | null, index: number) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current[index] = el;
    }
  }

  const frontendTech = [
    {
      name: 'React + Vite',
      logo: <ReactLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Frontend library for building UI components with Vite for fast development',
      link: 'https://react.dev/learn/build-a-react-app-from-scratch',
    },
    {
      name: 'TypeScript',
      logo: <TypeScriptLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Strongly typed JavaScript superset for enhanced code quality',
      link: 'https://www.typescriptlang.org/',
    },
    {
      name: 'ShadcnUI',
      logo: <ShadcnLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Beautifully designed UI components library',
      link: 'http://ui.shadcn.com/docs',
    },
    {
      name: 'TailwindCSS',
      logo: <TailwindLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Utility-first CSS framework for rapid UI development',
      link: 'https://tailwindcss.com/',
    }
  ];

  const backendTech = [
    {
      name: '.NET 9',
      logo: <DotNetLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'High-performance backend framework for building RESTful APIs',
      link: 'https://dotnet.microsoft.com/en-us/',
    },
    {
      name: 'C#',
      logo: <CSharpLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Modern object-oriented programming language for backend services',
      link: 'https://learn.microsoft.com/en-us/dotnet/csharp/',
    },
    {
      name: 'PostgreSQL',
      logo: <PostgreSQLLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Relational database for persistent data storage',
      link: 'https://www.postgresql.org/',
    },
    {
      name: 'Entity Framework',
      logo: <DotNetLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'ORM for database operations and migrations',
      link: 'https://learn.microsoft.com/en-us/ef/',
    }
  ];

  const infrastructureTech = [
    {
      name: 'Docker',
      logo: <DockerLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Containerization for consistent development environments',
      link: 'https://www.docker.com/',
    },
    {
      name: 'GitHub Actions',
      logo: <GitHubLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'CI/CD automation for testing and deployment',
      link: 'https://github.com/features/actions',
    },
    {
      name: 'JWT Auth',
      logo: <JWTLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'Secure token-based authentication for API endpoints',
      link: 'https://jwt.io/',
    },
    {
      name: 'Swagger',
      logo: <SwaggerLogo className="h-12 w-12 dark:filter dark:invert" />,
      description: 'API documentation and testing interface',
      link: 'https://swagger.io/',
    }
  ];

  const techList = [
    {
      name: 'Tanstack Router',
      link: 'https://tanstack.com/router/latest/docs/framework/react/overview',
    },
    {
      name: 'React Router',
      link: 'https://reactrouter.com/en/main',
    },
    {
      name: 'OpenAPI-TypeScript',
      link: 'https://learn.openapis.org/',
    },
    {
      name: 'React Markdown',
      link: 'https://github.com/remarkjs/react-markdown',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/',
    },
    {
      name: 'HTML/CSS',
      link: 'https://developer.mozilla.org/en-US/docs/Web',
    },
  ];

  const half = Math.ceil(techList.length / 2);
  const firstRow = techList.slice(0, half);
  const secondRow = techList.slice(half);


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Dialog open={showPrivacy} onOpenChange={() => { }}>
        <DialogContent className="max-w-lg" hidden>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div
            ref={privacyContentRef}
            onScroll={() => handleScroll(privacyContentRef, setPrivacyCheckboxEnabled)}
            className="space-y-4 max-h-80 overflow-y-auto text-sm text-muted-foreground p-1 dark:text-gray-300"
          >
            <ReactMarkdown>{contentPrivacy}</ReactMarkdown>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="privacy-agree"
              checked={privacyChecked}
              disabled={!privacyCheckboxEnabled}
              onCheckedChange={(val) => setPrivacyChecked(Boolean(val))}
            />
            <label
              htmlFor="privacy-agree"
              className="text-sm text-muted-foreground dark:text-gray-300"
            >
              I have read and agree to the Privacy Policy
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handlePrivacyAgree} disabled={!privacyChecked}>I Agree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTerms} onOpenChange={() => { }}>
        <DialogContent className="max-w-lg" hidden>
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div
            ref={termsContentRef}
            onScroll={() => handleScroll(termsContentRef, setTermsCheckboxEnabled)}
            className="space-y-4 max-h-80 overflow-y-auto text-sm text-muted-foreground p-1 dark:text-gray-300"
          >
            <ReactMarkdown>{contentTerms}</ReactMarkdown>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              id="terms-agree"
              checked={termsChecked}
              disabled={!termsCheckboxEnabled}
              onCheckedChange={(val) => setTermsChecked(Boolean(val))}
            />
            <label
              htmlFor="terms-agree"
              className="text-sm text-muted-foreground dark:text-gray-300"
            >
              I have read and agree to the Terms & Conditions
            </label>
          </div>
          <DialogFooter>
            <Button onClick={handleTermsAgree} disabled={!termsChecked}>I Agree</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Animated Hero Section */}
      <header className="py-6 px-4 sm:px-6 bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-2 animate-fade-right">
            <Logo className="h-10 w-10 text-primary dark:text-purple-400" />
            <span className="hidden sm:inline text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-300">
              Full-Stack AI Demo
            </span>
          </div>

          <div className="flex space-x-2 animate-fade-left">
            <Button variant="outline" asChild className="hover:scale-105 transition-transform dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="hover:scale-105 transition-transform dark:bg-purple-600 dark:hover:bg-purple-700">
              <Link to="/register">Register</Link>
            </Button>
            <ThemeToggle/>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 text-center">
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-up dark:text-white">
              <span className="block mb-2">Full-Stack AI Assistant</span>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-purple-300">
                Tech Stack Showcase
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-up animate-delay-100 dark:text-gray-300">
              This demo project highlights my expertise in modern full-stack development,
              featuring AI integration with Gemini API and a comprehensive tech ecosystem
            </p>

            <div className="flex justify-center gap-6 animate-fade-up animate-delay-200">
              <button
                onClick={() => {
                  const section = document.getElementById('tech-stack');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    section.focus({ preventScroll: true });
                  }
                }}
                className="px-8 py-3 border-2 border-primary text-primary rounded-md font-semibold hover:bg-primary hover:text-white transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/40 animate-pulse dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-600 dark:hover:text-white dark:focus:ring-purple-400/40"
              >
                Explore Tech Stack
              </button>

              <a
                href="https://github.com/markestella"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-gray-600 text-gray-700 rounded-md font-semibold hover:bg-gray-700 hover:text-white transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-400 animate-pulse flex items-center justify-center dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                View GitHub Repo
              </a>
            </div>

          </div>
        </section>

        <section id='tech-stack' className="py-16 bg-gray-50 dark:bg-gray-900/50" tabIndex={-1}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-up dark:text-white">
              <span className="border-b-4 border-primary pb-2 dark:border-purple-400">Technology Stack</span>
            </h2>

            <a
              href="https://ai.google.dev/gemini-api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-20 max-w-4xl mx-auto animate-fade-up"
              aria-label="Go to Gemini Free Tier Documentation"
            >
              <div
                className="
                  p-6 bg-white rounded-2xl shadow-lg border border-gray-200 
                  flex flex-col md:flex-row items-center gap-6 
                  transition-transform transition-shadow duration-300
                  hover:shadow-[0_10px_15px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.1)]
                  hover:-translate-y-1 cursor-pointer
                  dark:bg-gray-800 dark:border-gray-700
                "
              >
                <div className="bg-gray-100 p-4 rounded-full mx-auto md:mx-0 dark:bg-gray-700">
                  <GeminiLogo className="h-16 w-16 dark:filter dark:invert" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">AI Integration</h3>
                  <p className="text-muted-foreground dark:text-gray-300">
                    Powered by the Gemini API free tier for natural language processing and intelligent conversations.
                    This AI assistant demonstrates seamless API integration within a full-stack architecture for demo purposes.
                  </p>
                </div>
              </div>
            </a>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center text-primary animate-fade-up dark:text-purple-400">Frontend</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {frontendTech.map((tech, index) => {
                    const cardContent = (
                      <Card
                        key={tech.name}
                        ref={el => addToCardRefs(el, index)}
                        className="transition-shadow transition-transform duration-300 hover:shadow-[0_10px_15px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.1)] hover:-translate-y-1 opacity-0 flex flex-col items-center text-center px-6 py-4 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                      >
                        <CardHeader className="flex flex-col items-center space-y-2 w-full">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="flex-shrink-0">{tech.logo}</div>
                            <CardTitle className="dark:text-white">{tech.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed dark:text-gray-300">{tech.description}</CardDescription>
                        </CardContent>
                      </Card>
                    );

                    return tech.link ? (
                      <a
                        key={tech.name}
                        href={tech.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        aria-label={`Open ${tech.name} official website`}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center text-purple-600 animate-fade-up dark:text-purple-400">Backend</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {backendTech.map((tech, index) => {
                    const cardContent = (
                      <Card
                        key={tech.name}
                        ref={el => addToCardRefs(el, frontendTech.length + index)}
                        className="transition-shadow transition-transform duration-300 hover:shadow-[0_10px_15px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.1)] hover:-translate-y-1 opacity-0 flex flex-col items-center text-center px-6 py-4 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                      >
                        <CardHeader className="flex flex-col items-center space-y-2 w-full">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="flex-shrink-0">{tech.logo}</div>
                            <CardTitle className="dark:text-white">{tech.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed dark:text-gray-300">{tech.description}</CardDescription>
                        </CardContent>
                      </Card>
                    );

                    return tech.link ? (
                      <a
                        key={tech.name}
                        href={tech.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        aria-label={`Open ${tech.name} official website`}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center text-cyan-600 animate-fade-up dark:text-cyan-400">Infrastructure</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1">
                  {infrastructureTech.map((tech, index) => {
                    const cardContent = (
                      <Card
                        key={tech.name}
                        ref={el => addToCardRefs(el, frontendTech.length + backendTech.length + index)}
                        className="transition-shadow transition-transform duration-300 hover:shadow-[0_10px_15px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.1)] hover:-translate-y-1 opacity-0 flex flex-col items-center text-center px-6 py-4 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                      >
                        <CardHeader className="flex flex-col items-center space-y-2 w-full">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="flex-shrink-0">{tech.logo}</div>
                            <CardTitle className="dark:text-white">{tech.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed dark:text-gray-300">{tech.description}</CardDescription>
                        </CardContent>
                      </Card>
                    );

                    return tech.link ? (
                      <a
                        key={tech.name}
                        href={tech.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                        aria-label={`Open ${tech.name} official website`}
                      >
                        {cardContent}
                      </a>
                    ) : (
                      cardContent
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto animate-fade-up">
              <h3 className="text-2xl font-bold text-center mb-8 dark:text-white">Additional Technologies</h3>

              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {firstRow.map(({ name, link }) => (
                  <a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm 
                      hover:shadow-[0_8px_15px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] 
                      transition-shadow duration-300 transform hover:-translate-y-1
                      cursor-pointer
                      select-none
                      font-medium
                      text-gray-800
                      whitespace-nowrap
                      text-center
                      flex-shrink-0
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200
                    "
                  >
                    {name}
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {secondRow.map(({ name, link }) => (
                  <a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm 
                      hover:shadow-[0_8px_15px_rgba(0,0,0,0.15),0_4px_6px_rgba(0,0,0,0.1)] 
                      transition-shadow duration-300 transform hover:-translate-y-1
                      cursor-pointer
                      select-none
                      font-medium
                      text-gray-800
                      whitespace-nowrap
                      text-center
                      flex-shrink-0
                      dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200
                    "
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ProjectShowcase startGuestSession={startGuestSession} />
      </main>

      <footer className="py-6 border-t bg-white dark:bg-gray-900 dark:border-gray-800">
        <div className="container text-center text-sm text-muted-foreground dark:text-gray-400">
          <p>© {new Date().getFullYear()} Full-Stack AI Demo. Portfolio project showcasing full-stack development skills.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage