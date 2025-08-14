import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/ThemeToggleButton";
import { useStorePreviousLocation } from "@/hooks/useStorePreviousLocation";

export default function PrivacyPolicy() {
  useStorePreviousLocation()
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/legal/privacy-policy.md")
      .then((res) => res.text())
      .then(setContent);
  }, []);

  return (
    <div className="container mx-auto mt-12 p-6">
      <Card className="relative max-w-5xl mx-auto shadow-lg">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <CardContent className="prose dark:prose-invert max-w-none p-8 mt-4">
          <ReactMarkdown>{content}</ReactMarkdown>
        </CardContent>
      </Card>
    </div>
  );
}