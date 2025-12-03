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
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <BarChart2 className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-gray-800 text-xl">ClinicaIA <span className="text-emerald-600 font-normal">| Analytics</span></h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-6xl mx-auto w-full p-6 gap-6">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-gray-800'} rounded-2xl p-4 shadow-sm`}>
                  <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                    {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Server className="w-4 h-4 text-emerald-600" />}
                    <span className="text-xs font-semibold opacity-75">{msg.role === 'user' ? 'Tú' : 'Sistema'}</span>
                  </div>
                  
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>

                  {/* SQL Code Block */}
                  {msg.sql && (
                    <div className="mt-3 bg-slate-900 rounded-lg p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                      <div className="flex items-center gap-2 text-slate-400 mb-1 text-[10px] uppercase tracking-wider">
                        <Database className="w-3 h-3" /> SQL Generated
                      </div>
                      {msg.sql}
                    </div>
                  )}

                  {/* Data Result Visualization */}
                  {msg.data && (
                    <div className="mt-3 bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
                      {msg.data.type === 'single' && (
                         <div className="text-3xl font-bold text-emerald-700">{msg.data.value}</div>
                      )}
                      {msg.data.type === 'list' && (
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-emerald-800 uppercase bg-emerald-100/50">
                            <tr>
                              {msg.data.columns.map((col: string) => <th key={col} className="px-2 py-1">{col}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.data.rows.map((row: any[], i: number) => (
                              <tr key={i} className="border-b border-emerald-100/50 last:border-0">
                                {row.map((cell: any, j: number) => <td key={j} className="px-2 py-1 font-medium text-slate-700">{cell}</td>)}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analizando base de datos...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta algo sobre la clínica... (ej: ¿Cuántos pacientes con diabetes tenemos?)"
                  className="w-full pl-4 pr-4 py-3 bg-slate-100 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-center text-xs text-gray-400 mt-2">
              La IA analiza datos operativos. No comparte información sensible del paciente aquí.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
