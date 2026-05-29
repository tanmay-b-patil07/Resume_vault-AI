import { useState, useEffect } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { ResumeCanvas } from './ResumeCanvas';
import { Sparkles, ArrowRight, Building, Briefcase, Plus, Loader2, CheckCircle2 } from 'lucide-react';

interface ApplicationDoc {
  _id: string;
  _creationTime: number;
  userId: string;
  company: string;
  jobTitle: string;
  jobDescription: string;
  status: string;
  tailoredResume?: any;
  updatedAt: number;
}

interface DashboardProps {
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
}

export function Dashboard({ selectedAppId, setSelectedAppId }: DashboardProps) {
  const applications = (useQuery(api.applications.list) as ApplicationDoc[]) || [];
  const addApplication = useMutation(api.applications.add);
  const triggerTailor = useAction(api.applications.tailor);

  // States
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newJd, setNewJd] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorError, setTailorError] = useState<string | null>(null);

  // Steps tracking for simulated CrewAI Agent
  const [currentStep, setCurrentStep] = useState(0);

  const selectedApp = applications.find((app) => app._id === selectedAppId);

  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0]._id);
    }
  }, [applications, selectedAppId]);

  // Track status of selected application
  useEffect(() => {
    if (selectedApp) {
      if (selectedApp.status === 'Tailoring') {
        setIsTailoring(true);
        // Progress steps simulation based on state duration
        // We know our Convex action takes 7 seconds in total:
        // - JD Analysis (1.5s) -> Step 1
        // - Experience Alignment (2.5s) -> Step 2
        // - Projects & Skills (2s) -> Step 3
        // - Final Polish (1s) -> Step 4
        setCurrentStep(1);
        const timer1 = setTimeout(() => setCurrentStep(2), 1600);
        const timer2 = setTimeout(() => setCurrentStep(3), 4200);
        const timer3 = setTimeout(() => setCurrentStep(4), 6300);
        
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      } else {
        setIsTailoring(false);
        if (selectedApp.status === 'Applied' && isTailoring) {
          setCurrentStep(5);
        } else {
          setCurrentStep(0);
        }
      }
    }
  }, [selectedApp?.status]);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole || !newJd) return;

    try {
      const id = await addApplication({
        company: newCompany,
        jobTitle: newRole,
        jobDescription: newJd,
      });
      setSelectedAppId(id);
      setNewCompany('');
      setNewRole('');
      setNewJd('');
      setIsCreatingNew(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTailor = async () => {
    if (!selectedAppId) return;
    setTailorError(null);
    setIsTailoring(true);
    setCurrentStep(1);

    try {
      await triggerTailor({ applicationId: selectedAppId as Id<'applications'> });
    } catch (err: any) {
      console.error(err);
      setTailorError(err.message || 'An error occurred during resume tailoring.');
      setIsTailoring(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[calc(100vh-140px)]">
      {/* LEFT PANE: Application & JD Setup (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Selector or Quick Creator Card */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Target Application
            </h2>
            <button
              onClick={() => setIsCreatingNew(!isCreatingNew)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              {isCreatingNew ? 'Select Existing' : 'Create New'}
            </button>
          </div>

          {isCreatingNew ? (
            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Google"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1">
                    Job Title / Role
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Frontend Engineer"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1">
                  Job Description (JD)
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste the raw text of the job description here..."
                  value={newJd}
                  onChange={(e) => setNewJd(e.target.value)}
                  className="w-full p-3 text-sm bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow transition cursor-pointer"
              >
                Create Application Profile
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1">
                  Select Application
                </label>
                {applications.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">No applications yet. Create one first!</p>
                ) : (
                  <select
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {applications.map((app) => (
                      <option key={app._id} value={app._id}>
                        {app.company} — {app.jobTitle}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedApp && (
                <div className="border-t border-slate-100 dark:border-neutral-800 pt-4 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300">
                      Stage: {selectedApp.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Updated: {new Date(selectedApp.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-md">
                    {selectedApp.jobTitle}
                  </h3>
                  <p className="text-sm text-slate-500 mb-3">{selectedApp.company}</p>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-neutral-400 mb-1">
                      Job Description Details
                    </label>
                    <div className="p-3 bg-slate-50 dark:bg-neutral-950 border border-slate-100 dark:border-neutral-800/80 rounded-lg max-h-[160px] overflow-y-auto text-xs text-slate-600 dark:text-neutral-400 whitespace-pre-line leading-relaxed">
                      {selectedApp.jobDescription}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button & CrewAI Steps Log */}
        {selectedApp && (
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm flex-1 flex flex-col justify-between min-h-[250px]">
            <div>
              <h2 className="text-md font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                CrewAI Resume Tailor
              </h2>

              {/* Progress Steps Log */}
              {isTailoring && (
                <div className="space-y-3 mb-6">
                  <StepItem
                    title="Analyzing Job Description & Master Profile"
                    stepNum={1}
                    currentStep={currentStep}
                  />
                  <StepItem
                    title="Tailoring Work Experience Bullets"
                    stepNum={2}
                    currentStep={currentStep}
                  />
                  <StepItem
                    title="Selecting & Customizing Projects & Skills"
                    stepNum={3}
                    currentStep={currentStep}
                  />
                  <StepItem
                    title="Applying Final ATS Formatting & Polish"
                    stepNum={4}
                    currentStep={currentStep}
                  />
                </div>
              )}

              {currentStep === 5 && !isTailoring && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-emerald-800 dark:text-emerald-300 mb-6">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Resume Tailoring Complete!</p>
                    <p className="text-slate-500 dark:text-neutral-400 mt-0.5">
                      Check out the updated document on the right. You can now save or print.
                    </p>
                  </div>
                </div>
              )}

              {tailorError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl text-rose-800 dark:text-rose-300 text-xs mb-6">
                  <p className="font-bold">Tailoring Failed</p>
                  <p className="mt-0.5">{tailorError}</p>
                </div>
              )}

              {!isTailoring && currentStep !== 5 && !tailorError && (
                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  This action starts an asynchronous CrewAI process on the server to analyze the target Job Description and rewrite your master resume content. The engine writes updates back to Convex reactively.
                </p>
              )}
            </div>

            <button
              onClick={handleTailor}
              disabled={isTailoring}
              className="w-full py-3 px-4 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Agents Tailoring Resume...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Tailor My Resume
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* RIGHT PANE: Pristine Printable ATS Resume Doc Canvas (7 cols) */}
      <div className="lg:col-span-7 flex flex-col bg-slate-100 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 overflow-hidden shadow-inner">
        <ResumeCanvas
          resume={selectedApp?.tailoredResume}
          status={selectedApp?.status || 'Discovered'}
        />
      </div>
    </div>
  );
}

interface StepItemProps {
  title: string;
  stepNum: number;
  currentStep: number;
}

function StepItem({ title, stepNum, currentStep }: StepItemProps) {
  const isCompleted = currentStep > stepNum;
  const isActive = currentStep === stepNum;

  return (
    <div className="flex items-center gap-3 text-xs leading-none">
      <div className="shrink-0">
        {isCompleted ? (
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/55 text-emerald-600 flex items-center justify-center font-bold">
            ✓
          </div>
        ) : isActive ? (
          <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400 flex items-center justify-center font-semibold">
            {stepNum}
          </div>
        )}
      </div>
      <span
        className={`font-medium ${
          isCompleted
            ? 'text-slate-500 line-through dark:text-neutral-500'
            : isActive
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-400 dark:text-neutral-600'
        }`}
      >
        {title}
      </span>
    </div>
  );
}
