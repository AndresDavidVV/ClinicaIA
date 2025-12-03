import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminSQLAnalysis } from '../lib/openai';
import { LogOut, Send, Database, BarChart2, Server, Loader2, User as UserIcon } from 'lucide-react';

// Schema definition for the AI to understand
const DB_SCHEMA = `
Table: patients
- id (uuid)
- full_name (text)
- cedula (text)
- birth_date (date)
- gender (text)

Table: medical_records
- id (uuid)
- patient_id (uuid ref patients)
- doctor_id (uuid ref staff)
- record_date (timestamp)
- type (text: 'consulta', 'examen', 'cirugia', 'urgencia')
- diagnosis (text)
`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sql?: string;
  data?: any;
}

export const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hola. Soy tu analista de datos clínica. Puedo consultar nuestra base de datos operativa por ti. ¿Qué necesitas saber hoy?'
    }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 1. Generate SQL
      const result = await getAdminSQLAnalysis(userMsg.content, DB_SCHEMA);
      
      // 2. Simulate Execution
      const simulatedData = simulateDataResult(userMsg.content);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.type === 'mock' 
          ? (result as any).text 
          : `He generado la consulta para esto. Aquí están los resultados:`,
        sql: result.type === 'sql' ? (result as any).sql : undefined,
        data: simulatedData
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Lo siento, hubo un error procesando tu consulta.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data generator for the MVP demo
  const simulateDataResult = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('cuantos') || q.includes('total')) return { type: 'single', value: 42 };
    if (q.includes('cama') || q.includes('ocupacion')) return { type: 'single', value: '85%' };
    if (q.includes('diabetes') || q.includes('diagnostico')) return { 
      type: 'list', 
      columns: ['Diagnóstico', 'Total'], 
      rows: [['Hipertensión', 150], ['Diabetes T2', 89], ['EPOC', 45], ['Gastritis', 120]] 
    };
    return { type: 'single', value: 'Datos actualizados al 03/12/2025' };
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">
      {/* Header */}
      <header className="bg-gradient-admin backdrop-blur-xl border-b border-emerald-200/50 px-6 sm:px-8 py-5 flex justify-between items-center shadow-colored-emerald relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 via-transparent to-teal-600/10"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-glow-emerald border border-white/30">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-white text-xl tracking-tight drop-shadow-lg">
              Cliix <span className="font-normal text-emerald-100">| Analytics</span>
            </h1>
            <p className="text-xs text-emerald-100/80 font-medium mt-0.5">Análisis Inteligente de Datos</p>
          </div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
           <div className="text-right hidden md:block bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-lg border border-white/20">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-emerald-100/90">Administrador</p>
            </div>
          <button 
            onClick={logout} 
            className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/20 text-white hover:text-red-100 transition-all hover:scale-105"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full p-6 sm:p-8 gap-6">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-deep-lg border border-white/50 overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-gradient-to-b from-slate-50/50 via-white/30 to-emerald-50/20" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] sm:max-w-[80%] ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-colored-blue hover:shadow-colored-blue hover:scale-[1.02]' 
                  : 'bg-white/90 backdrop-blur-sm border border-emerald-100/50 text-gray-800 shadow-deep hover:shadow-deep-lg hover:scale-[1.01]'} 
                  rounded-2xl p-5 sm:p-6 transition-all duration-300 card-modern`}>
                  <div className={`flex items-center gap-3 mb-4 ${msg.role === 'user' ? 'border-b border-white/20' : 'border-b border-emerald-100'} pb-3`}>
                    <div className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-white/20' : 'bg-emerald-100'}`}>
                      {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-white" /> : <Server className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <span className={`text-xs font-bold ${msg.role === 'user' ? 'text-white/90' : 'text-emerald-700'}`}>
                      {msg.role === 'user' ? 'Tú' : 'Sistema IA'}
                    </span>
                  </div>
                  
                  <p className={`text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user' ? 'text-white/95' : 'text-gray-700'}`}>{msg.content}</p>

                  {/* SQL Code Block */}
                  {msg.sql && (
                    <div className="mt-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl p-4 sm:p-5 font-mono text-xs text-emerald-400 overflow-x-auto border border-emerald-500/20 shadow-glow-emerald">
                      <div className="flex items-center gap-2 text-emerald-300/70 mb-3 text-[10px] uppercase tracking-wider font-semibold">
                        <Database className="w-3.5 h-3.5" /> SQL Generado
                      </div>
                      <code className="block text-emerald-300/90 leading-relaxed">{msg.sql}</code>
                    </div>
                  )}

                  {/* Data Result Visualization */}
                  {msg.data && (
                    <div className="mt-5 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 rounded-xl p-5 sm:p-6 border border-emerald-200/50 shadow-soft">
                      {msg.data.type === 'single' && (
                         <div className="flex items-baseline gap-3">
                           <div className="text-4xl font-black text-emerald-700 bg-white/60 px-5 py-3 rounded-xl shadow-sm">{msg.data.value}</div>
                           <div className="text-xs text-emerald-600/70 font-semibold uppercase tracking-wider">Resultado</div>
                         </div>
                      )}
                      {msg.data.type === 'list' && (
                        <div className="overflow-x-auto -mx-1">
                          <table className="w-full text-sm text-left">
                            <thead>
                              <tr className="bg-gradient-to-r from-emerald-100 to-teal-100">
                                {msg.data.columns.map((col: string) => (
                                  <th key={col} className="px-5 py-3.5 text-xs font-bold text-emerald-900 uppercase tracking-wider border-b-2 border-emerald-200">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {msg.data.rows.map((row: any[], i: number) => (
                                <tr 
                                  key={i} 
                                  className={`border-b border-emerald-100/50 last:border-0 transition-colors hover:bg-emerald-50/70 ${
                                    i % 2 === 0 ? 'bg-white/50' : 'bg-emerald-50/30'
                                  }`}
                                >
                                  {row.map((cell: any, j: number) => (
                                    <td key={j} className="px-5 py-3.5 font-semibold text-slate-700">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white/90 backdrop-blur-sm border border-emerald-200/50 rounded-2xl p-5 shadow-deep flex items-center gap-3 text-emerald-700 text-sm font-medium">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                  <span>Analizando base de datos...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-white/80 via-emerald-50/30 to-white/80 backdrop-blur-xl border-t border-emerald-100/50">
            <form onSubmit={handleSend} className="relative flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta algo sobre la clínica... (ej: ¿Cuántos pacientes con diabetes tenemos?)"
                  className="w-full pl-5 pr-5 py-4 bg-white/90 backdrop-blur-sm border-2 border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 focus:bg-white transition-all outline-none shadow-soft text-sm font-medium text-gray-700 placeholder:text-gray-400 hover:border-emerald-200"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="p-4 bg-gradient-admin hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl transition-all shadow-colored-emerald hover:shadow-glow-emerald-lg hover:scale-105 disabled:scale-100 disabled:shadow-none flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-center text-xs text-emerald-600/70 mt-4 font-medium px-2">
              La IA analiza datos operativos. No comparte información sensible del paciente aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
