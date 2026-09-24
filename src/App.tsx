import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Gamepad2, 
  Info,
  Calendar,
  Users,
  Monitor,
  Heart,
  Globe,
  Award,
  Clock,
  Check,
  X,
  User,
  Settings,
  Lock,
  Sparkles,
  MousePointer2,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Zap,
  Download,
  Database,
  IdCard,
  GraduationCap,
  LayoutDashboard,
  BarChart3,
  PieChart,
  Activity,
  Search,
  ChevronDown
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import { db } from './firebase';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  serverTimestamp,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  arrayUnion
} from 'firebase/firestore';

// --- Data Types ---

interface Challenge {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface DayContent {
  id: number;
  title: string;
  subtitle: string;
  rap: string;
  objective: string;
  icon: LucideIcon;
  color: string;
  activities: {
    moment: string;
    responsible: string;
    evidence: string;
  }[];
  challenges: Challenge[];
  reward: string;
}

// --- Content Data ---

const INDUCTION_DAYS: DayContent[] = [
  {
    id: 1,
    title: "Día 1: Oportunidades y Normativa",
    subtitle: "Identidad Institucional",
    rap: "Identificar la dinámica organizacional del SENA y el rol de la Formación Profesional Integral.",
    objective: "Contextualizar al aprendiz sobre la misión, visión y valores institucionales, así como las oportunidades que ofrece la entidad.",
    icon: Globe,
    color: "bg-emerald-600",
    activities: [
      { moment: "Bienvenida y Apertura", responsible: "Director Regional / Subdirector", evidence: "Registro de asistencia" },
      { moment: "Socialización de Identidad", responsible: "Instructor Líder", evidence: "Mural interactivo de valores" },
      { moment: "Recorrido por el Centro", responsible: "Bienestar / Instructores", evidence: "Mapa de ubicación" }
    ],
    challenges: [
      {
        question: "¿Cuál es el principal objetivo de la Formación Profesional Integral (FPI) en el SENA?",
        options: [
          "Solo enseñar habilidades técnicas",
          "El desarrollo humano integral del aprendiz",
          "Entregar certificados rápidamente",
          "Cobrar por servicios de capacitación"
        ],
        correctAnswer: 1
      },
      {
        question: "Según la Circular 6 de 2016, ¿qué es la inducción?",
        options: [
          "Un proceso opcional de registro",
          "Una semana de vacaciones iniciales",
          "Un proceso obligatorio de integración al entorno formativo",
          "Una reunión técnica sobre maquinaria"
        ],
        correctAnswer: 2
      }
    ],
    reward: "Insignia de Explorador Institucional"
  },
  {
    id: 2,
    title: "Día 2: TIC y Modelo Pedagógico",
    subtitle: "Aprender a Aprender",
    rap: "Gestionar la información técnica de acuerdo con los requerimientos del programa de formación.",
    objective: "Familiarizar al aprendiz con las plataformas tecnológicas (Sofía Plus, Territorium) y el modelo pedagógico basado en competencias.",
    icon: Monitor,
    color: "bg-blue-600",
    activities: [
      { moment: "Taller Sofía Plus", responsible: "Instructor TIC", evidence: "Captura de perfil actualizado" },
      { moment: "Inducción LMS Territorium", responsible: "Instructor TIC", evidence: "Primer envío de evidencia" },
      { moment: "Modelo Pedagógico", responsible: "Instructor Metodólogo", evidence: "Mapa conceptual FPI" }
    ],
    challenges: [
      {
        question: "¿Cuál es la principal plataforma para la gestión administrativa del aprendiz?",
        options: ["Facebook", "Sofía Plus", "Territorium", "WhatsApp"],
        correctAnswer: 1
      },
      {
        question: "El modelo pedagógico del SENA se centra en:",
        options: [
          "La memorización de libros",
          "El docente como única fuente de verdad",
          "El aprendizaje por competencias y proyectos",
          "Exámenes escritos diarios"
        ],
        correctAnswer: 2
      }
    ],
    reward: "Insignia de Ciudadano Digital"
  },
  {
    id: 3,
    title: "Día 3: Programa y Estilos de Aprendizaje",
    subtitle: "Ruta de Formación",
    rap: "Reconocer el perfil ocupacional y el alcance del programa de formación.",
    objective: "Analizar el diseño curricular del programa y reconocer las diversas formas de aprender del individuo.",
    icon: BookOpen,
    color: "bg-orange-500",
    activities: [
      { moment: "Análisis del Programa", responsible: "Equipo Ejecutor", evidence: "Matriz de competencias" },
      { moment: "Test de Estilos de Aprendizaje", responsible: "Psicólogo/Instructor", evidence: "Perfil de aprendizaje individual" },
      { moment: "Muestra de Proyectos", responsible: "Aprendices Antiguos", evidence: "Relatoría de experiencias" }
    ],
    challenges: [
      {
        question: "¿Qué documento describe las competencias y resultados de aprendizaje de su formación?",
        options: ["El carnet", "El Reglamento de Aprendiz", "El Diseño Curricular", "El Horario"],
        correctAnswer: 2
      },
      {
        question: "¿Qué es un Resultado de Aprendizaje (RAP)?",
        options: [
          "Una nota final",
          "Un indicador de lo que el aprendiz debe saber y hacer",
          "Una sanción disciplinaria",
          "Un día de clase"
        ],
        correctAnswer: 1
      }
    ],
    reward: "Insignia de Estratega del Aprendizaje"
  },
  {
    id: 4,
    title: "Día 4: Reglamento y Bienestar",
    subtitle: "Convivencia y Apoyo",
    rap: "Aplicar los principios y valores institucionales en su entorno social y productivo.",
    objective: "Apropiar los derechos, deberes y servicios de bienestar que el SENA ofrece para la permanencia del aprendiz.",
    icon: Heart,
    color: "bg-red-500",
    activities: [
      { moment: "Socialización Reglamento", responsible: "Coordinador Académico", evidence: "Compromiso de convivencia firmado" },
      { moment: "Feria de Bienestar", responsible: "Líder Bienestar", evidence: "Inscripción en actividades lúdicas" },
      { moment: "Taller Socioemocional", responsible: "Psicólogo", evidence: "Dinámica de grupo" }
    ],
    challenges: [
      {
        question: "¿Cuál es el tiempo máximo para justificar una inasistencia?",
        options: ["10 días hábiles", "3 días hábiles", "No es necesario justificar", "1 mes"],
        correctAnswer: 1
      },
      {
        question: "¿Qué área se encarga de los apoyos de sostenimiento y salud en el SENA?",
        options: ["Biblioteca", "Vigilancia", "Bienestar al Aprendiz", "Contabilidad"],
        correctAnswer: 2
      }
    ],
    reward: "Insignia de Ciudadano Ejemplar"
  },
  {
    id: 5,
    title: "Día 5: Compromiso e Identidad",
    subtitle: "Sentido de Pertenencia SENA",
    rap: "Asumir los deberes y derechos en el marco de la Formación Profesional Integral (FPI).",
    objective: "Consolidar el compromiso del aprendiz con la excelencia institucional y su proyecto de vida.",
    icon: Award,
    color: "bg-[#39a900]",
    activities: [
      { moment: "Gincana de Identidad", responsible: "Instructores Líderes", evidence: "Desafío de conocimientos" },
      { moment: "Cierre Pedagógico", responsible: "Coordinación Académica", evidence: "Compromiso firmado" },
      { moment: "Taller: Mi Proyecto de Vida en el SENA", responsible: "Bienestar", evidence: "Plan de acción individual" }
    ],
    challenges: [
      {
        question: "¿Qué integra la Formación Profesional Integral (FPI) en el SENA?",
        options: [
          "Solo conocimientos técnicos",
          "El ser, el saber y el hacer",
          "Únicamente el cumplimiento de horario",
          "Exclusivamente la etapa productiva"
        ],
        correctAnswer: 1
      },
      {
        question: "¿Cuál es el símbolo del SENA que representa la industria?",
        options: [
          "El Caduceo",
          "El Engranaje",
          "La Rama de Café",
          "El Escudo Rojo"
        ],
        correctAnswer: 1
      }
    ],
    reward: "Insignia de Embajador SENA"
  }
];

// --- Audio Utility ---

const playSound = (type: 'correct' | 'victory') => {
  const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  if (type === 'correct') {
    // Short high blip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'victory') {
    // Upward chime
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    osc.start(now);
    osc.stop(now + 0.6);
  } else if (type === 'error' as any) {
    // Low double blip
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }
};

// --- Regulations Data (Manual del Aprendiz) ---

const REGLAMENTO_DATA = {
  derechos: [
    { id: 1, title: "Inducción", text: "Recibir inducción integral al inicio del proceso formativo.", emoji: "🎓", icon: BookOpen },
    { id: 2, title: "Formación de Calidad", text: "Recibir formación profesional acorde con el programa.", emoji: "🌟", icon: Award },
    { id: 3, title: "Uso de Recursos", text: "Acceder a bibliotecas, laboratorios y herramientas TIC.", emoji: "🖥️", icon: Monitor },
    { id: 4, title: "Información Oportuna", text: "Conocer resultados de evaluación y retroalimentación.", emoji: "📢", icon: Info },
    { id: 5, title: "Seguridad y Salud", text: "Recibir elementos de protección personal (EPP) necesarios.", emoji: "🛡️", icon: ShieldCheck },
    { id: 6, title: "Trato Digno", text: "Ser respetado sin discriminación de ninguna índole.", emoji: "🤝", icon: Heart },
    { id: 7, title: "Debido Proceso", text: "Derecho a la defensa y contradicción en procesos.", emoji: "⚖️", icon: Scale },
    { id: 8, title: "Incentivos", text: "Postularse a apoyos, monitorías y reconocimientos.", emoji: "🏆", icon: Trophy }
  ],
  deberes: [
    { id: 1, title: "Cumplimiento", text: "Suscribir y cumplir fielmente el acta de compromiso.", emoji: "✍️", icon: ShieldCheck },
    { id: 2, title: "Identificación", text: "Portar permanentemente el carné en lugar visible.", emoji: "🆔", icon: User },
    { id: 3, title: "Respeto Institucional", text: "Respetar los símbolos y la imagen del SENA.", emoji: "🏢", icon: Globe },
    { id: 4, title: "Convivencia", text: "Tratar con respeto a toda la comunidad educativa.", emoji: "👥", icon: Users },
    { id: 5, title: "Puntualidad", text: "Asistir cumplidamente a todas las sesiones y eventos.", emoji: "⏰", icon: Clock },
    { id: 6, title: "Entrega de Evidencias", text: "Cumplir con las actividades en tiempos acordados.", emoji: "📂", icon: CheckCircle2 },
    { id: 7, title: "Cuidado de Bienes", text: "Velar por el buen estado de equipos y ambientes.", emoji: "🛠️", icon: Settings },
    { id: 8, title: "Honestidad", text: "Realizar las evaluaciones sin fraude ni plagio.", emoji: "🧐", icon: ShieldCheck }
  ],
  prohibiciones: [
    { id: 1, title: "Fraude", text: "Realizar o facilitar plagio en trabajos y pruebas.", emoji: "🚫", icon: AlertTriangle },
    { id: 2, title: "Sustancias", text: "Ingresar o consumir licor o drogas en el centro.", emoji: "📵", icon: AlertTriangle },
    { id: 3, title: "Agresión", text: "Faltar al respeto u ofender a cualquier persona.", emoji: "😠", icon: AlertTriangle },
    { id: 4, title: "Daño a Bienes", text: "Deteriorar intencionalmente la infraestructura.", emoji: "🏚️", icon: AlertTriangle }
  ],
  quiz: [
    {
      question: "¿Cuál es el tiempo máximo para justificar una inasistencia?",
      options: ["5 días hábiles", "3 días hábiles", "No se justifica", "Al final del mes"],
      correctAnswer: 1,
      feedback: "¡Muy bien! Según el Artículo 31, tienes 3 días hábiles para presentar soportes.",
      reinforcement: "Recuerda: El Artículo 31 establece que las inasistencias fortuitas deben justificarse con soportes médicos o legales máximo a los 3 días hábiles."
    },
    {
      question: "¿Es obligación del aprendiz portar el carné institucional?",
      options: ["Solo para entrar", "Sí, en lugar visible", "No, es opcional", "Solo si el instructor pide"],
      correctAnswer: 1,
      feedback: "¡Correcto! Es un deber fundamental (Art. 8, num 2) para tu identificación.",
      reinforcement: "Atención: El Artículo 8 indica que portar el carné en lugar visible es obligatorio para la seguridad y control de todos."
    },
    {
      question: "¿Qué pasa si un aprendiz comete plagio en una evidencia?",
      options: ["Nada, se repite", "Es una falta disciplinaria", "Se le regaña", "Se le quita el carné"],
      correctAnswer: 1,
      feedback: "Exacto. El fraude académico se considera una prohibición grave (Art. 10).",
      reinforcement: "Importante: El Artículo 10 prohíbe el plagio. Esto puede llevar a sanciones graves que afectan tu hoja de vida académica."
    },
    {
      question: "¿Tengo derecho a recibir elementos de protección (EPP)?",
      options: ["Sí, para mi seguridad", "No, debo comprarlos", "Solo si sobran", "Depende del presupuesto"],
      correctAnswer: 0,
      feedback: "¡Correcto! El SENA debe proveer los EPP necesarios para tu formación.",
      reinforcement: "El Artículo 5, numeral 5, consagra como derecho recibir oportunamente los elementos de seguridad para tu integridad física."
    }
  ]
};

// --- Components ---

const ManualInteractivo = ({ 
  isRegistered, 
  setShowRegistrationModal, 
  setScore,
  setRegistrationAction 
}: { 
  isRegistered: boolean, 
  setShowRegistrationModal: (v: boolean) => void, 
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setRegistrationAction: (v: (() => void) | null) => void
}) => {
  const [activeTab, setActiveTab] = useState<'derechos' | 'deberes' | 'quiz' | 'prohibiciones'>('derechos');
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean, msg: string } | null>(null);

  const handleQuizAnswer = (idx: number) => {
    if (!isRegistered) {
      setRegistrationAction(() => () => handleQuizAnswer(idx));
      setShowRegistrationModal(true);
      return;
    }
    const isCorrect = idx === REGLAMENTO_DATA.quiz[quizIdx].correctAnswer;
    setQuizFeedback({
      isCorrect,
      msg: isCorrect ? REGLAMENTO_DATA.quiz[quizIdx].feedback : REGLAMENTO_DATA.quiz[quizIdx].reinforcement
    });
    if (isCorrect) {
      playSound('correct');
      // Special reward for manual quiz
      if (quizIdx === REGLAMENTO_DATA.quiz.length - 1) {
        setScore(prev => prev + 50);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#39a900', '#ffffff']
        });
      }
    }
    else playSound('error' as any);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
      {/* Decorative SVG Patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="absolute -top-24 -right-24 w-96 h-96 text-emerald-500/20" fill="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" strokeDasharray="5,5" fill="none" />
        </svg>
        <svg className="absolute -bottom-12 -left-12 w-64 h-64 text-blue-500/10" fill="currentColor" viewBox="0 0 100 100">
          <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="1" fill="none" rotate="45" />
        </svg>
      </div>

      <div className="relative z-10 p-8 border-b border-white/5 flex flex-wrap gap-6 items-center justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white text-xl font-black">Manual del Aprendiz</h4>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-md uppercase tracking-wider">Acuerdo 009 de 2024</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <p className="text-[10px] text-slate-400 font-bold uppercase">SENA Institucional</p>
            </div>
          </div>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl backdrop-blur-md border border-white/5">
          {(['derechos', 'deberes', 'prohibiciones', 'quiz'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setQuizFeedback(null); }}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black transition-all capitalize flex items-center gap-2 ${
                activeTab === tab ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'derechos' && <ShieldCheck className="w-3 h-3" />}
              {tab === 'deberes' && <CheckCircle2 className="w-3 h-3" />}
              {tab === 'prohibiciones' && <AlertTriangle className="w-3 h-3" />}
              {tab === 'quiz' && <Zap className="w-3 h-3" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 p-8 min-h-[450px]">
        <AnimatePresence mode="wait">
          {activeTab !== 'quiz' ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {(activeTab === 'derechos' ? REGLAMENTO_DATA.derechos : 
                activeTab === 'deberes' ? REGLAMENTO_DATA.deberes : 
                REGLAMENTO_DATA.prohibiciones).map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id}
                  className={`bg-white/5 backdrop-blur-md border p-6 rounded-3xl flex items-start gap-5 transition-all group hover:scale-[1.02] ${
                    activeTab === 'prohibiciones' ? 'border-red-500/20 hover:bg-red-500/10' : 'border-white/10 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform shrink-0 ${
                    activeTab === 'prohibiciones' ? 'bg-red-500/20' : 'bg-gradient-to-br from-emerald-500/20 to-blue-500/20 shadow-inner'
                  }`}>
                    {item.emoji}
                  </div>
                  <div>
                    <h5 className="text-white font-black text-base mb-1.5 group-hover:text-emerald-400 transition-colors">{item.title}</h5>
                    <p className="text-slate-400 text-xs leading-relaxed font-medium">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto py-4"
            >
              {/* Quiz Progress Bar */}
              <div className="flex items-center gap-4 mb-10">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((quizIdx) / REGLAMENTO_DATA.quiz.length) * 100}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{quizIdx + 1} / {REGLAMENTO_DATA.quiz.length}</span>
              </div>

              {!quizFeedback ? (
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-orange-500/20 text-orange-500 mb-2 border border-orange-500/20"
                    >
                      <Zap className="w-8 h-8" />
                    </motion.div>
                    <h4 className="text-white text-2xl font-black leading-tight">{REGLAMENTO_DATA.quiz[quizIdx].question}</h4>
                  </div>
                  <div className="grid gap-4">
                    {REGLAMENTO_DATA.quiz[quizIdx].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white text-sm font-bold text-left hover:bg-emerald-500 hover:border-emerald-400 transition-all active:scale-[0.98] flex items-center justify-between group"
                      >
                        {opt}
                        <div className="w-6 h-6 rounded-full border-2 border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white/20 transition-all">
                          <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">✓</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 30, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  className={`p-10 rounded-[2.5rem] text-center border-2 shadow-2xl relative overflow-hidden ${
                    quizFeedback.isCorrect ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-red-500/10 border-red-500/50'
                  }`}
                >
                  <div className={`w-24 h-24 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-5xl shadow-xl ${
                    quizFeedback.isCorrect ? 'bg-emerald-500 text-white animate-bounce' : 'bg-red-500 text-white animate-shake'
                  }`}>
                    {quizFeedback.isCorrect ? '✨' : '⚠️'}
                  </div>
                  <h3 className={`text-3xl font-black mb-6 ${quizFeedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    {quizFeedback.isCorrect ? '¡Excelente!' : 'Refuerzo Pedagógico'}
                  </h3>
                  <div className="bg-black/40 backdrop-blur-md p-6 rounded-[1.5rem] mb-10 border border-white/5">
                    <p className="text-white font-medium leading-relaxed italic text-base">
                      "{quizFeedback.msg}"
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (quizFeedback.isCorrect && quizIdx < REGLAMENTO_DATA.quiz.length - 1) {
                        setQuizIdx(quizIdx + 1);
                      } else {
                        setQuizIdx(0);
                      }
                      setQuizFeedback(null);
                    }}
                    className={`w-full py-5 rounded-[1.25rem] font-black text-sm transition-all shadow-xl ${
                      quizFeedback.isCorrect ? 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-[1.02]' : 'bg-slate-700 text-white hover:bg-slate-600 hover:scale-[1.02]'
                    }`}
                  >
                    {quizFeedback.isCorrect ? (quizIdx < REGLAMENTO_DATA.quiz.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Reiniciar') : 'Intentar de Nuevo'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative z-10 p-5 bg-black/40 text-center border-t border-white/5">
        <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Estrategia Pedagógica SENA • Acuerdo 009 de 2024 • Trazabilidad Firestore
        </p>
      </div>
    </div>
  );
};

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-12 h-12">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          className="text-slate-100"
          strokeWidth="3.5"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
        <motion.circle
          className="text-[#39a900]"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="24"
          cy="24"
        />
      </svg>
      <span className="absolute text-[9px] font-black text-slate-800">{Math.round(percentage)}%</span>
    </div>
  );
};

const Leaderboard = ({ userScore, userName, userAvatar }: { userScore: number, userName: string, userAvatar: string }) => {
  const simulatedUsers = [
    { name: "Carlos Rodríguez", points: 240, avatar: "CR", color: "bg-amber-100 text-amber-700" },
    { name: "Ana María Silva", points: 210, avatar: "AS", color: "bg-slate-100 text-slate-700" },
    { name: "Juan David Pérez", points: 190, avatar: "JP", color: "bg-orange-100 text-orange-700" },
    { name: userName, points: userScore, avatar: userAvatar, color: "bg-emerald-100 text-emerald-700", isUser: true, isCustomAvatar: true },
    { name: "Valentina Gómez", points: 140, avatar: "VG", color: "bg-slate-50 text-slate-500" },
  ].sort((a, b) => b.points - a.points);

  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4 text-orange-500" />
          Clasificación
        </h4>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">En tiempo real</span>
      </div>
      <div className="p-2 space-y-1">
        {simulatedUsers.map((user, idx) => (
          <div 
            key={user.name} 
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
              user.isUser ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-black w-4 ${idx === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                {idx + 1}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${user.color}`}>
                {user.avatar}
              </div>
              <span className={`text-sm font-bold truncate max-w-[100px] ${user.isUser ? 'text-emerald-700' : 'text-slate-700'}`}>
                {user.name}
              </span>
            </div>
            <span className={`text-xs font-black ${user.isUser ? 'text-emerald-600' : 'text-slate-500'}`}>
              {user.points} <span className="text-[8px] opacity-60">pts</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressBadge = ({ current, total }: { current: number, total: number }) => (
  <div className="flex items-center gap-2 mb-6">
    {Array.from({ length: total }).map((_, i) => (
      <div 
        key={i} 
        className={`h-2 flex-1 rounded-full transition-all duration-500 ${
          i < current ? 'bg-orange-500' : 'bg-gray-200'
        }`}
      />
    ))}
  </div>
);

const RegistrationScreen = ({ onRegister }: { onRegister: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    program: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.document || !formData.program) return;
    
    setLoading(true);
    const apprenticeId = `SENA_${formData.document}_${Date.now()}`;
    const data = {
      ...formData,
      id: apprenticeId,
      totalScore: 0,
      completedDays: [],
      createdAt: serverTimestamp(),
      avatar: "👨‍🎓"
    };

    try {
      await setDoc(doc(db, "apprentices", apprenticeId), data);
      localStorage.setItem('apprentice_id', apprenticeId);
      onRegister(data);
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="regGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#39a900" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#regGrid)" />
         </svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-slate-100"
      >
        <div className="bg-[#39a900] p-10 text-center text-white relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <GraduationCap className="w-32 h-32 rotate-12" />
          </div>
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
             <img 
                src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%201000%201000%27%3e%3cpath%20fill=%27%2339a900%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3c/svg%3e" 
                alt="SENA Logo" 
                className="w-14 h-14 object-contain"
              />
          </div>
          <h2 className="text-4xl font-black mb-3">Portal de Inducción</h2>
          <p className="opacity-80 font-bold uppercase text-xs tracking-[0.3em]">SENA • Identidad Institucional</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-8 bg-white">
          <div className="space-y-2.5">
            <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
              <User className="w-3.5 h-3.5" /> Nombre Completo
            </label>
            <input 
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
              <IdCard className="w-3 h-3" /> Documento de Identidad
            </label>
            <input 
              required
              type="text"
              value={formData.document}
              onChange={(e) => setFormData({...formData, document: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
              placeholder="N° Identificación"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase flex items-center gap-2">
              <GraduationCap className="w-3 h-3" /> Programa de Formación
            </label>
            <input 
              required
              type="text"
              value={formData.program}
              onChange={(e) => setFormData({...formData, program: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
              placeholder="Ej: ADSO, Gestión Humana..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Database className="w-5 h-5" />
                Registrarse en el Repositorio
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-slate-400 font-bold uppercase leading-tight">
            Tus datos serán almacenados para el seguimiento de tu proceso de inducción institucional.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [apprenticeData, setApprenticeData] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const [userName, setUserName] = useState("Aprendiz SENA");
  const [userAvatar, setUserAvatar] = useState("👨‍🎓");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [showRepository, setShowRepository] = useState(false);
  const [repoData, setRepoData] = useState<any[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminData, setAdminData] = useState<any[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalApprentices: 0,
    avgScore: 0,
    totalCompletions: 0,
  mostDifficultDay: 0
  });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationAction, setRegistrationAction] = useState<(() => void) | null>(null);

  // Recovery effect
  useEffect(() => {
    const recoverApprentice = async () => {
      const storedId = localStorage.getItem('apprentice_id');
      if (storedId) {
        try {
          const docRef = doc(db, "apprentices", storedId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setApprenticeData(data);
            setIsRegistered(true);
            setUserName(data.name);
            setUserAvatar(data.avatar || "👨‍🎓");
            setScore(data.totalScore || 0);
            setCompletedDays(data.completedDays || []);
          }
        } catch (error) {
          console.error("Error recovering data:", error);
        }
      }
      setLoading(false);
    };
    recoverApprentice();
  }, []);

  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const q = query(collection(db, "apprentices"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const apprentices: any[] = [];
      let totalPoints = 0;
      let totalCompleted = 0;

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        // Fetch evaluations for each apprentice for deeper analytics
        const evalsQ = query(collection(db, "apprentices", doc.id, "evaluation_results"));
        const evalsSnap = await getDocs(evalsQ);
        const evaluations = evalsSnap.docs.map(e => e.data());
        
        apprentices.push({ 
          id: doc.id, 
          ...data,
          evaluations 
        });
        
        totalPoints += data.totalScore || 0;
        if ((data.completedDays || []).length >= 5) totalCompleted++;
      }

      setAdminStats({
        totalApprentices: apprentices.length,
        avgScore: apprentices.length > 0 ? Math.round(totalPoints / apprentices.length) : 0,
        totalCompletions: totalCompleted,
        mostDifficultDay: 4 // Hardcoded for demo, but could be calculated
      });
      setAdminData(apprentices);
      setShowAdminPanel(true);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setAdminLoading(false);
    }
  };

  const fetchRepoData = async () => {
    if (!apprenticeData?.id) return;
    try {
      const { getDocs, query, orderBy } = await import('firebase/firestore');
      const q = query(collection(db, "apprentices", apprenticeData.id, "evaluation_results"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      setRepoData(results);
      setShowRepository(true);
    } catch (error) {
      console.error("Error fetching repo:", error);
    }
  };

  const avatars = ["👨‍🎓", "👩‍🎓", "🧑‍💻", "👩‍💻", "🚀", "💡", "🌟", "🛠️"];

  const currentDay = INDUCTION_DAYS[currentDayIndex];

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(57, 169, 0); // SENA Green
    doc.text('Resumen de Logros - Inducción SENA', 20, 25);
    
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Aprendiz: ${userName}`, 20, 40);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 48);
    
    // Divider
    doc.setDrawColor(200);
    doc.line(20, 55, 190, 55);
    
    // Stats
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Estadísticas Generales', 20, 70);
    
    doc.setFontSize(12);
    doc.text(`Puntos Totales: ${score} pts`, 30, 80);
    doc.text(`Jornadas Completadas: ${completedDays.length} de ${INDUCTION_DAYS.length}`, 30, 88);
    doc.text(`Nivel alcanzado: ${completedDays.length >= 5 ? 'Embajador SENA (Nivel Máximo)' : 'Aprendiz en Formación'}`, 30, 96);
    
    // Badges Section
    doc.setFontSize(16);
    doc.text('Gabinete de Insignias', 20, 115);
    
    let yPos = 125;
    INDUCTION_DAYS.forEach((day) => {
      const isUnlocked = completedDays.includes(day.id);
      doc.setFontSize(12);
      if (isUnlocked) {
        doc.setTextColor(57, 169, 0);
        doc.text(`[LOGRADA] ${day.reward}`, 30, yPos);
      } else {
        doc.setTextColor(180);
        doc.text(`[PENDIENTE] ${day.reward}`, 30, yPos);
      }
      yPos += 10;
    });
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Esta es una certificación digital de progreso en la etapa de inducción.', 20, 275);
    doc.text('Servicio Nacional de Aprendizaje - SENA', 20, 282);
    
    doc.save(`Logros_SENA_${userName.replace(/\s+/g, '_')}.pdf`);
  };

  // Welcome Tour Effect
  React.useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  // Timer Effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showChallenge && timeLeft > 0 && !showReward && !isAnswering) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && showChallenge && !isAnswering) {
      handleAnswer(-1); // Fail question if time runs out
    }
    return () => clearInterval(timer);
  }, [showChallenge, timeLeft, showReward, isAnswering]);

  const handleNextDay = () => {
    if (currentDayIndex < INDUCTION_DAYS.length - 1) {
      setCurrentDayIndex(prev => prev + 1);
      setShowChallenge(false);
      setCurrentChallengeIndex(0);
      setTimeLeft(20);
    }
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 1);
      setShowChallenge(false);
      setCurrentChallengeIndex(0);
      setTimeLeft(20);
    }
  };

  const handleStartChallenge = () => {
    if (!isRegistered) {
      setRegistrationAction(() => () => {
        setShowChallenge(true);
        setTimeLeft(20);
      });
      setShowRegistrationModal(true);
    } else {
      setShowChallenge(true);
      setTimeLeft(20);
    }
  };

  const handleAnswer = async (optionIndex: number) => {
    if (isAnswering) return;
    
    setIsAnswering(true);
    setSelectedOption(optionIndex);

    const isCorrect = optionIndex === currentDay.challenges[currentChallengeIndex].correctAnswer;
    
    // Repository Logic: Add entry for each answer
    if (apprenticeData?.id) {
       addDoc(collection(db, "apprentices", apprenticeData.id, "evaluation_results"), {
         dayId: currentDay.id,
         questionIdx: currentChallengeIndex,
         question: currentDay.challenges[currentChallengeIndex].question,
         givenAnswer: optionIndex === -1 ? "TIEMPO AGOTADO" : currentDay.challenges[currentChallengeIndex].options[optionIndex],
         isCorrect,
         timestamp: serverTimestamp()
       });
    }

    if (isCorrect) {
      const newScore = score + 10;
      setScore(newScore);
      playSound('correct');
      // Update score in Firestore
      if (apprenticeData?.id) {
        updateDoc(doc(db, "apprentices", apprenticeData.id), { totalScore: newScore });
      }
    }

    // Delay to show feedback
    setTimeout(async () => {
      if (currentChallengeIndex < currentDay.challenges.length - 1) {
        setCurrentChallengeIndex(prev => prev + 1);
        setTimeLeft(20); // Reset timer for next question
        setSelectedOption(null);
        setIsAnswering(false);
      } else {
        const newCompletedDays = [...new Set([...completedDays, currentDay.id])];
        setCompletedDays(newCompletedDays);
        setShowReward(true);
        playSound('victory');

        // Update completed days in Firestore
        if (apprenticeData?.id) {
          updateDoc(doc(db, "apprentices", apprenticeData.id), { 
            completedDays: newCompletedDays 
          });
        }
        
        // Trigger Confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39a900', '#fbbf24', '#ffffff']
        });

        setTimeout(() => setShowReward(false), 3000);
        setShowChallenge(false);
        setSelectedOption(null);
        setIsAnswering(false);
      }
    }, 1000);
  };

  const updateAvatar = async (newAvatar: string) => {
    setUserAvatar(newAvatar);
    if (apprenticeData?.id) {
      await updateDoc(doc(db, "apprentices", apprenticeData.id), { avatar: newAvatar });
    }
  };

  const updateName = async (newName: string) => {
    setUserName(newName);
    if (apprenticeData?.id) {
      await updateDoc(doc(db, "apprentices", apprenticeData.id), { name: newName });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white text-[#2f2f2f] selection:bg-emerald-100 relative overflow-x-hidden"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      {/* Institutional Scrolling Banner */}
      <div className="bg-gradient-to-r from-[#00322d] via-[#39a900] to-[#00322d] text-white overflow-hidden whitespace-nowrap py-2 relative z-[110] border-b border-white/10 shadow-lg select-none">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="inline-block"
        >
          <div className="inline-flex items-center">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className="flex items-center gap-4 px-8">
                  <div className="flex -space-x-3">
                    <div className="w-7 h-7 rounded-full border-2 border-white/50 overflow-hidden shadow-md bg-emerald-100">
                      <img src="/src/assets/images/sena_robotics_workshop_1790276751532.jpg" alt="Robotics" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white/50 overflow-hidden shadow-md bg-emerald-100">
                      <img src="/src/assets/images/sena_teamwork_collaboration_1790276762946.jpg" alt="Collaboration" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white/50 overflow-hidden shadow-md bg-emerald-100">
                      <img src="/src/assets/images/sena_digital_technology_1790276774445.jpg" alt="Digital" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.2em] flex items-center gap-3 text-white drop-shadow-sm">
                    SENA Regional Huila
                    <span className="text-white/30 font-light mx-1">|</span>
                    Centro de la Industria, la Empresa y los Servicios
                    <span className="text-white/30 font-light mx-1">|</span>
                    Inducción 2024
                  </span>
                </div>
                <span className="text-[10px] font-bold text-yellow-300/90 uppercase tracking-[0.3em] px-8 border-l border-white/20 italic flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Identidad • Integridad • Excelencia
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Global Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="senaGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#39a900" strokeWidth="0.5"/>
                <circle cx="0" cy="0" r="1.5" fill="#39a900" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#senaGrid)" />
         </svg>
      </div>

      {/* Floating Decorative Banners */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -left-12 w-48 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 opacity-20 hidden xl:block"
        >
          <img src="/src/assets/images/sena_industrial_training_1790279224514.jpg" className="w-full h-full object-cover" alt="Industrial" />
        </motion.div>

        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] -right-12 w-56 h-72 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/40 opacity-20 hidden xl:block"
        >
          <img src="/src/assets/images/sena_coffee_agriculture_1790279242081.jpg" className="w-full h-full object-cover" alt="Agriculture" />
        </motion.div>

        <motion.div 
          animate={{ 
            x: [0, 10, 0],
            y: [0, -15, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-[10%] left-[10%] w-40 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 opacity-10 hidden 2xl:block"
        >
          <img src="/src/assets/images/sena_gastronomy_training_1790279255183.jpg" className="w-full h-full object-cover" alt="Gastronomy" />
        </motion.div>
      </div>

      {/* Navbar */}
      <nav className="relative bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-[64px] h-[64px] flex items-center justify-center p-1">
              <img 
                src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%201000%201000%27%3e%3cpath%20fill=%27%2339a900%27%20d=%27M504.2,20.5c-58.3,0.1-105.6,47.4-105.5,105.8c0.1,58.3,47.4,105.6,105.7,105.6%20c58.3,0,105.6-47.3,105.6-105.7V126C609.9,67.6,562.6,20.4,504.2,20.5z%20M155.6,264.6c-18.6,0.1-37.5,1.1-55.2,5.6%20c-11.7,3-23,7.8-30.3,15.4c-9.2,9.5-10.4,22.3-5.9,33.3c4,9.7,14.8,16.9,26.8,21.1c25.9,8.9,54.6,10.7,81.8,16.3%20c5,1.2,10.6,2.6,13.7,6c3.2,4.1,1.3,9.7-4,12.2c-8.8,4.5-20.1,4.5-30.4,4.4c-9.4-0.4-19.7-1.2-27.2-5.9c-5.5-3.4-6.5-9.1-5.2-14.1%20l-60.6,0c-0.2,9.2,1.6,18.9,8.4,26.8c5.6,6.8,14.8,11.5,24.6,14.4c15.7,4.6,32.7,6,49.4,6.4c22.7,0.4,45.8-0.3,67.6-5.4%20c13-3.2,25.8-8.3,34.1-16.6c14.8-14.8,11.3-38.3-8.3-49.8c-9.8-5.7-21.5-9.2-33.4-11.5c-17.5-3.6-35.3-6.3-52.9-9.2%20c-6.2-1.2-12.8-2.3-18-5.2c-5.5-2.9-5.9-9.8-0.3-12.9c7.2-4.1,16.8-4,25.4-4c9.1,0.2,19,0.7,26.5,5c4.2,2.3,5.9,6.3,5.9,10.1%20l57.6-0.1c-0.2-7.3-1.6-14.9-6.9-21.2c-6.2-7.8-17.1-12.7-28.3-15.5C192.8,265.6,174.1,264.7,155.6,264.6L155.6,264.6z%20M280.6,268.9%20l0,137.7l168.1,0l0-30H342.3v-26.7h94.9v-29.3h-94.9l0-21.9l102.6,0l-0.1-29.7L280.6,268.9z%20M557.5,269c0,0-51.9,0-77.9,0l0,137.7%20l59,0l0-92.7l80.8,92.6l81,0.1l0-137.7l-59.1,0l0.1,92L557.5,269z%20M805.6,269.2c0,0-63.6,91.9-95.6,137.7l61.9,0l14.9-24.8h95.7%20l13.9,24.9l68.8,0L874,269.2L805.6,269.2z%20M836.6,302.1l29.4,49.9l-60.7,0.1L836.6,302.1z%20M10.6,445.6l0.5,75l280.1-1%20c14.3,3.1,22.6,12.4,19.7,33.5L138.6,854.7l56.1,52.5l266.9-461.6L10.6,445.6z%20M545.2,446.2l262.4,459.6l58-52.1L691.3,552.9%20c-2.9-21.2,5.4-30.6,19.7-33.7l280.2,1l-0.1-73.7L545.2,446.2z%20M500.9,522.3L254.8,944.7l65.4,31.9L484.4,699%20c5.7-4.6,11.4-7.1,17.1-7.3c6-0.2,12.2,2,18.3,6.8l163.8,278.4l67.4-35.2L500.9,522.3z%27/%3e%3c/svg%3e" 
                alt="SENA Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block" />
            <div>
              <h1 className="font-bold text-[#39a900] text-xl leading-tight tracking-tight">SENA Colombia</h1>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">Huila • Industria y Servicios</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <CircularProgress percentage={(completedDays.length / INDUCTION_DAYS.length) * 100} />
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Puntos Acumulados</span>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-lg font-black text-slate-800 tabular-nums">{score}</span>
              </div>
            </div>
            
            <button 
              onClick={fetchAdminData}
              className="p-2.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-full transition-all group relative border border-slate-200 hover:border-emerald-200"
              title="Panel Administrativo"
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            <button 
              id="profile-button"
              onClick={() => setShowAchievements(true)}
              className="flex items-center gap-3 bg-[#39a900] hover:bg-[#2d8600] p-1.5 pr-4 rounded-full transition-all shadow-md shadow-emerald-600/10 group"
            >
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
                {userAvatar}
              </div>
              <span className="text-sm font-bold text-white hidden sm:inline">{userName}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-14 flex flex-col md:flex-row md:items-stretch justify-between gap-10">
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-6 border border-emerald-100 self-start"
            >
              <Calendar className="w-3.5 h-3.5" />
              Circular 6 de 2016 • Estrategia 2024
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.95]">
              Ruta de Inmersión <br/> <span className="text-[#39a900]">Integral del Aprendiz</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed mb-8">
              Bienvenido a tu proceso de integración al SENA. Una experiencia gamificada diseñada para que explores, aprendas y te empoderes de tu futuro profesional.
            </p>
            <div className="flex items-center gap-4">
               <button 
                onClick={() => {
                  const el = document.getElementById('induction-cards');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-[#39a900] text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-[#2d8600] transition-all"
               >
                 Comenzar Ruta
               </button>
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 overflow-hidden shadow-sm">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-50 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm">
                    +2k
                  </div>
               </div>
               <p className="text-xs text-slate-400 font-medium">Aprendices <br/> en línea ahora</p>
            </div>
          </div>
          <div className="flex-1 relative">
             <div className="aspect-video md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="/src/assets/images/sena_hero_banner_1790277044261.jpg" 
                  alt="SENA Hero" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00322d]/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                   <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-12 h-12 bg-[#39a900] rounded-2xl flex items-center justify-center text-white shadow-lg ring-4 ring-white/10">
                         <Trophy className="w-6 h-6" />
                      </div>
                      <header className="space-y-1">
                         <h3 className="text-white font-black text-2xl tracking-tighter leading-none">Inducción 2024</h3>
                         <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.4em]">Excelencia • Liderazgo • FPI</p>
                      </header>
                   </div>
                </div>
             </div>
             {/* Floating Badge */}
             <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-2xl border-4 border-white rotate-12 z-20"
             >
                <div className="text-center">
                   <p className="text-[10px] font-black text-yellow-900 uppercase leading-none">100%</p>
                   <p className="text-[10px] font-black text-yellow-900 uppercase leading-none">Gratis</p>
                </div>
             </motion.div>

             {/* Secondary Floating Card */}
             <motion.div 
               animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -bottom-10 -left-10 w-48 bg-white p-3 rounded-2xl shadow-2xl border border-slate-100 z-20 hidden lg:block"
             >
                <div className="rounded-xl overflow-hidden aspect-video mb-2">
                   <img src="/src/assets/images/sena_robotics_workshop_1790276751532.jpg" alt="Workshop" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <p className="text-[9px] font-black text-slate-800 uppercase">Ambientes de Tecnología</p>
                </div>
             </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Navigation Sidebar (Desktop) */}
          <div id="sidebar-nav" className="md:col-span-3 space-y-2">
            {INDUCTION_DAYS.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => {
                  setCurrentDayIndex(idx);
                  setShowChallenge(false);
                  setCurrentChallengeIndex(0);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all border flex items-center gap-3 group ${
                  currentDayIndex === idx 
                    ? `${day.color} text-white shadow-lg border-transparent ring-4 ring-offset-2 ring-slate-50` 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${currentDayIndex === idx ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'}`}>
                  <day.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase opacity-70">Día {day.id}</p>
                  <p className="font-bold text-sm truncate">{day.subtitle}</p>
                </div>
                {completedDays.includes(day.id) && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                )}
              </button>
            ))}
            
            <Leaderboard userScore={score} userName={userName} userAvatar={userAvatar} />

            <button
              onClick={fetchRepoData}
              className="w-full mt-4 p-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all border border-white/10"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              Ver Repositorio Digital
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-9 relative z-10">
            <AnimatePresence mode="wait">
              {!showChallenge ? (
                <motion.div
                  key={`content-${currentDayIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                  <div className={`h-2 ${currentDay.color}`} />
                  
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{currentDay.title}</h3>
                        <p className="text-slate-500 font-medium">{currentDay.subtitle}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${currentDay.color}`}>
                          <currentDay.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Objetivo RAP</p>
                          <p className="text-xs font-semibold text-slate-700 max-w-[200px] line-clamp-2">
                            {currentDay.rap}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Ficha Técnica Detail */}
                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-slate-800">
                          <Info className="w-4 h-4 text-emerald-500" />
                          Contexto del Día
                        </h4>
                        <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                          <p className="text-emerald-900 leading-relaxed italic">
                            "{currentDay.objective}"
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-bold text-slate-800">
                          <Award className="w-4 h-4 text-orange-500" />
                          Recompensa Disponible
                        </h4>
                        <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 text-center">
                          <div className="w-16 h-16 bg-white rounded-full shadow-inner mx-auto mb-3 flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-orange-400" />
                          </div>
                          <p className="text-orange-900 font-bold">{currentDay.reward}</p>
                        </div>
                      </div>
                    </div>

                    {/* Manual Interactivo de Reglamento (Día 4 Especial) */}
                    {currentDay.id === 4 && (
                      <div className="mb-10">
                        <ManualInteractivo 
                          isRegistered={isRegistered} 
                          setShowRegistrationModal={setShowRegistrationModal}
                          setScore={setScore}
                          setRegistrationAction={setRegistrationAction}
                        />
                      </div>
                    )}

                    {/* Sequence Table */}
                    <div className="mb-10">
                      <h4 className="font-bold text-slate-800 mb-4 px-1">Secuencia de Actividades</h4>
                      <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Momento</th>
                              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Responsable</th>
                              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Evidencia</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {currentDay.activities.map((act, i) => (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-slate-700">{act.moment}</td>
                                <td className="p-4 text-sm text-slate-600">{act.responsible}</td>
                                <td className="p-4 text-sm">
                                  <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                                    {act.evidence}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={handleStartChallenge}
                      className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${currentDay.color}`}
                    >
                      <Gamepad2 className="w-6 h-6" />
                      Iniciar Evaluación Gamificada
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`challenge-${currentDayIndex}-${currentChallengeIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 min-h-[500px] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <button 
                      onClick={() => setShowChallenge(false)}
                      className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-bold text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Volver a la guía
                    </button>
                    <div className="flex items-center gap-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-sm ${timeLeft < 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                        <Clock className="w-4 h-4" />
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Reto {currentChallengeIndex + 1} de {currentDay.challenges.length}</p>
                        <ProgressBadge current={currentChallengeIndex + 1} total={currentDay.challenges.length} />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-2xl font-black text-slate-900 mb-8 leading-tight">
                      {currentDay.challenges[currentChallengeIndex].question}
                    </h4>

                    <div className="grid gap-4">
                      {currentDay.challenges[currentChallengeIndex].options.map((option, idx) => {
                        const isCorrect = idx === currentDay.challenges[currentChallengeIndex].correctAnswer;
                        const isSelected = idx === selectedOption;
                        
                        let buttonStyles = "border-slate-100 hover:border-orange-500 hover:bg-orange-50";
                        let iconStyles = "bg-slate-50 group-hover:bg-orange-500 group-hover:text-white";
                        
                        if (isAnswering) {
                          if (isCorrect) {
                            buttonStyles = "border-emerald-500 bg-emerald-50 text-emerald-900";
                            iconStyles = "bg-emerald-500 text-white";
                          } else if (isSelected) {
                            buttonStyles = "border-red-500 bg-red-50 text-red-900";
                            iconStyles = "bg-red-500 text-white";
                          } else {
                            buttonStyles = "border-slate-100 opacity-50";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isAnswering}
                            onClick={() => handleAnswer(idx)}
                            className={`w-full p-5 text-left rounded-2xl border-2 transition-all font-bold text-slate-700 flex items-center justify-between group ${buttonStyles}`}
                          >
                            {option}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${iconStyles}`}>
                              {isAnswering && isCorrect ? (
                                <Check className="w-5 h-5" />
                              ) : isAnswering && isSelected ? (
                                <X className="w-5 h-5" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Footer */}
            <div className="mt-8 flex items-center justify-between">
              <button
                disabled={currentDayIndex === 0}
                onClick={handlePrevDay}
                className="flex items-center gap-2 font-bold text-slate-500 disabled:opacity-0 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </button>
              <button
                disabled={currentDayIndex === INDUCTION_DAYS.length - 1}
                onClick={handleNextDay}
                className="flex items-center gap-2 font-bold text-slate-800 hover:text-orange-600 transition-colors"
              >
                Siguiente Jornada
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Reward Overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-orange-400 text-center pointer-events-auto relative overflow-hidden">
              {/* Background Shine */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-10 pointer-events-none"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-transparent via-orange-500 to-transparent rotate-45" />
              </motion.div>

              <motion.div
                initial={{ y: 20, scale: 0 }}
                animate={{ 
                  y: [0, -40, 0],
                  scale: [1, 1.2, 1],
                  rotate: [0, -5, 5, -5, 0]
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-orange-400 blur-2xl opacity-20 rounded-full" />
                <Trophy className="w-24 h-24 text-orange-500 mx-auto relative z-10" />
              </motion.div>

              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black text-slate-900 mb-2"
              >
                ¡Reto Superado!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-slate-600 font-bold mb-4"
              >
                Has obtenido la <span className="text-orange-600">{currentDay.reward}</span>
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="bg-orange-50 px-6 py-3 rounded-full inline-flex items-center gap-3 text-orange-700 font-black shadow-sm"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                +20 puntos de formación
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAchievements(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-orange-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-orange-500" />
                    Mis Logros
                  </h3>
                  <p className="text-slate-500 font-medium">Progreso de Inducción de {userName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={exportToPDF}
                    className="p-2 hover:bg-emerald-50 rounded-xl transition-colors text-emerald-600 border border-emerald-100"
                    title="Exportar PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      setShowAchievements(false);
                      setShowProfileModal(true);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    title="Editar Perfil"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button onClick={() => setShowAchievements(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
                  <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Días Completados</p>
                  <p className="text-3xl font-black text-orange-600">{completedDays.length} / {INDUCTION_DAYS.length}</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                  <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-1">Puntos Totales</p>
                  <p className="text-3xl font-black text-emerald-600">{score}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                  <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Nivel Actual</p>
                  <p className="text-3xl font-black text-blue-600">{completedDays.length >= 5 ? 'Embajador' : 'Aprendiz'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 px-1">Gabinete de Insignias</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {INDUCTION_DAYS.map((day, idx) => {
                    const isUnlocked = completedDays.includes(day.id);
                    return (
                      <motion.div 
                        key={day.id}
                        initial={isUnlocked ? { scale: 0.8, opacity: 0, y: 20 } : { opacity: 0.5 }}
                        animate={isUnlocked ? { scale: 1, opacity: 1, y: 0 } : { opacity: 0.5 }}
                        whileHover={isUnlocked ? { y: -8, scale: 1.05 } : {}}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 10,
                          delay: idx * 0.1
                        }}
                        className={`relative group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                          isUnlocked 
                            ? 'bg-white border-orange-100 shadow-lg shadow-orange-500/5' 
                            : 'bg-slate-50 border-slate-100 grayscale'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isUnlocked ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {isUnlocked ? (
                            <motion.div
                              animate={isUnlocked ? { 
                                y: [0, -12, 0, -6, 0],
                                scale: [1, 1.25, 1, 1.1, 1],
                                rotate: [0, -15, 15, -8, 8, 0]
                              } : {}}
                              transition={{ 
                                duration: 1.2, 
                                repeat: Infinity, 
                                repeatDelay: 3,
                                ease: "easeInOut"
                              }}
                            >
                              <Trophy className="w-6 h-6" />
                            </motion.div>
                          ) : <Lock className="w-6 h-6" />}
                        </div>
                        <p className={`text-[10px] font-black text-center leading-tight uppercase ${
                          isUnlocked ? 'text-orange-900' : 'text-slate-400'
                        }`}>
                          {day.reward.replace("Insignia de ", "")}
                        </p>
                        {isUnlocked && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.5 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm ring-2 ring-white"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 italic">
                  {completedDays.length === 0 
                    ? "¡Comienza tu primer reto para ganar insignias!" 
                    : completedDays.length < 5 
                      ? "Sigue adelante, ¡aún quedan insignias por descubrir!" 
                      : "¡Felicidades! Has completado toda la ruta de inmersión."}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegistrationModal && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowRegistrationModal(false)}
            />
            <div className="relative z-10 w-full max-w-lg">
              <RegistrationScreen onRegister={(data) => {
                setApprenticeData(data);
                setIsRegistered(true);
                setUserName(data.name);
                setShowRegistrationModal(false);
                if (registrationAction) {
                  registrationAction();
                  setRegistrationAction(null);
                }
              }} />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdminPanel && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdminPanel(false)}
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 50 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Admin Sidebar/Header */}
              <div className="p-10 bg-white text-slate-900 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl shadow-sm border border-emerald-100">
                    <LayoutDashboard className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">Dashboard Administrativo</h3>
                    <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">Huila • Industria y Servicios</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Estado del Sistema</p>
                    <p className="text-sm font-black text-emerald-500 flex items-center gap-2 justify-end">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      Sincronizado
                    </p>
                  </div>
                  <button onClick={() => setShowAdminPanel(false)} className="p-3 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all border border-slate-100">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Admin Content Area */}
              <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Aprendices</p>
                    <p className="text-3xl font-black text-slate-800">{adminStats.totalApprentices}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Score Avg</span>
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Promedio General</p>
                    <p className="text-3xl font-black text-slate-800">{adminStats.avgScore} <span className="text-sm font-bold opacity-40">pts</span></p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">Completion</span>
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Graduados (5 Días)</p>
                    <p className="text-3xl font-black text-slate-800">{adminStats.totalCompletions}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Día 4</span>
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Día más Retador</p>
                    <p className="text-3xl font-black text-slate-800">Reglamento</p>
                  </div>
                </div>

                {/* Apprentices List */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Search className="w-5 h-5 text-slate-400" />
                      Listado de Aprendices
                    </h4>
                    <div className="flex gap-2">
                       <button className="text-xs font-bold px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">Exportar CSV</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Aprendiz</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Documento / Programa</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Puntaje</th>
                          <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                          <th className="p-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {adminData.map((apprentice) => (
                          <tr key={apprentice.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl">
                                  {apprentice.avatar}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{apprentice.name}</p>
                                  <p className="text-[10px] font-medium text-slate-400">UID: {apprentice.id.substring(0, 12)}...</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                               <p className="text-xs font-bold text-slate-600">{apprentice.document}</p>
                               <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{apprentice.program}</p>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${((apprentice.completedDays || []).length / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-black text-slate-600">{(apprentice.completedDays || []).length}/5</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">
                                {apprentice.totalScore} pts
                              </span>
                            </td>
                            <td className="p-4">
                               { (apprentice.completedDays || []).length >= 5 ? (
                                 <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-bold">EMBAJADOR</span>
                               ) : (
                                 <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold">EN PROCESO</span>
                               )}
                            </td>
                            <td className="p-4 text-right">
                               <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                                 <ChevronDown className="w-4 h-4" />
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-slate-200 text-center">
                 <p className="text-xs text-slate-500 font-medium">
                   Sistema de Gestión de Inducción Gamificada © 2026 • Acceso Restringido para Administradores
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRepository && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRepository(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="p-10 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
                      <Database className="w-7 h-7" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900">Repositorio de Respuestas</h3>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Trazabilidad Pedagógica Firestore</p>
                   </div>
                </div>
                <button onClick={() => setShowRepository(false)} className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50/30">
                {repoData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <Database className="w-16 h-16 opacity-20" />
                    <p className="font-bold">Aún no hay respuestas registradas.</p>
                  </div>
                ) : (
                  repoData.map((item, idx) => (
                    <div key={item.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                        item.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {item.isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Día {item.dayId} • Pregunta {item.questionIdx + 1}</span>
                          <span className="text-[10px] font-bold text-slate-400">{item.timestamp?.toDate().toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 mb-2">{item.question}</p>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-500 font-medium">Respuesta:</span>
                           <span className={`text-xs font-bold ${item.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                             {item.givenAnswer}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase">
                    Este repositorio garantiza la trazabilidad y el refuerzo pedagógico individual.
                 </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500" />
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-slate-900">Personalizar Perfil</h3>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="space-y-4 text-center">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl shadow-inner mx-auto ring-4 ring-emerald-500/20">
                    {userAvatar}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nombre de Aprendiz</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => updateName(e.target.value)}
                      className="w-full text-center text-xl font-bold p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-emerald-500 focus:bg-white outline-none transition-all text-slate-800"
                      placeholder="Escribe tu nombre..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Elige tu Avatar</label>
                  <div className="grid grid-cols-4 gap-3">
                    {avatars.map((a) => (
                      <button
                        key={a}
                        onClick={() => updateAvatar(a)}
                        className={`text-3xl p-4 rounded-2xl transition-all ${
                          userAvatar === a 
                            ? 'bg-emerald-500 text-white shadow-lg scale-110' 
                            : 'bg-slate-50 hover:bg-slate-100 grayscale hover:grayscale-0'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-[0.98]"
                >
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Onboarding Tour */}
      <AnimatePresence>
        {showTour && (
          <div className="fixed inset-0 z-[300] pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] pointer-events-auto"
              onClick={() => setShowTour(false)}
            />
            
            <div className={`absolute inset-0 flex pointer-events-none p-4 transition-all duration-500 ${
              tourStep === 0 ? 'items-center justify-center' :
              tourStep === 1 ? 'items-start justify-start md:ml-64 mt-32' :
              tourStep === 2 ? 'items-start justify-end mr-4 mt-20' :
              'items-start justify-end mr-32 mt-20'
            }`}>
              <motion.div
                key={tourStep}
                initial={{ scale: 0.9, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: -10 }}
                className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 max-w-xs pointer-events-auto relative"
              >
                {/* Arrow indicator for targeted steps */}
                {tourStep > 0 && (
                  <div className={`absolute w-4 h-4 bg-white border-l border-t border-slate-200 rotate-45 transition-all ${
                    tourStep === 1 ? '-left-2 top-10' :
                    tourStep === 2 ? '-top-2 right-10' :
                    '-top-2 right-10'
                  }`} />
                )}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <MousePointer2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-black text-slate-800">
                    {tourStep === 0 && "¡Bienvenido, Aprendiz!"}
                    {tourStep === 1 && "Ruta de Aprendizaje"}
                    {tourStep === 2 && "Tu Perfil SENA"}
                    {tourStep === 3 && "Tu Progreso"}
                  </h4>
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {tourStep === 0 && "Esta es tu guía interactiva para la semana de inducción. Vamos a darte un recorrido rápido."}
                  {tourStep === 1 && "Aquí puedes navegar entre los diferentes días de inducción. Cada día tiene un reto que debes completar."}
                  {tourStep === 2 && "Personaliza tu nombre y avatar aquí. También podrás ver tus insignias y puntos acumulados."}
                  {tourStep === 3 && "Mira cuánto has avanzado. ¡Completa el 100% de las jornadas para convertirte en Embajador!"}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`h-1 rounded-full transition-all ${i === tourStep ? 'w-4 bg-orange-500' : 'w-1.5 bg-slate-200'}`} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {tourStep > 0 && (
                      <button 
                        onClick={() => setTourStep(prev => prev - 1)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
                      >
                        Atrás
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (tourStep < 3) setTourStep(prev => prev + 1);
                        else setShowTour(false);
                      }}
                      className="text-xs font-bold bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-100"
                    >
                      {tourStep === 3 ? "¡Entendido!" : "Siguiente"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-200 mt-20">
        <div className="flex flex-col md:flex-row justify-between gap-8 items-center text-center md:text-left">
          <div>
            <p className="font-bold text-slate-400 text-sm uppercase mb-2">Diseño Pedagógico SENA</p>
            <p className="text-slate-500 max-w-sm">
              Esta guía aplica estrategias de gamificación para reducir la fricción evaluativa y aumentar el compromiso del aprendiz con su proceso formativo.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase">Estado iFrame</p>
              <p className="text-sm font-bold text-emerald-600">LMS Compatible</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-400 uppercase">Metodología</p>
              <p className="text-sm font-bold text-blue-600">FPI Circular 06</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
