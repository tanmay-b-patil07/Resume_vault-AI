import { Printer, Sparkles } from 'lucide-react';
import { FlashText } from './FlashText';

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  website?: string;
  linkedin?: string;
  location?: string;
}

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  bullets: string[];
}

interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
}

interface SkillItem {
  category: string;
  items: string[];
}

interface TailoredResume {
  personalInfo: PersonalInfo;
  summary: string;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
}

interface ResumeCanvasProps {
  resume?: TailoredResume;
  status: string;
}

export function ResumeCanvas({ resume, status }: ResumeCanvasProps) {
  const handlePrint = () => {
    window.print();
  };

  const isTailoring = status === 'Tailoring';

  if (!resume && !isTailoring) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-slate-300 dark:border-neutral-800 rounded-xl p-8 text-center text-slate-500 dark:text-neutral-400">
        <Sparkles className="w-12 h-12 text-slate-400 dark:text-neutral-500 mb-4 animate-pulse" />
        <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-neutral-300">No Tailored Resume Yet</h3>
        <p className="text-sm max-w-md">
          Select or create an application in the left pane, paste the job description, and click "Tailor My Resume" to generate your optimized resume.
        </p>
      </div>
    );
  }

  // Skeleton / partial data representation during tailoring
  const displayResume = resume || {
    personalInfo: {
      name: 'Analyzing Profile...',
      email: 'Please wait...',
      phone: '',
    },
    summary: 'The CrewAI agent is currently aligning your skills and experience with the pasted Job Description. Watch as sections compile in real-time...',
    experiences: [],
    projects: [],
    skills: [],
  };

  return (
    <div className="flex flex-col h-full">
      {/* Action Controls - Hidden during Printing */}
      <div className="flex items-center justify-between mb-4 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-semibold text-slate-600 dark:text-neutral-300 uppercase tracking-wider">
            {status === 'Tailoring' ? (
              <span className="text-amber-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-spin" /> Tailoring in Progress...
              </span>
            ) : (
              'Live ATS Preview'
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            disabled={isTailoring && !resume}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 rounded-md shadow transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Sheet Wrapper */}
      <div className="flex-1 overflow-y-auto max-h-[85vh] pr-1 pb-6 print:overflow-visible print:max-h-none print:pr-0">
        <div
          id="printable-resume-card"
          className="shadow-xl dark:shadow-2xl border border-slate-200 dark:border-neutral-800 bg-white text-slate-900 mx-auto w-full max-w-[820px] min-h-[1050px] p-12 font-serif leading-relaxed relative print:shadow-none print:border-none print:p-0 print:m-0 print:text-black print:bg-white select-text"
        >
          {/* Header Section */}
          <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 uppercase print:text-black">
              <FlashText value={displayResume.personalInfo.name}>
                {displayResume.personalInfo.name}
              </FlashText>
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs text-slate-600 mt-2 font-sans print:text-neutral-600">
              <FlashText value={displayResume.personalInfo.email}>
                {displayResume.personalInfo.email}
              </FlashText>
              {displayResume.personalInfo.phone && (
                <>
                  <span>•</span>
                  <FlashText value={displayResume.personalInfo.phone}>
                    {displayResume.personalInfo.phone}
                  </FlashText>
                </>
              )}
              {displayResume.personalInfo.location && (
                <>
                  <span>•</span>
                  <FlashText value={displayResume.personalInfo.location}>
                    {displayResume.personalInfo.location}
                  </FlashText>
                </>
              )}
              {displayResume.personalInfo.website && (
                <>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">{displayResume.personalInfo.website}</span>
                </>
              )}
              {displayResume.personalInfo.linkedin && (
                <>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">{displayResume.personalInfo.linkedin}</span>
                </>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {displayResume.summary && (
            <div className="mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-2 font-sans print:text-black print:border-neutral-300">
                Professional Summary
              </h2>
              <p className="text-sm text-slate-800 text-justify leading-relaxed print:text-neutral-900">
                <FlashText value={displayResume.summary}>
                  {displayResume.summary}
                </FlashText>
              </p>
            </div>
          )}

          {/* Work Experience */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-3 font-sans print:text-black print:border-neutral-300">
              Work Experience
            </h2>
            {isTailoring && displayResume.experiences.length === 0 && (
              <div className="animate-pulse space-y-4 my-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              </div>
            )}
            <div className="space-y-4">
              {displayResume.experiences.map((exp, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-baseline font-sans">
                    <span className="font-bold text-slate-950 print:text-black">
                      {exp.company}
                    </span>
                    <span className="text-xs text-slate-600 print:text-neutral-600">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="italic text-slate-700 font-sans text-xs mb-1 print:text-neutral-700">
                    {exp.role}
                  </div>
                  <ul className="list-disc pl-5 text-slate-800 space-y-1 text-justify">
                    {exp.bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="leading-relaxed">
                        <FlashText value={bullet}>
                          {bullet}
                        </FlashText>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          {displayResume.projects && (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-3 font-sans print:text-black print:border-neutral-300">
                Projects
              </h2>
              {isTailoring && displayResume.projects.length === 0 && (
                <div className="animate-pulse space-y-3 my-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                </div>
              )}
              <div className="space-y-3">
                {displayResume.projects.map((proj, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between items-baseline font-sans">
                      <span className="font-bold text-slate-950 print:text-black">
                        {proj.name}
                      </span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="text-xs italic text-slate-600 print:text-neutral-600">
                          {proj.technologies.join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-800 mt-1 leading-relaxed text-justify">
                      <FlashText value={proj.description}>
                        {proj.description}
                      </FlashText>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Skills */}
          {displayResume.skills && (
            <div className="mt-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-3 font-sans print:text-black print:border-neutral-300">
                Skills & Technologies
              </h2>
              {isTailoring && displayResume.skills.length === 0 && (
                <div className="animate-pulse space-y-2 my-2">
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              )}
              <div className="space-y-1 text-sm text-slate-800">
                {displayResume.skills.map((skill, index) => (
                  <div key={index} className="flex leading-relaxed">
                    <span className="font-semibold text-slate-950 font-sans mr-2 min-w-[150px] print:text-black">
                      {skill.category}:
                    </span>
                    <span className="flex-1 text-justify">
                      <FlashText value={skill.items.join(', ')}>
                        {skill.items.join(', ')}
                      </FlashText>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
