import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Loader2,
  CircleDashed,
  Terminal,
  ChevronRight,
  AlertTriangle,
  Box,
  Layers,
  ArrowRight,
  Cpu
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- COMPONENTS ---

const Header = () => (
  <header className="mb-12 text-center space-y-3">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center justify-center gap-3 mb-2"
    >
      <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 backdrop-blur-sm shadow-inner shadow-indigo-500/5">
        <Layers className="w-8 h-8 text-indigo-400" />
      </div>
      <h1 className="text-4xl font-bold text-slate-100 tracking-tight">
        CI/CD Playground
      </h1>
    </motion.div>
    <p className="text-slate-400 max-w-lg mx-auto text-lg">
      Visualize pipelines, debug logs, and master the flow.
    </p>
  </header>
);

const ControlPanel = ({ onRun, onRetry, failTest, setFailTest, loading, pipelineStatus }) => (
  <motion.div
    className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 mb-10 shadow-xl"
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

      {/* Toggle Switch */}
      <label className="flex items-center gap-4 cursor-pointer group select-none">
        <div className="relative">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={failTest}
            onChange={(e) => setFailTest(e.target.checked)}
          />
          <div className="w-14 h-7 bg-slate-800 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-slate-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-900/30 peer-checked:after:bg-rose-500 hover:bg-slate-700 transition-colors"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            Simulate Failure
          </span>
          <span className="text-xs text-slate-500">Triggers error in TEST stage</span>
        </div>
      </label>

      <div className="flex gap-3">
        <button
          onClick={onRun}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          Run Pipeline
        </button>

        {pipelineStatus === "FAILED" && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium border border-slate-700 transition-all hover:border-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

const StageCard = ({ stage, isActive, isSelected, onClick, index, total }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS": return "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]";
      case "FAILED": return "border-rose-500/50 bg-rose-500/10 shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]";
      case "RUNNING": return "border-blue-500/50 bg-blue-500/10 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]";
      case "SKIPPED": return "border-slate-700 bg-slate-800/30 opacity-60";
      default: return "border-slate-700 bg-slate-800/50";
    }
  };

  const getIcon = (status) => {
    switch (status) {
      case "SUCCESS": return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "FAILED": return <XCircle className="w-5 h-5 text-rose-500" />;
      case "RUNNING": return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case "SKIPPED": return <CircleDashed className="w-5 h-5 text-slate-500" />;
      default: return <CircleDashed className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="relative flex items-center flex-1">
      {/* Connector Line */}
      {index < total - 1 && (
        <div className="hidden md:block absolute left-1/2 top-1/2 w-full h-[2px] bg-slate-800 -z-10">
          <div
            className={cn(
              "h-full transition-all duration-700 ease-out origin-left",
              stage.status === "SUCCESS" ? "bg-emerald-500/30" :
                stage.status === "FAILED" ? "bg-rose-500/30" :
                  "bg-transparent"
            )}
            style={{ width: stage.status === "PENDING" ? "0%" : "100%" }}
          />
        </div>
      )}

      {/* Card */}
      <motion.button
        layout
        onClick={onClick}
        className={cn(
          "relative z-10 w-full md:w-48 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 flex flex-col items-center gap-3 group text-left",
          getStatusColor(stage.status),
          isSelected ? "ring-2 ring-indigo-500/50 scale-105" : "hover:border-slate-600 hover:bg-slate-800/80"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="relative p-2 rounded-lg bg-slate-950/30">
            {getIcon(stage.status)}
          </div>
          {isActive && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          )}
        </div>

        <div className="w-full">
          <h3 className="font-semibold text-sm text-slate-200">{stage.name}</h3>
          <p className="text-xs font-mono text-slate-500 mt-1 flex items-center gap-1">
            {stage.status}
          </p>
        </div>
      </motion.button>

      {/* Mobile Connector Arrow */}
      {index < total - 1 && (
        <div className="md:hidden flex justify-center py-2 text-slate-800 w-full absolute -bottom-6 left-0">
          <ArrowRight className="w-5 h-5 rotate-90" />
        </div>
      )}
    </div>
  );
};

const LogsPanel = ({ stage }) => {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [stage?.logs]);

  if (!stage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-center p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/20"
      >
        <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
          <Cpu className="w-6 h-6 text-slate-600" />
        </div>
        <h3 className="text-sm font-medium text-slate-400">System Ready</h3>
        <p className="text-slate-500 text-sm mt-1">Select a pipeline stage to view live logs.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={stage.name}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 rounded-xl overflow-hidden border border-slate-800 bg-[#0d1117] shadow-2xl ring-1 ring-white/5"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800 backdrop-blur">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-mono text-slate-400">
            {stage.name.toLowerCase()}.log
          </span>
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase",
            stage.status === "RUNNING" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
              stage.status === "FAILED" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" :
                stage.status === "SUCCESS" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                  "border-slate-700 text-slate-500"
          )}>{stage.status}</span>
        </div>
        <div className="flex gap-1.5 opacity-50">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
        </div>
      </div>

      <div className="p-4 h-80 overflow-y-auto font-mono text-[13px] leading-relaxed space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {stage.logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
            {stage.status === "PENDING" ? (
              <>
                <CircleDashed className="w-6 h-6 opacity-20" />
                <p>Stage pending...</p>
              </>
            ) : (
              <>
                <Loader2 className="w-6 h-6 animate-spin opacity-20" />
                <p>Waiting for output...</p>
              </>
            )}
          </div>
        ) : (
          stage.logs.map((log, i) => (
            <div
              key={i}
              className="group flex gap-3 text-slate-300/90 hover:bg-white/5 py-0.5 px-2 -mx-2 rounded"
            >
              <span className="text-slate-700 select-none w-6 text-right shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                {i + 1}
              </span>
              <span className="break-all">{log}</span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

export default function CI_CD_Playground() {
  const [runId, setRunId] = useState(null);
  const [pipeline, setPipeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStageName, setSelectedStageName] = useState(null);
  const [failTest, setFailTest] = useState(false);

  const selectedStage = pipeline?.stages?.find(s => s.name === selectedStageName) || null;

  // --- API ---
  const startPipeline = async () => {
    setLoading(true);
    setPipeline(null);
    setSelectedStageName(null);

    try {
      // Assuming a backend mock or service exists on port 4000
      const res = await fetch("http://localhost:4000/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ failTest }),
      });
      const data = await res.json();
      setRunId(data.runId);
    } catch (e) {
      console.error("API Error", e);
      // Fallback for demo purposes if backend isn't present
      // In a real scenario, we'd show an error toast
    } finally {
      setLoading(false);
    }
  };

  const retryPipeline = async () => {
    if (!runId) return;
    try {
      await fetch(`http://localhost:4000/pipeline/${runId}/retry`, { method: "POST" });
    } catch (e) {
      console.error("Retry Error", e);
    }
  };

  // Polling
  useEffect(() => {
    if (!runId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:4000/pipeline/${runId}`);
        const data = await res.json();
        setPipeline(data);
      } catch (e) {
        console.error("Polling Error", e);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [runId]);

  // Sync selected stage
  useEffect(() => {
    if (!pipeline) return;

    // 1. If no stage is selected, select the first one
    if (!selectedStageName) {
      const initial = pipeline.stages.find(s => s.status === "RUNNING") || pipeline.stages[0];
      if (initial) setSelectedStageName(initial.name);
      return;
    }

    // 2. Priority 1: Follow the RUNNING stage (Live "Tail" behavior)
    const runningStage = pipeline.stages.find(s => s.status === "RUNNING");
    if (runningStage) {
      if (runningStage.name !== selectedStageName) {
        setSelectedStageName(runningStage.name);
      }
    }
  }, [pipeline, selectedStageName]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 pb-20">
      {/* Background Texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950/50 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-12">
        <Header />

        <ControlPanel
          onRun={startPipeline}
          onRetry={retryPipeline}
          failTest={failTest}
          setFailTest={setFailTest}
          loading={loading}
          pipelineStatus={pipeline?.status}
        />

        <AnimatePresence mode="wait">
          {runId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {/* Stages Container */}
              <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0 relative">
                {pipeline?.stages?.map((stage, index) => (
                  <StageCard
                    key={stage.name}
                    stage={stage}
                    index={index}
                    total={pipeline.stages.length}
                    isActive={stage.status === "RUNNING"}
                    isSelected={selectedStageName === stage.name}
                    onClick={() => setSelectedStageName(stage.name)}
                  />
                ))}
              </div>

              {/* Logs */}
              <LogsPanel stage={selectedStage} />

            </motion.div>
          )}
        </AnimatePresence>

        {!runId && !loading && (
          <div className="mt-20 text-center space-y-4 opacity-50">
            <div className="w-16 h-1 bg-slate-800 mx-auto rounded-full" />
            <p className="text-slate-600">Ready to visualize your CI/CD workflow</p>
          </div>
        )}
      </div>
    </div>
  );
}