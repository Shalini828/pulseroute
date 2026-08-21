import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Rocket,
} from "lucide-react";
import { Link } from "react-router-dom";

interface SetupStep {
  title: string;
  description: string;
  completed: boolean;
  link: string;
}

const steps: SetupStep[] = [
  {
    title: "Create a Project",
    description: "Set up your PulseRoute workspace",
    completed: true,
    link: "/projects",
  },
  {
    title: "Create an API Key",
    description: "Authenticate requests to your gateway",
    completed: true,
    link: "/apikeys",
  },
  {
    title: "Send your first AI Request",
    description: "Test your provider connection",
    completed: true,
    link: "/gateway",
  },
  {
    title: "View Analytics",
    description: "Monitor requests and gateway performance",
    completed: false,
    link: "/analytics",
  },
];

export default function GettingStarted() {
  const completedSteps = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;

  const progress =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0;

  const nextStep =
    steps.find((step) => !step.completed) ?? null;

  const isComplete = completedSteps === totalSteps;

  return (
    <section className="rounded-2xl border border-slate-800/90 bg-slate-950/70 p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-300">
            <Rocket size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Getting Started
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Complete your gateway setup
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-400">
              Complete these steps to get your PulseRoute gateway ready.
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex w-fit shrink-0 items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
          <span className="text-xs text-slate-500">
            Progress
          </span>

          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-200">
            {completedSteps}/{totalSteps}
          </span>

          <span className="text-xs font-semibold text-blue-300">
            {progress}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Setup Steps */}
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {steps.map((step) => {
          const isNext = nextStep?.title === step.title;

          return (
            <Link
              key={step.title}
              to={step.link}
              className={`group flex min-h-[82px] items-center justify-between gap-4 rounded-xl border px-4 py-3.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
                isNext
                  ? "border-blue-500/30 bg-blue-500/[0.05] hover:border-blue-500/50 hover:bg-blue-500/[0.08]"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    step.completed
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-blue-500/10 text-blue-300"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Circle size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <p
                      className={`truncate text-sm font-semibold ${
                        step.completed
                          ? "text-slate-200"
                          : "text-white"
                      }`}
                    >
                      {step.title}
                    </p>

                    {isNext && (
                      <span className="hidden shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-300 sm:inline-flex">
                        Next
                      </span>
                    )}
                  </div>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`hidden text-xs sm:inline ${
                    step.completed
                      ? "text-slate-500"
                      : "text-blue-300"
                  }`}
                >
                  {step.completed ? "Completed" : "Continue"}
                </span>

                <ArrowRight
                  size={15}
                  className="text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-300"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Summary */}
      <div className="mt-5 flex flex-col gap-3 border-t border-slate-800/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-200">
            {isComplete
              ? "Your gateway is fully configured."
              : `${totalSteps - completedSteps} ${
                  totalSteps - completedSteps === 1
                    ? "step"
                    : "steps"
                } remaining`}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {completedSteps} of {totalSteps} setup steps completed
          </p>
        </div>

        {nextStep && (
          <Link
            to={nextStep.link}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-300 transition-colors hover:text-blue-200"
          >
            Continue setup
            <ArrowRight size={15} />
          </Link>
        )}

        {isComplete && (
          <Link
            to="/analytics"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-blue-300 transition-colors hover:text-blue-200"
          >
            View Analytics
            <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </section>
  );
}