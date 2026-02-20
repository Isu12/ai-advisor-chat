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
import { Send, Loader2, GraduationCap, AlertCircle } from "lucide-react";
import campusBg from "@/assets/sliit-campus.jpg";
import sliitLogo from "@/assets/sliit-logo.png";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const profileSchema = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  gpa: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 4.0;
  }, { message: "GPA must be between 0 and 4.0" }),
  credits: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num > 0;
  }, { message: "Credits must be a positive number" }),
  gradePoints: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, { message: "Grade points must be a non-negative number" }),
  faculty: z.string().min(1, "Faculty is required"),
  careerInterest: z.string().min(1, "Career interest is required"),
  strongSubjects: z.string().min(1, "Strong subjects are required"),
  weakSubjects: z.string().min(1, "Weak subjects are required"),
  difficulty: z.string().min(1, "Preferred difficulty is required"),
  language: z.string().min(1, "Preferred language is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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

export const renderMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^- (.*)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul class='list-disc pl-4 space-y-1'>$1</ul>")
    .replace(/^> (.*)/gm, "<blockquote class='border-l-2 border-navy-light pl-3 italic opacity-80'>$1</blockquote>")
    .replace(/\n/g, "<br/>");
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      specialization: "",
      gpa: "",
      credits: "",
      gradePoints: "",
      faculty: "",
      careerInterest: "",
      strongSubjects: "",
      weakSubjects: "",
      difficulty: "",
      language: "English",
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const onSubmit = async (values: ProfileFormValues) => {
    const {
      gpa,
      faculty,
      strongSubjects,
      weakSubjects,
      careerInterest,
      specialization,
      credits,
      gradePoints,
      language,
      difficulty,
    } = values;

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
      language,
    };

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.answer || "No recommendation received.",
          timestamp: new Date(),
        },
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

  // Placeholder for where it was

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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-white/20 lg:w-[400px] flex-shrink-0 overflow-y-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
              <h2 className="text-primary-foreground font-semibold text-sm sm:text-base">
                Student Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Specialization
                </Label>
                <Controller
                  name="specialization"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`bg-white/20 border-white/30 text-primary-foreground h-9 text-sm ${errors.specialization ? "border-red-500" : ""
                          }`}
                      >
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="IT">Information Technology (IT)</SelectItem>
                        <SelectItem value="SE">Software Engineering (SE)</SelectItem>
                        <SelectItem value="DS">Data Science (DS)</SelectItem>
                        <SelectItem value="ISE">Information Systems Engineering (ISE)</SelectItem>
                        <SelectItem value="CS">Cyber Security (CS)</SelectItem>
                        <SelectItem value="IM">Interactive Media (IM)</SelectItem>
                        <SelectItem value="CSNE">
                          Computer Systems & Network Engineering (CSNE)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.specialization && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.specialization.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Cumulative GPA
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 3.77"
                  {...register("gpa")}
                  className={`bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm ${errors.gpa ? "border-red-500" : ""
                    }`}
                />
                {errors.gpa && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.gpa.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Cumulative Credits
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 84"
                  {...register("credits")}
                  className={`bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm ${errors.credits ? "border-red-500" : ""
                    }`}
                />
                {errors.credits && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.credits.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Cumulative Grade Points
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 316.4"
                  {...register("gradePoints")}
                  className={`bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm ${errors.gradePoints ? "border-red-500" : ""
                    }`}
                />
                {errors.gradePoints && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.gradePoints.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">Faculty</Label>
                <Controller
                  name="faculty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`bg-white/20 border-white/30 text-primary-foreground h-9 text-sm ${errors.faculty ? "border-red-500" : ""
                          }`}
                      >
                        <SelectValue placeholder="Select faculty" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Faculty of Computing">Faculty of Computing</SelectItem>
                        <SelectItem value="Faculty of Engineering">Faculty of Engineering</SelectItem>
                        <SelectItem value="Faculty of Business">Faculty of Business</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.faculty && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.faculty.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Career Interest
                </Label>
                <Controller
                  name="careerInterest"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`bg-white/20 border-white/30 text-primary-foreground h-9 text-sm ${errors.careerInterest ? "border-red-500" : ""
                          }`}
                      >
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
                  )}
                />
                {errors.careerInterest && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.careerInterest.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Strong Subjects
                </Label>
                <Input
                  placeholder="e.g. Math, OOP"
                  {...register("strongSubjects")}
                  className={`bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm ${errors.strongSubjects ? "border-red-500" : ""
                    }`}
                />
                {errors.strongSubjects && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.strongSubjects.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Weak Subjects
                </Label>
                <Input
                  placeholder="e.g. Statistics"
                  {...register("weakSubjects")}
                  className={`bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/40 h-9 text-sm ${errors.weakSubjects ? "border-red-500" : ""
                    }`}
                />
                {errors.weakSubjects && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.weakSubjects.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Preferred Difficulty
                </Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`bg-white/20 border-white/30 text-primary-foreground h-9 text-sm ${errors.difficulty ? "border-red-500" : ""
                          }`}
                      >
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.difficulty.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-primary-foreground/80 text-xs">
                  Preferred Output Language
                </Label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={`bg-white/20 border-white/30 text-primary-foreground h-9 text-sm ${errors.language ? "border-red-500" : ""
                          }`}
                      >
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Sinhala">Sinhala</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.language && (
                  <p className="text-red-400 text-[10px] mt-0.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.language.message}
                  </p>
                )}
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
