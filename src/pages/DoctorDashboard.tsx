import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getAIOpinion } from '../lib/openai';
import { LogOut, Search, User, FileText, Brain } from 'lucide-react';

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

      if (pError) {
        console.error('Error fetching patient:', pError);
        alert(`Error: ${pError.message || 'Paciente no encontrado. Verifica que la tabla exista en Supabase.'}`);
        setLoading(false);
        return;
      }

      if (!patients) {
        alert('Paciente no encontrado');
        setLoading(false);
        return;
      }

      setPatient(patients);

      // Fetch Records
      const { data: recs, error: _rError } = await supabase
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
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-doctor backdrop-blur-xl border-b border-blue-200/50 px-6 py-4 flex justify-between items-center shadow-colored-blue relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-glow border border-white/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-white text-xl tracking-tight drop-shadow-lg">
              ClinicaIA <span className="font-normal text-blue-100">| Médico</span>
            </h1>
            <p className="text-xs text-blue-100/80 font-medium">Asistente Inteligente Clínico</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <form onSubmit={searchPatient} className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Buscar paciente por cédula (ej: 1002)"
              className="w-96 pl-12 pr-4 py-2.5 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-400/30 focus:border-white/50 focus:bg-white/30 outline-none text-white placeholder:text-blue-100/70 text-sm font-medium shadow-soft transition-all"
            />
          </form>
          <div className="flex items-center gap-3 border-l border-white/20 pl-6">
            <div className="text-right hidden md:block bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-blue-100/90">Oncología</p>
            </div>
            <button 
              onClick={logout} 
              className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/20 text-white hover:text-red-100 transition-all hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: AI Opinion (The "Copilot") */}
        <div className="w-1/3 bg-white/80 backdrop-blur-xl border-r border-blue-100/50 flex flex-col shadow-deep-lg z-0">
          <div className="p-6 border-b border-blue-100/50 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-white/80 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-doctor p-2.5 rounded-xl shadow-colored-blue">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-black text-lg text-blue-900 flex items-center gap-2">
                  Opinión de Inteligencia Artificial
                </h2>
                <p className="text-xs text-blue-600/80 font-medium mt-0.5">Análisis en tiempo real del historial completo</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-blue-50/30 via-white/50 to-indigo-50/20">
            {!patient && (
              <div className="text-center text-gray-400 mt-20 animate-fade-in">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-soft">
                  <Search className="w-10 h-10 text-blue-400" />
                </div>
                <p className="font-medium text-gray-500">Busca un paciente para ver el análisis</p>
                <p className="text-xs text-gray-400 mt-1">Ingresa la cédula del paciente en la barra superior</p>
              </div>
            )}
            
            {loading && !patient && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-4 bg-blue-100 rounded-lg w-3/4"></div>
                 <div className="h-4 bg-blue-100 rounded-lg w-1/2"></div>
                 <div className="h-4 bg-blue-100 rounded-lg w-5/6"></div>
               </div>
            )}

            {analyzing && (
               <div className="flex flex-col items-center justify-center mt-10 space-y-4 animate-fade-in">
                 <div className="bg-gradient-doctor p-4 rounded-2xl shadow-colored-blue">
                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/30 border-t-white"></div>
                 </div>
                 <p className="text-sm text-blue-700 font-bold animate-pulse">Analizando historial clínico...</p>
                 <p className="text-xs text-blue-500/70">Generando opinión médica con IA</p>
               </div>
            )}

            {!analyzing && aiOpinion && (
               <div className="markdown-content text-sm text-gray-700 animate-fade-in">
                 <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 shadow-deep card-modern">
                   <div className="whitespace-pre-wrap font-sans leading-relaxed text-gray-700 prose prose-blue max-w-none">
                     {aiOpinion}
                   </div>
                 </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Panel: Patient History (The "Source of Truth") */}
        <div className="w-2/3 flex flex-col bg-gradient-to-br from-white/60 via-blue-50/30 to-indigo-50/20">
           {patient ? (
             <>
               {/* Patient Header */}
               <div className="bg-white/90 backdrop-blur-xl border-b border-blue-100/50 p-6 shadow-deep">
                 <div className="flex justify-between items-start">
                   <div className="flex items-center gap-5">
                     <div className="h-20 w-20 bg-gradient-doctor rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-colored-blue border-4 border-white">
                        {patient.full_name.substring(0,2).toUpperCase()}
                     </div>
                     <div>
                       <h2 className="text-3xl font-black text-gray-900 mb-2">{patient.full_name}</h2>
                       <div className="flex gap-5 text-sm text-gray-600">
                         <span className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg font-semibold">
                           <User className="w-4 h-4 text-blue-600" /> {patient.cedula}
                         </span>
                         <span className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg font-semibold">
                           {new Date(patient.birth_date).toLocaleDateString()} ({new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} años)
                         </span>
                         <span className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg font-semibold">
                           {patient.gender}
                         </span>
                       </div>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-glow-emerald">
                       Activo
                     </span>
                   </div>
                 </div>
               </div>

               {/* Timeline */}
               <div className="flex-1 overflow-y-auto p-8">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="h-1 w-12 bg-gradient-doctor rounded-full"></div>
                   <h3 className="font-black text-gray-500 text-xs uppercase tracking-widest">Historial Clínico Cronológico</h3>
                   <div className="h-1 flex-1 bg-gradient-to-r from-blue-200 to-transparent rounded-full"></div>
                 </div>
                 
                 <div className="space-y-6">
                   {records.map((record, index) => (
                     <div key={record.id} className="relative pl-10 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                       <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-indigo-400 to-blue-400"></div>
                       <div className="absolute left-0 top-0 transform -translate-x-1/2">
                         <div className={`h-6 w-6 rounded-full border-4 border-white shadow-colored-blue flex items-center justify-center ${
                           record.type === 'urgencia' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                           record.type === 'examen' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                           'bg-gradient-doctor'
                         }`}>
                           <div className="h-2 w-2 bg-white rounded-full"></div>
                         </div>
                       </div>
                       <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-blue-100/50 shadow-deep hover:shadow-deep-lg hover:scale-[1.01] transition-all duration-300 card-modern ml-4">
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex-1">
                             <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-black mb-3 shadow-soft
                               ${record.type === 'urgencia' ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200' : 
                                 record.type === 'examen' ? 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border border-purple-200' : 
                                 'bg-gradient-to-r from-blue-100 to-indigo-50 text-blue-700 border border-blue-200'}`}>
                               {record.type.toUpperCase()}
                             </span>
                             <h4 className="font-black text-xl text-gray-900 mb-1">{record.diagnosis || 'Sin Diagnóstico'}</h4>
                           </div>
                           <span className="text-xs text-gray-500 font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                             {new Date(record.record_date).toLocaleDateString()}
                           </span>
                         </div>
                         <p className="text-gray-700 text-sm mb-4 leading-relaxed font-medium">{record.description}</p>
                         
                         {(record.treatment || record.notes) && (
                           <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-blue-50/80 p-4 rounded-xl border border-blue-100/50 space-y-3 shadow-soft">
                             {record.treatment && (
                               <div className="flex gap-3">
                                 <span className="font-bold text-blue-700 text-xs uppercase tracking-wider min-w-[100px]">Tratamiento:</span>
                                 <span className="text-gray-700 text-sm font-medium">{record.treatment}</span>
                               </div>
                             )}
                             {record.notes && (
                               <div className="flex gap-3">
                                 <span className="font-bold text-indigo-700 text-xs uppercase tracking-wider min-w-[100px]">Notas:</span>
                                 <span className="text-gray-600 text-sm italic">{record.notes}</span>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                     </div>
                   ))}

                   {records.length === 0 && (
                     <div className="text-center py-16 text-gray-400 animate-fade-in">
                       <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-soft">
                         <FileText className="w-12 h-12 text-blue-400" />
                       </div>
                       <p className="font-semibold text-gray-500">No hay registros médicos disponibles</p>
                       <p className="text-xs text-gray-400 mt-1">El historial clínico aparecerá aquí cuando haya registros</p>
                     </div>
                   )}
                 </div>
               </div>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-fade-in">
               <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-32 h-32 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-deep-lg">
                 <FileText className="w-16 h-16 text-blue-400" />
               </div>
               <p className="font-bold text-gray-500 text-lg mb-1">Selecciona un paciente</p>
               <p className="text-sm text-gray-400">Busca por cédula para ver su historia clínica</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
