import { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Lock, ArrowRight, Activity, Stethoscope, Briefcase } from 'lucide-react';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456' || otp.length > 0) {
      setStep('role');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    if (role) {
      login(phone, role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container - Fixed width */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto">
        <div className="glass bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-scale-in">
          
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-10 sm:py-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="mx-auto bg-white/20 w-20 h-20 rounded-3xl rotate-3 flex items-center justify-center mb-6 backdrop-blur-md shadow-glow border-2 border-white/30 transition-transform hover:rotate-6">
                <Activity className="w-10 h-10 text-white -rotate-3 drop-shadow-lg" />
              </div>
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
                Cliix
              </h1>
              <p className="text-blue-100 font-medium text-sm tracking-wide">
                Plataforma Médica Inteligente
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 sm:p-10 bg-white/50">
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="animate-fade-in w-full">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Acceso Seguro</h2>
                  <p className="text-slate-500 text-sm">Ingresa tu móvil para recibir el código</p>
                </div>
                
                <div className="relative mb-6 w-full">
                  <div className="absolute left-0 top-0 bottom-0 pl-4 flex items-center pointer-events-none border-r-2 border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 rounded-l-xl w-[85px]">
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                      🇨🇴 <span>+57</span>
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm pl-[100px] pr-4 py-3.5"
                    placeholder="300 123 4567"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center justify-center gap-2 group text-sm mb-6"
                >
                  Enviar Código 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-xs text-center text-slate-500 leading-relaxed px-2">
                  Al continuar, aceptas los <span className="font-semibold text-blue-600">términos</span> y <span className="font-semibold text-blue-600">política de privacidad</span> de datos médicos.
                </p>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="animate-fade-in w-full">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-5">
                    <Lock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Verificación</h2>
                  <p className="text-slate-600 text-sm">
                    Código enviado a <span className="font-bold text-slate-900">+57 {phone}</span>
                  </p>
                </div>

                <div className="relative mb-6 w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-center tracking-[0.5em] font-mono text-xl font-black text-slate-900 bg-gray-50 shadow-sm pl-12 pr-4 py-4"
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl flex items-center justify-center gap-2 text-sm mb-5"
                >
                  Verificar Acceso <ArrowRight className="w-5 h-5" />
                </button>
                
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium py-2"
                  >
                    ← Cambiar número
                  </button>
                </div>
              </form>
            )}

            {step === 'role' && (
              <div className="animate-fade-in w-full">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Selecciona tu Perfil</h2>
                  <p className="text-slate-500 text-sm">Elige el módulo al que deseas ingresar</p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelect('doctor')}
                    className="w-full p-5 border-2 border-gray-200 hover:border-blue-500 rounded-2xl flex items-center gap-4 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group shadow-sm hover:shadow-lg"
                  >
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3.5 rounded-2xl group-hover:from-blue-600 group-hover:to-indigo-600 transition-all shadow-md group-hover:shadow-glow flex-shrink-0">
                      <Stethoscope className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-black text-slate-900 text-lg mb-1">Médico / Especialista</h3>
                      <p className="text-xs text-slate-500">Consulta historias clínicas y opiniones IA</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full p-5 border-2 border-gray-200 hover:border-emerald-500 rounded-2xl flex items-center gap-4 transition-all hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 group shadow-sm hover:shadow-lg"
                  >
                    <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3.5 rounded-2xl group-hover:from-emerald-600 group-hover:to-teal-600 transition-all shadow-md group-hover:shadow-lg group-hover:shadow-emerald-500/30 flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h3 className="font-black text-slate-900 text-lg mb-1">Administrativo</h3>
                      <p className="text-xs text-slate-500">Analítica operativa y gestión de datos</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-slate-200/50 px-8 py-5 text-center">
            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              Cliix Secure Access • v2.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
