import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, GraduationCap } from "lucide-react";
import campusBg from "@/assets/sliit-campus.jpg";
import sliitLogo from "@/assets/sliit-logo.png";

interface ChatMessage {
  role: "student" | "ai";
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "ai",
  content:
    "👋 Welcome to the SLIIT AI Academic & Elective Advisor for year 4 semester 1! Fill in your academic profile above and click **Get Recommendation** to receive personalized elective and academic guidance.",
  timestamp: new Date(),
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Form state
  const [gpa, setGpa] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [credits, setCredits] = useState("");
  const [gradePoints, setGradePoints] = useState("");
  const [faculty, setFaculty] = useState("");
  const [strongSubjects, setStrongSubjects] = useState("");
  const [weakSubjects, setWeakSubjects] = useState("");
  const [careerInterest, setCareerInterest] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gpa || !faculty || !strongSubjects || !weakSubjects || !careerInterest || !difficulty || !specialization || !credits || !gradePoints || !language) {
      return;
    }

    const profileSummary = `📋 **My Profile:**\n- Specialization: ${specialization}\n- Cumulative GPA: ${gpa}\n- Cumulative Credits: ${credits}\n- Cumulative Grade Points: ${gradePoints}\n- Faculty: ${faculty}\n- Strong Subjects: ${strongSubjects}\n- Weak Subjects: ${weakSubjects}\n- Career Interest: ${careerInterest}\n- Preferred Difficulty: ${difficulty}\n- Preferred Language: ${language}`;

    const studentMsg: ChatMessage = {
      role: "student",
      content: profileSummary,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setLoading(true);

    const payload = {
      gpa: parseFloat(gpa),
      faculty,
      strong: strongSubjects,
      weak: weakSubjects,
      career: careerInterest,
      specialization,
      credits,
      gradePoints,
      language
    };

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.answer || "No recommendation received.", timestamp: new Date() },
      ]);
    } catch {
      // Mock response when API is unavailable
      const mock = `Based on your profile, here are my recommendations:\n\n**Recommended Electives:**\n- Machine Learning Fundamentals\n- Data Visualization & Analytics\n- Cloud Computing Essentials\n\n**Study Tips:**\n- Focus on strengthening ${weakSubjects} with online resources\n- Leverage your strengths in ${strongSubjects} for project work\n\n**Career Path:** Your interest in ${careerInterest} aligns well with your profile. Consider joining related student clubs and pursuing certifications.\n\n> *This is a mock response. Connect the backend API for real recommendations.*`;

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: mock, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*)/gm, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul class='list-disc pl-4 space-y-1'>$1</ul>")
      .replace(/^> (.*)/gm, "<blockquote class='border-l-2 border-navy-light pl-3 italic opacity-80'>$1</blockquote>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${campusBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-foreground/60" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center gap-3 px-4 sm:px-8 py-3 bg-white/10 backdrop-blur-md border-b border-white/20">
        <img src={sliitLogo} alt="SLIIT Logo" className="h-10 w-10 object-contain rounded" />
        <h1 className="text-primary-foreground font-bold text-base sm:text-lg tracking-tight">
          SLIIT AI Academic & Elective Advisor for year 4 semester 1
        </h1>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-start justify-center p-3 sm:p-6 overflow-auto">
        <div className="w-full max-w-6xl bg-white/15 backdrop-blur-xl rounded-2xl border border-white/25 shadow-2xl flex flex-col lg:flex-row max-h-[calc(100vh-120px)] overflow-hidden">
          {/* Form section */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/20 lg:w-[400px] flex-shrink-0 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
              <h2 className="text-primary-foreground font-semibold text-sm sm:text-base">Student Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Specialization</Label>
                <Select value={specialization} onValueChange={setSpecialization} required>
                  <SelectTrigger className="bg-white/20 border-white/30 text-primary-foreground h-9 text-sm">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="IT">Information Technology (IT)</SelectItem>
                    <SelectItem value="SE">Software Engineering (SE)</SelectItem>
                    <SelectItem value="DS">Data Science (DS)</SelectItem>
                    <SelectItem value="ISE">Information Systems Engineering (ISE)</SelectItem>
                    <SelectItem value="CS">Cyber Security (CS)</SelectItem>
                    <SelectItem value="IM">Interactive Media (IM)</SelectItem>
                    <SelectItem value="CSNE">Computer Systems & Network Engineering (CSNE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Cumulative GPA</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  placeholder="e.g. 3.77"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Cumulative Credits</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 84"
                  value={credits}
                  onChange={(e) => setCredits(e.target.value)}
                  className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Cumulative Grade Points</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 316.4"
                  value={gradePoints}
                  onChange={(e) => setGradePoints(e.target.value)}
                  className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Faculty</Label>
                <Select value={faculty} onValueChange={setFaculty} required>
                  <SelectTrigger className="bg-white/20 border-white/30 text-primary-foreground h-9 text-sm">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Faculty of Computing">Faculty of Computing</SelectItem>
                    <SelectItem value="Faculty of Engineering">Faculty of Engineering</SelectItem>
                    <SelectItem value="Faculty of Business">Faculty of Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Career Interest</Label>
                <Select value={careerInterest} onValueChange={setCareerInterest} required>
                  <SelectTrigger className="bg-white/20 border-white/30 text-primary-foreground h-9 text-sm">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="General IT">General IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Strong Subjects</Label>
                <Input
                  placeholder="e.g. Math, OOP"
                  value={strongSubjects}
                  onChange={(e) => setStrongSubjects(e.target.value)}
                  className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Weak Subjects</Label>
                <Input
                  placeholder="e.g. Statistics"
                  value={weakSubjects}
                  onChange={(e) => setWeakSubjects(e.target.value)}
                  className="bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Preferred Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty} required>
                  <SelectTrigger className="bg-white/20 border-white/30 text-primary-foreground h-9 text-sm">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Preferred Output Language</Label>
                <Select value={language} onValueChange={setLanguage} required>
                  <SelectTrigger className="bg-white/20 border-white/30 text-primary-foreground h-9 text-sm">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Sinhala">Sinhala</SelectItem>
                    <SelectItem value="Tamil">Tamil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-4 w-full sm:w-auto bg-navy hover:bg-navy-light text-navy-foreground font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Get Recommendation
                </>
              )}
            </Button>
          </form>

          {/* Chat section */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md ${msg.role === "student"
                    ? "bg-navy text-navy-foreground rounded-br-md"
                    : "bg-white/80 backdrop-blur-sm text-foreground border border-white/30 rounded-bl-md"
                    }`}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    className="leading-relaxed [&_ul]:mt-1 [&_li]:ml-2"
                  />
                  <p
                    className={`text-[10px] mt-2 ${msg.role === "student" ? "text-navy-foreground/60" : "text-muted-foreground"
                      }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 border border-white/30 shadow-md">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-3 text-primary-foreground/50 text-xs">
        Powered by Generative AI | SLIIT Academic Prototype
      </footer>
    </div>
  );
};

export default Index;
