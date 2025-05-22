import React, { useState, useEffect, useCallback } from 'react';
import { Quadrant, Task, AiCategorizationResponse } from './types';
import { QUADRANT_DEFINITIONS, AppTitleIcon, TASK_LIMIT_PER_QUADRANT, TOTAL_TASK_LIMIT } from './constants';
import QuadrantColumn from './components/QuadrantColumn';
import AddTaskForm from './components/AddTaskForm';
import AiOverallInsight from './components/AiOverallInsight';
import { LoadingSpinner } from './components/LoadingSpinner';
import { InfoIcon } from './components/Icons';
import { categorizeTaskWithAI, getTaskAdviceFromAI } from './services/geminiService';

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const LOCAL_STORAGE_KEY = 'aiEisenhowerTasks';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  
  // Vite exposes environment variables prefixed with VITE_ on import.meta.env
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  useEffect(() => {
    if (!geminiApiKey) {
      setApiKeyMissing(true);
      setError("Kunci API Gemini tidak dikonfigurasi. Fitur AI akan dinonaktifkan. Harap atur variabel lingkungan VITE_GEMINI_API_KEY dalam file .env Anda.");
    } else {
      setApiKeyMissing(false); // Ensure it's reset if key becomes available (e.g. HMR with .env changes)
    }
  }, [geminiApiKey]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks: Task[] = JSON.parse(storedTasks);
        // Basic validation
        if (Array.isArray(parsedTasks) && parsedTasks.every(t => t.id && t.description && t.quadrant && t.createdAt)) {
          setTasks(parsedTasks);
        } else {
          console.warn("Invalid data found in localStorage, ignoring.");
          localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear invalid data
        }
      }
    } catch (e) {
      console.error("Gagal memuat tugas dari localStorage:", e);
      setError("Gagal memuat tugas tersimpan. Memulai dengan daftar kosong.");
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Gagal menyimpan tugas ke localStorage:", e);
      setError("Gagal menyimpan progres tugas Anda saat ini.");
    }
  }, [tasks]);

  const handleAddTask = useCallback(async (description: string) => {
    if (apiKeyMissing || !geminiApiKey) { // Added !geminiApiKey for explicitness
      const newTask: Task = {
        id: generateId(),
        description,
        quadrant: Quadrant.SCHEDULE, // Default quadrant if AI is off
        createdAt: Date.now(),
        aiRecommendation: "Kategorisasi AI dinonaktifkan karena kunci API tidak ada."
      };
      setTasks(prevTasks => [...prevTasks, newTask]);
      return;
    }

    if (tasks.length >= TOTAL_TASK_LIMIT) {
      setError(`Batas tugas sebanyak ${TOTAL_TASK_LIMIT} telah tercapai. Harap kelola tugas yang ada.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const aiResponse = await categorizeTaskWithAI(description, geminiApiKey);
      
      let newQuadrant = aiResponse.quadrant;
      let recommendation = aiResponse.recommendation;

      if (tasks.filter(t => t.quadrant === newQuadrant).length >= TASK_LIMIT_PER_QUADRANT) {
        setError(`Kuadran "${QUADRANT_DEFINITIONS[newQuadrant].title}" penuh. Tugas ditambahkan ke "${QUADRANT_DEFINITIONS[Quadrant.SCHEDULE].title}".`);
        newQuadrant = Quadrant.SCHEDULE; 
        recommendation += ` (Semula disarankan untuk ${aiResponse.quadrant}, dipindahkan karena batas.)`;
      }
      
      const newTask: Task = {
        id: generateId(),
        description,
        quadrant: newQuadrant,
        aiRecommendation: recommendation,
        createdAt: Date.now(),
      };

      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (e: any) {
      console.error("Kesalahan menambahkan tugas dengan AI:", e);
      setError(`Gagal mendapatkan kategorisasi AI. Tugas ditambahkan secara manual. Kesalahan: ${e.message || 'Kesalahan tidak diketahui'}`);
      const fallbackTask: Task = {
        id: generateId(),
        description,
        quadrant: Quadrant.SCHEDULE, // Fallback quadrant
        createdAt: Date.now(),
        aiRecommendation: "Kategorisasi AI gagal. Harap kategorisasi secara manual."
      };
      setTasks(prevTasks => [...prevTasks, fallbackTask]);
    } finally {
      setIsLoading(false);
    }
  }, [geminiApiKey, apiKeyMissing, tasks]);

  const moveTask = (taskId: string, newQuadrant: Quadrant) => {
    setTasks(prevTasks => {
      const taskToMove = prevTasks.find(t => t.id === taskId);
      if (taskToMove && prevTasks.filter(t => t.quadrant === newQuadrant).length >= TASK_LIMIT_PER_QUADRANT) {
        setError(`Tidak dapat memindahkan tugas: Kuadran "${QUADRANT_DEFINITIONS[newQuadrant].title}" penuh.`);
        return prevTasks;
      }
      return prevTasks.map(task =>
        task.id === taskId ? { ...task, quadrant: newQuadrant, aiRecommendation: (task.aiRecommendation || "") + " (Dipindahkan manual)" } : task
      );
    });
    setError(null); // Clear error on successful-ish move attempt
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };
  
  const getTaskAdvice = useCallback(async (task: Task): Promise<string> => {
    if (apiKeyMissing || !geminiApiKey) return "Saran AI dinonaktifkan karena kunci API tidak ada.";
    setError(null);
    try {
      const advice = await getTaskAdviceFromAI(task, geminiApiKey);
      return advice;
    } catch (e: any) {
      console.error("Kesalahan mendapatkan saran tugas:", e);
      return `Gagal mendapatkan saran AI: ${e.message || 'Kesalahan tidak diketahui'}`;
    }
  }, [geminiApiKey, apiKeyMissing]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-4 sm:p-8 text-slate-100 flex flex-col items-center">
      <header className="mb-6 sm:mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 flex items-center justify-center">
          <AppTitleIcon className="w-10 h-10 sm:w-12 sm:h-12 mr-3 text-cyan-400" />
          AI Eisenhower Matrix
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">Manajer Produktivitas Pribadi Anda, ditenagai oleh Gemini</p>
      </header>

      {apiKeyMissing && (
         <div className="w-full max-w-3xl p-4 mb-6 bg-yellow-500/20 text-yellow-300 border border-yellow-600 rounded-lg flex items-center" role="alert">
            <InfoIcon className="w-6 h-6 mr-3 text-yellow-400" />
            <span>Kunci API Gemini tidak ada. Fitur AI dinonaktifkan. Harap atur variabel lingkungan VITE_GEMINI_API_KEY dalam file .env Anda.</span>
        </div>
      )}

      {error && (
        <div className="w-full max-w-3xl p-3 mb-4 bg-red-500/20 text-red-300 border border-red-600 rounded-md flex items-center justify-between" role="alert">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-200 hover:text-red-100" aria-label="Tutup pesan error">&times;</button>
        </div>
      )}
      
      <AddTaskForm onAddTask={handleAddTask} isLoading={isLoading} disabled={apiKeyMissing && tasks.length >= TOTAL_TASK_LIMIT}/>

      {isLoading && tasks.length === 0 && <div className="my-4"><LoadingSpinner text="Manajer AI sedang berpikir..." /></div>} 
      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-8">
        {Object.values(Quadrant).map(quadrantId => (
          <QuadrantColumn
            key={quadrantId}
            quadrantInfo={QUADRANT_DEFINITIONS[quadrantId]}
            tasks={tasks.filter(task => task.quadrant === quadrantId).sort((a,b) => a.createdAt - b.createdAt)}
            onMoveTask={moveTask}
            onDeleteTask={deleteTask}
            onGetTaskAdvice={getTaskAdvice}
            isLoadingAiAdvice={false} 
            isFull={tasks.filter(t => t.quadrant === quadrantId).length >= TASK_LIMIT_PER_QUADRANT}
          />
        ))}
      </div>
      
      {!apiKeyMissing && tasks.length > 0 && geminiApiKey && ( // Ensure geminiApiKey exists before rendering
        <AiOverallInsight tasks={tasks} geminiApiKey={geminiApiKey} />
      )}

      <footer className="mt-12 text-center text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} AI Eisenhower Matrix. Ditenagai oleh Gemini.</p>
        <p>Batas tugas: {TASK_LIMIT_PER_QUADRANT} per kuadran, {TOTAL_TASK_LIMIT} total.</p>
      </footer>
    </div>
  );
};

export default App;