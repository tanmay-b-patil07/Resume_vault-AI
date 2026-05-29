import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Wand2, 
  Kanban, 
  Plus, 
  Building2, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronRight,
  Briefcase,
  Layers,
  Search,
  FileText,
  Download,
  RefreshCw,
  Play,
  Target,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

const initialData = {
  user: {
    name: "Alex Doe",
    title: "Senior Full Stack Engineer",
    bioVariations: {
      "Original": "Passionate engineer with 10+ years of experience building scalable SaaS applications. Adept at leading cross-functional teams and bridging the gap between complex backend systems and intuitive user interfaces.",
      "Executive Tone": "Strategic technology leader driving product innovation and cross-functional excellence. Proven track record of delivering high-impact SaaS solutions and cultivating high-performance engineering cultures.",
      "Technical Heavy": "Architected and deployed distributed microservices using Node.js, React, and Kubernetes. Spearheaded the migration from monolithic architecture to serverless, improving system scalability by 200%."
    }
  },
  experiences: [
    {
      id: "exp1",
      company: "TechNova Solutions",
      role: "Lead Frontend Engineer",
      dates: "Jan 2021 - Present",
      location: "San Francisco, CA (Remote)",
      projects: [
        {
          id: "p1",
          name: "NextGen Dashboard Architecture",
          bullets: [
            {
              id: "b1",
              selectedVariation: "Original",
              variations: {
                "Original": "Redesigned the main dashboard using React and Tailwind CSS, improving load times by 40%.",
                "ATS-Optimized": "Engineered a high-performance React/Tailwind dashboard, achieving a 40% reduction in LCP and improving core web vitals.",
                "Backend-Heavy": "Integrated complex GraphQL APIs into a React frontend, streamlining data synchronization and reducing payload size."
              }
            },
            {
              id: "b2",
              selectedVariation: "Original",
              variations: {
                "Original": "Led a team of 5 engineers to deliver features on time.",
                "ATS-Optimized": "Directed a cross-functional team of 5 engineers, successfully delivering 100% of quarterly product roadmap milestones.",
                "Backend-Heavy": "Architected the CI/CD pipeline leveraging GitHub Actions to reduce deployment times by 60%."
              }
            }
          ]
        }
      ]
    },
    {
      id: "exp2",
      company: "GlobalNet Corp",
      role: "Software Engineer",
      dates: "Jun 2018 - Dec 2020",
      location: "New York, NY",
      projects: [
        {
          id: "p2",
          name: "E-Commerce Payment Gateway",
          bullets: [
            {
              id: "b3",
              selectedVariation: "Original",
              variations: {
                "Original": "Implemented Stripe payment processing for the main checkout flow.",
                "ATS-Optimized": "Spearheaded the integration of Stripe API, processing over $2M in secure transactions annually.",
                "Backend-Heavy": "Developed robust Node.js microservices for secure, asynchronous payment processing and webhook handling."
              }
            }
          ]
        }
      ]
    }
  ]
};

const initialTrackerData = {
  columns: [
    { id: 'discovered', title: 'Discovered' },
    { id: 'tailored', title: 'Tailored' },
    { id: 'applied', title: 'Applied' },
    { id: 'interviewing', title: 'Interviewing' },
  ],
  jobs: [
    { id: 'j1', company: 'TechGlobal Inc', title: 'Senior Frontend Engineer', salary: '$140k - $160k', date: '2 days ago', status: 'discovered', version: 'v1.0' },
    { id: 'j2', company: 'CloudScale', title: 'Full Stack Developer', salary: '$130k - $150k', date: '1 week ago', status: 'tailored', version: 'v2.1' },
    { id: 'j3', company: 'FinEdge', title: 'UI Architect', salary: '$150k+', date: 'Yesterday', status: 'applied', version: 'v3.0' },
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('vault');
  const [data, setData] = useState(initialData);
  const [selectedBio, setSelectedBio] = useState('Original');
  
  // Handlers for Vault
  const handleVariationChange = (expId, projId, bulletId, variationKey) => {
    setData(prev => {
      const newData = { ...prev };
      const expIndex = newData.experiences.findIndex(e => e.id === expId);
      if(expIndex === -1) return prev;
      
      const projIndex = newData.experiences[expIndex].projects.findIndex(p => p.id === projId);
      if(projIndex === -1) return prev;

      const bulletIndex = newData.experiences[expIndex].projects[projIndex].bullets.findIndex(b => b.id === bulletId);
      if(bulletIndex === -1) return prev;

      newData.experiences[expIndex].projects[projIndex].bullets[bulletIndex].selectedVariation = variationKey;
      return newData;
    });
  };

  const navItems = [
    { id: 'vault', label: 'The Vault', icon: FolderOpen },
    { id: 'tailor', label: 'Tailor Workspace', icon: Wand2 },
    { id: 'tracker', label: 'Application Tracker', icon: Kanban },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-10 flex-shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Layers className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">ResumeVault AI</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                : 'hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-200' : 'text-slate-500'}`} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-200">{data.user.name}</span>
              <span className="text-xs text-slate-500">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {activeTab === 'vault' && (
          <VaultView 
            data={data} 
            selectedBio={selectedBio} 
            setSelectedBio={setSelectedBio}
            handleVariationChange={handleVariationChange}
          />
        )}
        {activeTab === 'tailor' && (
          <TailorWorkspace />
        )}
        {activeTab === 'tracker' && (
          <ApplicationTracker />
        )}
      </main>
    </div>
  );
}

function VaultView({ data, selectedBio, setSelectedBio, handleVariationChange }) {
  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">The Vault</h1>
          <p className="text-slate-500 mt-1">Manage your universal career database and tailor configurations.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-600/30">
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </header>

      {/* Profile Summary Card */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 transition-all hover:shadow-md">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              Profile Summary
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1">{data.user.title}</p>
          </div>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.keys(data.user.bioVariations).map(key => (
              <button
                key={key}
                onClick={() => setSelectedBio(key)}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors border ${
                  selectedBio === key 
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">
            {data.user.bioVariations[selectedBio]}
          </p>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="space-y-6">
        {data.experiences.map(exp => (
          <ExperienceCard 
            key={exp.id} 
            exp={exp} 
            handleVariationChange={handleVariationChange}
          />
        ))}
      </section>
    </div>
  );
}

function ExperienceCard({ exp, handleVariationChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      {/* Card Header (Metadata) */}
      <div 
        className="p-6 cursor-pointer flex items-center justify-between group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {exp.role}
            </h3>
            <p className="text-sm font-medium text-slate-600">{exp.company}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {exp.dates}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </div>
          </div>
          <div className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 pt-4 space-y-6">
          {exp.projects.map(proj => (
            <div key={proj.id} className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                Project: {proj.name}
              </h4>
              
              <div className="space-y-3 pl-4 border-l-2 border-slate-200 ml-1">
                {proj.bullets.map(bullet => (
                  <div key={bullet.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-indigo-200 transition-colors group">
                    <p className="text-slate-700 text-sm leading-relaxed mb-3">
                      {bullet.variations[bullet.selectedVariation]}
                    </p>
                    <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Variants:</span>
                      {Object.keys(bullet.variations).map(vKey => (
                        <button
                          key={vKey}
                          onClick={() => handleVariationChange(exp.id, proj.id, bullet.id, vKey)}
                          className={`text-[10px] px-2 py-1 rounded-md font-semibold transition-all border ${
                            bullet.selectedVariation === vKey
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                        >
                          {vKey}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-4 transition-colors">
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      )}
    </div>
  );
}

function TailorWorkspace() {
  const [jd, setJd] = useState('');
  const [role, setRole] = useState('Frontend Engineer');
  const [instructions, setInstructions] = useState('');
  
  // State machine: 'idle' | 'processing' | 'completed'
  const [status, setStatus] = useState('idle');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: Search, label: "Agent 1 (JD Researcher) analyzing keywords and tone..." },
    { icon: Database, label: "Agent 2 (Retriever) querying Vector DB for matching experiences..." },
    { icon: FileText, label: "Agent 3 (Writer) rewriting bullet points and front-loading impact verbs..." },
    { icon: ShieldCheck, label: "Agent 4 (ATS Guard) validating formatting and eliminating hallucinations..." }
  ];

  const handleGenerate = () => {
    if(!jd.trim()) return;
    setStatus('processing');
    setCurrentStep(0);
  };

  useEffect(() => {
    if (status === 'processing') {
      let stepIndex = 0;
      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex >= steps.length) {
          clearInterval(interval);
          setStatus('completed');
        } else {
          setCurrentStep(stepIndex);
        }
      }, 2000); // 2 seconds per step

      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-slate-50 overflow-hidden">
      {/* Left Pane: Input Panel */}
      <div className="w-full md:w-1/2 p-8 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-indigo-600" />
          Tailor Workspace
        </h2>
        
        <div className="space-y-6 flex-1">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Target Role</label>
            <div className="relative">
              <Target className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select 
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium appearance-none"
              >
                <option>Frontend Engineer</option>
                <option>Full Stack Developer</option>
                <option>Backend Engineer</option>
                <option>Engineering Manager</option>
              </select>
              <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-[250px]">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Raw Job Description</label>
            <textarea 
              placeholder="Paste the job description here..."
              value={jd}
              onChange={e => setJd(e.target.value)}
              className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700 resize-none font-sans"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Custom Instructions (Optional)</label>
            <input 
              type="text"
              placeholder="e.g., Emphasize my leadership in cloud migration"
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-slate-700"
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={status === 'processing' || !jd.trim()}
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
        >
          {status === 'processing' ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Wand2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
          Generate Tailored Resume
        </button>
      </div>

      {/* Right Pane: Live Preview & Feedback */}
      <div className="w-full md:w-1/2 bg-slate-100/50 p-8 flex flex-col h-full overflow-y-auto relative">
        {status === 'idle' && (
          <div className="m-auto text-center max-w-md animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-200">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Awaiting Instructions</h3>
            <p className="text-slate-500 leading-relaxed">Paste a Job Description on the left and hit generate to begin the agent pipeline.</p>
          </div>
        )}

        {status === 'processing' && (
          <div className="m-auto w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 animate-in slide-in-from-bottom-8 duration-500">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
              AI Agents at Work
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {steps.map((step, idx) => {
                const isActive = idx === currentStep;
                const isPast = idx < currentStep;
                const StepIcon = step.icon;
                
                return (
                  <div key={idx} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : isPast ? 'opacity-50 scale-95' : 'opacity-30 scale-95'}`}>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${isActive ? 'bg-indigo-600 border-indigo-100 text-white shadow-indigo-600/40 animate-pulse' : isPast ? 'bg-emerald-500 border-emerald-100 text-white' : 'bg-slate-100 border-white text-slate-400'}`}>
                      {isPast ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                      <p className={`text-sm font-medium leading-snug ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>{step.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-t-xl border border-b-0 border-slate-200 shadow-sm z-10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="font-bold text-slate-800">Optimization Complete</span>
              </div>
              <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Download className="w-4 h-4" />
                Export ATS PDF
              </button>
            </div>
            
            {/* Mock Document Wrapper */}
            <div className="flex-1 bg-white border border-slate-200 rounded-b-xl shadow-lg p-10 overflow-y-auto">
              <div className="max-w-[210mm] mx-auto space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                  <h1 className="text-3xl font-serif font-bold text-slate-900">ALEX DOE</h1>
                  <p className="text-sm text-slate-600 mt-1">San Francisco, CA • alex.doe@email.com • linkedin.com/in/alexdoe</p>
                </div>
                
                <section>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">Professional Summary</h2>
                  <p className="text-sm text-slate-800 leading-relaxed font-serif">
                    Strategic technology leader driving product innovation and cross-functional excellence. Proven track record of delivering high-impact SaaS solutions and cultivating high-performance engineering cultures.
                  </p>
                </section>

                <section>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3 mt-6">Experience</h2>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-slate-900">TechNova Solutions</h3>
                      <span className="text-sm font-medium text-slate-600">Jan 2021 - Present</span>
                    </div>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm italic text-slate-800">Lead Frontend Engineer</span>
                      <span className="text-sm text-slate-600">San Francisco, CA</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 space-y-1.5 text-sm text-slate-800 font-serif">
                      <li>Engineered a high-performance React/Tailwind dashboard, achieving a 40% reduction in LCP and improving core web vitals.</li>
                      <li>Directed a cross-functional team of 5 engineers, successfully delivering 100% of quarterly product roadmap milestones.</li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Dummy Database icon since it wasn't exported from lucide by default in our list
function Database(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}

function ApplicationTracker() {
  const [data, setData] = useState(initialTrackerData);

  const onDragStart = (e, id) => {
    e.dataTransfer.setData('jobId', id);
  };

  const onDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const onDrop = (e, columnId) => {
    const jobId = e.dataTransfer.getData('jobId');
    const updatedJobs = data.jobs.map(job => {
      if (job.id === jobId) {
        return { ...job, status: columnId };
      }
      return job;
    });
    setData({ ...data, jobs: updatedJobs });
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Application Tracker</h1>
        <p className="text-slate-500 mt-1">Visualize and manage your targeted opportunities.</p>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {data.columns.map(col => (
          <div 
            key={col.id} 
            className="flex-shrink-0 w-80 flex flex-col bg-slate-100/50 rounded-2xl border border-slate-200"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="p-4 border-b border-slate-200 bg-white/50 rounded-t-2xl flex items-center justify-between">
              <h3 className="font-bold text-slate-700 capitalize flex items-center gap-2">
                {col.id === 'discovered' && <Search className="w-4 h-4 text-slate-400" />}
                {col.id === 'tailored' && <Wand2 className="w-4 h-4 text-indigo-400" />}
                {col.id === 'applied' && <ArrowRight className="w-4 h-4 text-blue-400" />}
                {col.id === 'interviewing' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {col.title}
              </h3>
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                {data.jobs.filter(j => j.status === col.id).length}
              </span>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px]">
              {data.jobs.filter(j => j.status === col.id).map(job => (
                <div 
                  key={job.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, job.id)}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 leading-tight">{job.title}</h4>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-4">{job.company}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded border border-emerald-100">
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {job.date}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">Attached Resume:</span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded flex items-center gap-1 group-hover:bg-indigo-100 transition-colors">
                      <FileText className="w-3 h-3" />
                      {job.version}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
