import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Briefcase, FolderGit2, Wrench, Plus, Trash2, Calendar, Tag } from 'lucide-react';

interface ExperienceDoc {
  _id: any;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface ProjectDoc {
  _id: any;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

interface SkillDoc {
  _id: any;
  name: string;
  category: string;
}

export function CareerVault() {
  const [activeTab, setActiveTab] = useState<'experience' | 'projects' | 'skills'>('experience');

  const experiences = (useQuery(api.experiences.list) as ExperienceDoc[]) || [];
  const projects = (useQuery(api.projects.list) as ProjectDoc[]) || [];
  const skills = (useQuery(api.skills.list) as SkillDoc[]) || [];

  const addExperience = useMutation(api.experiences.add);
  const deleteExperience = useMutation(api.experiences.remove);

  const addProject = useMutation(api.projects.add);
  const deleteProject = useMutation(api.projects.remove);

  const addSkill = useMutation(api.skills.add);
  const deleteSkill = useMutation(api.skills.remove);

  // Form States - Experience
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bullets, setBullets] = useState<string[]>([]);
  const [currentBullet, setCurrentBullet] = useState('');

  // Form States - Projects
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projTech, setProjTech] = useState('');
  const [projUrl, setProjUrl] = useState('');

  // Form States - Skills
  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('Languages');

  const handleAddBullet = () => {
    if (!currentBullet.trim()) return;
    setBullets([...bullets, currentBullet.trim()]);
    setCurrentBullet('');
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !startDate || !endDate) return;

    try {
      await addExperience({
        company,
        role,
        startDate,
        endDate,
        bullets,
      });
      // Reset
      setCompany('');
      setRole('');
      setStartDate('');
      setEndDate('');
      setBullets([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName || !projDesc) return;

    const techArray = projTech
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await addProject({
        name: projName,
        description: projDesc,
        technologies: techArray,
        url: projUrl || undefined,
      });
      // Reset
      setProjName('');
      setProjDesc('');
      setProjTech('');
      setProjUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName) return;

    try {
      await addSkill({
        name: skillName.trim(),
        category: skillCategory,
      });
      setSkillName('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-full min-h-[calc(100vh-140px)]">
      {/* Sidebar Navigation (3 cols equivalent) */}
      <div className="w-full md:w-64 border-r border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50 p-6 flex flex-col gap-2">
        <h2 className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider mb-4 px-2">
          Master Vault Tables
        </h2>
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'experience'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-850'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Work Experiences
          <span className="ml-auto text-xs bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">
            {experiences.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-850'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Projects
          <span className="ml-auto text-xs bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">
            {projects.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-850'
          }`}
        >
          <Wrench className="w-4 h-4" />
          Technical Skills
          <span className="ml-auto text-xs bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 px-2 py-0.5 rounded-full">
            {skills.length}
          </span>
        </button>
      </div>

      {/* Main Tab Panel Section */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[85vh]">
        {/* TABS 1: Work Experience Manager */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Master Professional Experience</h1>
              <p className="text-xs text-slate-500 mt-1">
                Add and manage your complete historical work experience list. Write comprehensive bullet points here.
              </p>
            </div>

            {/* Experience Insertion Form */}
            <form onSubmit={handleExperienceSubmit} className="bg-slate-50 dark:bg-neutral-950 border border-slate-150 dark:border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" /> Add New Position
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Role / Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Staff Backend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. May 2022"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Present, Dec 2024"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Bullet Variation Addition */}
              <div className="border-t border-slate-250 dark:border-neutral-800/80 pt-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Bullet Points & Career Achievements
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a clear bullet point showcasing impact..."
                    value={currentBullet}
                    onChange={(e) => setCurrentBullet(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBullet();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddBullet}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 rounded-lg text-xs font-bold transition cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Bullets List */}
                {bullets.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="flex items-start justify-between gap-3 text-xs bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800/80 p-2.5 rounded-lg text-slate-700 dark:text-neutral-300"
                      >
                        <span className="leading-relaxed flex-1">• {bullet}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(idx)}
                          className="text-rose-500 hover:text-rose-700 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
              >
                Add Work Experience to Vault
              </button>
            </form>

            {/* List current Experiences */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                Current Vault Experiences ({experiences.length})
              </h3>
              {experiences.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl text-sm">
                  Your work experience list is currently empty.
                </div>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div
                      key={exp._id}
                      className="border border-slate-200 dark:border-neutral-800/80 p-5 rounded-xl flex gap-4 hover:border-slate-350 dark:hover:border-neutral-700 transition"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-md">
                              {exp.company}
                            </h4>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400 italic">
                              {exp.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {exp.startDate} - {exp.endDate}
                            </span>
                            <button
                              onClick={() => deleteExperience({ id: exp._id })}
                              className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {exp.bullets.length > 0 && (
                          <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-neutral-400 space-y-1">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TABS 2: Projects Manager */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Master Projects</h1>
              <p className="text-xs text-slate-500 mt-1">
                Add and catalog your portfolios, open source contributions, and key technical applications.
              </p>
            </div>

            {/* Project insertion form */}
            <form onSubmit={handleProjectSubmit} className="bg-slate-50 dark:bg-neutral-950 border border-slate-150 dark:border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" /> Add New Project
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Consensus Engine"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Project Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="e.g. https://github.com/myusername/consensus"
                    value={projUrl}
                    onChange={(e) => setProjUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Project Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Outline the core functionality and your technical contribution..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full p-3 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Technologies (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Go, Redis, Docker"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
              >
                Add Project to Vault
              </button>
            </form>

            {/* List Current Projects */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                Current Vault Projects ({projects.length})
              </h3>
              {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl text-sm">
                  Your project catalog is currently empty.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((p) => (
                    <div
                      key={p._id}
                      className="border border-slate-200 dark:border-neutral-800/80 p-5 rounded-xl flex gap-4 hover:border-slate-350 dark:hover:border-neutral-700 transition"
                    >
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/45 text-indigo-600 flex items-center justify-center shrink-0">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-white text-md">
                              {p.name}
                            </h4>
                            {p.url && (
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                {p.url}
                              </a>
                            )}
                          </div>
                          <button
                            onClick={() => deleteProject({ id: p._id })}
                            className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                          {p.description}
                        </p>
                        {p.technologies && p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {p.technologies.map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 px-2 py-0.5 rounded"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TABS 3: Skills Manager */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Master Technical Skills</h1>
              <p className="text-xs text-slate-500 mt-1">
                Add skills tag points (Languages, Cloud Frameworks, Developer Tools) to populate your resumes.
              </p>
            </div>

            {/* Skill insertion form */}
            <form onSubmit={handleSkillSubmit} className="bg-slate-50 dark:bg-neutral-950 border border-slate-150 dark:border-neutral-800/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-500" /> Add Technical Skill Tag
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Webpack, Kubernetes, GraphQL"
                    value={skillName}
                    onChange={(e) => setSkillName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frameworks">Frameworks</option>
                    <option value="Developer Tools">Developer Tools</option>
                    <option value="Databases">Databases</option>
                    <option value="General Tech">General Tech</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer"
              >
                Add Skill Tag to Vault
              </button>
            </form>

            {/* List grouped skill tags */}
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-slate-400 dark:text-neutral-500 uppercase tracking-wider">
                Grouped Vault Skills ({skills.length})
              </h3>
              {skills.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 dark:border-neutral-800 rounded-xl text-sm">
                  No technical skill tags added yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {['Languages', 'Frameworks', 'Developer Tools', 'Databases', 'General Tech'].map((cat) => {
                    const filteredSkills = skills.filter((s) => s.category === cat);
                    if (filteredSkills.length === 0) return null;

                    return (
                      <div key={cat} className="space-y-2 border-b border-slate-100 dark:border-neutral-800/80 pb-4">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-indigo-500" />
                          {cat}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {filteredSkills.map((sk) => (
                            <span
                              key={sk._id}
                              className="text-xs flex items-center gap-1.5 bg-slate-50 dark:bg-neutral-850 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 pl-3 pr-2 py-1 rounded-full border border-slate-200 dark:border-neutral-800 transition"
                            >
                              {sk.name}
                              <button
                                onClick={() => deleteSkill({ id: sk._id })}
                                className="text-slate-400 hover:text-rose-500 transition cursor-pointer shrink-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
