import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getAIOpinion } from '../lib/openai';
import { LogOut, Search, User, FileText, AlertTriangle, Brain, ChevronRight } from 'lucide-react';

export const DoctorDashboard = () => {
  const { logout, user } = useAuth();
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [aiOpinion, setAiOpinion] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  const searchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cedula) return;

    setLoading(true);
    setPatient(null);
    setAiOpinion('');
    
    try {
      // Fetch Patient
      const { data: patients, error: pError } = await supabase
        .from('patients')
        .select('*')
        .eq('cedula', cedula)
        .single();

      if (pError || !patients) {
        alert('Paciente no encontrado');
        setLoading(false);
        return;
      }

      setPatient(patients);

      // Fetch Records
      const { data: recs, error: rError } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', patients.id)
        .order('record_date', { ascending: false });

      const history = recs || [];
      setRecords(history);

      // Trigger AI Analysis
      setAnalyzing(true);
      const fullHistory = { patient: patients, history };
      const opinion = await getAIOpinion(fullHistory);
      setAiOpinion(opinion || 'No se pudo generar una opinión.');
      setAnalyzing(false);

    } catch (err) {
      console.error(err);
      alert('Error al buscar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Brain className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-gray-800 text-xl">ClinicaIA <span className="text-blue-600 font-normal">| Médico</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <form onSubmit={searchPatient} className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Buscar paciente por cédula (ej: 1002)"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-slate-100 text-sm"
            />
          </form>
          <div className="flex items-center gap-3 border-l pl-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">Oncología</p>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: AI Opinion (The "Copilot") */}
        <div className="w-1/3 bg-white border-r flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0">
          <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-white">
            <h2 className="font-bold text-lg text-blue-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Opinión de Inteligencia Artificial
            </h2>
            <p className="text-xs text-blue-600 mt-1">Análisis en tiempo real del historial completo</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 prose prose-blue max-w-none">
            {!patient && (
              <div className="text-center text-gray-400 mt-20">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Busca un paciente para ver el análisis</p>
              </div>
            )}
            
            {loading && !patient && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-200 rounded w-1/2"></div>
               </div>
            )}

            {analyzing && (
               <div className="flex flex-col items-center justify-center mt-10 space-y-4">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                 <p className="text-sm text-blue-600 font-medium animate-pulse">Analizando historial clínico...</p>
               </div>
            )}

            {!analyzing && aiOpinion && (
               <div className="markdown-content text-sm text-gray-700">
                 {/* Simple markdown rendering replacement or dangerous HTML if sanitized. 
                     For MVP, we'll just split by newlines or use a library. 
                     Here I'll just render it raw inside whitespace-pre-wrap for now. */}
                 <div className="whitespace-pre-wrap font-sans leading-relaxed">
                   {aiOpinion}
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Panel: Patient History (The "Source of Truth") */}
        <div className="w-2/3 flex flex-col bg-slate-50/50">
           {patient ? (
             <>
               {/* Patient Header */}
               <div className="bg-white border-b p-6 shadow-sm">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                     <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-xl font-bold">
                        {patient.full_name.substring(0,2).toUpperCase()}
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-800">{patient.full_name}</h2>
                       <div className="flex gap-4 text-sm text-gray-500 mt-1">
                         <span className="flex items-center gap-1"><User className="w-4 h-4" /> {patient.cedula}</span>
                         <span>{new Date(patient.birth_date).toLocaleDateString()} ({new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} años)</span>
                         <span>{patient.gender}</span>
                       </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                       Activo
                     </span>
                   </div>
                 </div>
               </div>

               {/* Timeline */}
               <div className="flex-1 overflow-y-auto p-8">
                 <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-6">Historial Clínico Cronológico</h3>
                 
                 <div className="space-y-8">
                   {records.map((record) => (
                     <div key={record.id} className="relative pl-8 border-l-2 border-slate-200 last:border-0 pb-8">
                       <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-2 border-blue-400"></div>
                       <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-2 
                               ${record.type === 'urgencia' ? 'bg-red-100 text-red-700' : 
                                 record.type === 'examen' ? 'bg-purple-100 text-purple-700' : 
                                 'bg-blue-50 text-blue-700'}`}>
                               {record.type.toUpperCase()}
                             </span>
                             <h4 className="font-bold text-gray-800">{record.diagnosis || 'Sin Diagnóstico'}</h4>
                           </div>
                           <span className="text-xs text-gray-400 font-medium">
                             {new Date(record.record_date).toLocaleDateString()}
                           </span>
                         </div>
                         <p className="text-gray-600 text-sm mb-4">{record.description}</p>
                         
                         {(record.treatment || record.notes) && (
                           <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2">
                             {record.treatment && (
                               <div className="flex gap-2">
                                 <span className="font-semibold text-slate-700">Tratamiento:</span>
                                 <span className="text-slate-600">{record.treatment}</span>
                               </div>
                             )}
                             {record.notes && (
                               <div className="flex gap-2">
                                 <span className="font-semibold text-slate-700">Notas:</span>
                                 <span className="text-slate-600 italic">{record.notes}</span>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                   ))}

                   {records.length === 0 && (
                     <div className="text-center py-10 text-gray-400">
                       No hay registros médicos disponibles.
                     </div>
                   )}
                 </div>
               </div>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <FileText className="w-16 h-16 mb-4 opacity-20" />
               <p>Selecciona un paciente para ver su historia clínica</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
