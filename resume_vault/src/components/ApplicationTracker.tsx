import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { LayoutGrid, Building, Calendar, ArrowRight, ArrowLeft, Trash2, ArrowRightCircle } from 'lucide-react';

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

interface ApplicationTrackerProps {
  onSelectApplication: (id: string) => void;
}

export function ApplicationTracker({ onSelectApplication }: ApplicationTrackerProps) {
  const applications = (useQuery(api.applications.list) as ApplicationDoc[]) || [];
  const updateStatus = useMutation(api.applications.updateStatus);
  const deleteApp = useMutation(api.applications.remove);

  const stages = ['Discovered', 'Tailoring', 'Applied', 'Interviewing'];

  const handleMoveStage = async (id: string, currentStatus: string, direction: 'forward' | 'backward') => {
    const currentIndex = stages.indexOf(currentStatus);
    let nextIndex = currentIndex;

    if (direction === 'forward' && currentIndex < stages.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      try {
        await updateStatus({
          id: id as Id<'applications'>,
          status: stages[nextIndex],
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteApp({ id: id as Id<'applications'> });
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6 min-h-[calc(100vh-140px)]">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-indigo-500" />
          Application Pipeline
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the lifecycle of your tailored applications. Click any card to load it in the Workspace Dashboard.
        </p>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {stages.map((stage) => {
          const stageApps = applications.filter((app) => app.status === stage);

          return (
            <div
              key={stage}
              className="bg-slate-50 dark:bg-neutral-900/60 border border-slate-200 dark:border-neutral-800 rounded-2xl p-4 flex flex-col gap-4 min-h-[450px]"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between border-b border-slate-250 dark:border-neutral-800/80 pb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  {stage}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 rounded-full">
                  {stageApps.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[60vh] pr-1">
                {stageApps.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-neutral-850 rounded-xl">
                    No applications
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <div
                      key={app._id}
                      onClick={() => onSelectApplication(app._id)}
                      className="bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-slate-350 dark:hover:border-neutral-700 transition duration-200 cursor-pointer group relative flex flex-col justify-between min-h-[140px]"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition leading-snug">
                            {app.jobTitle}
                          </h4>
                          <button
                            onClick={(e) => handleDelete(e, app._id)}
                            className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition duration-150 shrink-0 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
                          <Building className="w-3 h-3 text-slate-400" /> {app.company}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-auto border-t border-slate-100 dark:border-neutral-850/80 pt-3">
                        <span className="text-[9px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </span>

                        {/* Navigation Actions */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {stage !== 'Discovered' && (
                            <button
                              onClick={() => handleMoveStage(app._id, app.status, 'backward')}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {stage !== 'Interviewing' && (
                            <button
                              onClick={() => handleMoveStage(app._id, app.status, 'forward')}
                              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 cursor-pointer"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectApplication(app._id)}
                            title="Load in workspace"
                            className="p-1 text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-350 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 cursor-pointer"
                          >
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
