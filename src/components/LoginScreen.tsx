import { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Lock, ArrowRight, Activity, Stethoscope, Briefcase, CheckCircle2, Sparkles, X } from 'lucide-react';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp' | 'role'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpNotification, setShowOtpNotification] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length > 5) {
      setStep('otp');
      setShowOtpNotification(true);
      setTimeout(() => setShowOtpNotification(false), 15000); // 15 segundos para poder leer el código
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* OTP Toast */}
      {showOtpNotification && (
        <div className="fixed top-4 right-4 w-80 bg-white rounded-2xl shadow-2xl border-l-4 border-green-500 p-5 flex gap-4 animate-slide-in z-[9999] relative" style={{ backgroundColor: 'white', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
          <button
            onClick={() => setShowOtpNotification(false)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-lg flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0" />
              <h4 className="font-bold text-gray-900 text-sm">WhatsApp</h4>
            </div>
            <p className="text-sm text-gray-700">Código ClinicaIA:</p>
            <p className="text-2xl font-black text-gray-900 tracking-wider mt-2" style={{ letterSpacing: '0.2em' }}>123456</p>
          </div>
        </div>
      )}

      {/* Main Container - Fixed width */}
      <div className="relative z-10" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="glass bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-scale-in" style={{ width: '100%', boxSizing: 'border-box' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden" style={{ boxSizing: 'border-box' }}>
            {/* Removed diagonal lines pattern - kept clean gradient background */}
            
            <div className="relative z-10">
              <div className="mx-auto bg-white/20 w-20 h-20 rounded-3xl rotate-3 flex items-center justify-center mb-6 backdrop-blur-md shadow-glow border-2 border-white/30 transition-transform hover:rotate-6">
                <Activity className="w-10 h-10 text-white -rotate-3 drop-shadow-lg" />
              </div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
                ClinicaIA
              </h1>
              <p className="text-blue-100 font-medium text-sm tracking-wide">
                Plataforma Médica Inteligente
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 bg-white/50" style={{ boxSizing: 'border-box' }}>
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="animate-fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Acceso Seguro</h2>
                  <p className="text-slate-500 text-sm">Ingresa tu móvil para recibir el código</p>
                </div>
                
                <div className="relative mb-5" style={{ width: '100%' }}>
                  <div className="absolute left-0 top-0 bottom-0 pl-3 flex items-center pointer-events-none border-r-2 border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100 rounded-l-xl" style={{ width: '75px' }}>
                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                      🇨🇴 <span>+57</span>
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-semibold text-gray-900 placeholder:text-gray-400 shadow-sm hover:shadow-md text-sm"
                    style={{ width: '100%', paddingLeft: '90px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                    placeholder="300 123 4567"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center justify-center gap-2 group text-sm mb-4"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  Enviar Código 
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-xs text-center text-slate-500 leading-relaxed">
                  Al continuar, aceptas los <span className="font-semibold text-blue-600">términos</span> y <span className="font-semibold text-blue-600">política de privacidad</span> de datos médicos.
                </p>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="animate-fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Lock className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Verificación</h2>
                  <p className="text-slate-600 text-sm">
                    Código enviado a <span className="font-bold text-slate-900">+57 {phone}</span>
                  </p>
                </div>

                <div className="relative mb-5" style={{ width: '100%' }}>
                  <div className="absolute left-4 top-4">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-center tracking-[0.5em] font-mono text-xl font-black text-slate-900 bg-gray-50 shadow-sm"
                    style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', boxSizing: 'border-box' }}
                    placeholder="000000"
                    maxLength={6}
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl flex items-center justify-center gap-2 text-sm mb-4"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  Verificar Acceso <ArrowRight className="w-5 h-5" />
                </button>
                
                <div className="text-center space-y-3">
                  <button 
                    type="button" 
                    onClick={() => setShowOtpNotification(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors"
                  >
                    Reenviar código SMS
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')}
                    className="block text-sm text-gray-500 hover:text-gray-700 transition-colors font-medium"
                    style={{ width: '100%' }}
                  >
                    ← Cambiar número
                  </button>
                </div>
              </form>
            )}

            {step === 'role' && (
              <div className="animate-fade-in" style={{ width: '100%', boxSizing: 'border-box' }}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-slate-900 mb-1">Selecciona tu Perfil</h2>
                  <p className="text-slate-500 text-sm">Elige el módulo al que deseas ingresar</p>
                </div>

                <button
                  onClick={() => handleRoleSelect('doctor')}
                  className="p-4 border-2 border-gray-200 hover:border-blue-500 rounded-2xl flex items-center gap-4 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group shadow-sm hover:shadow-lg mb-4"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-2xl group-hover:from-blue-600 group-hover:to-indigo-600 transition-all shadow-md group-hover:shadow-glow flex-shrink-0">
                    <Stethoscope className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-lg">Médico / Especialista</h3>
                    <p className="text-xs text-slate-500 mt-1">Consulta historias clínicas y opiniones IA</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>

                <button
                  onClick={() => handleRoleSelect('admin')}
                  className="p-4 border-2 border-gray-200 hover:border-emerald-500 rounded-2xl flex items-center gap-4 transition-all hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 group shadow-sm hover:shadow-lg"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 p-3 rounded-2xl group-hover:from-emerald-600 group-hover:to-teal-600 transition-all shadow-md group-hover:shadow-lg group-hover:shadow-emerald-500/30 flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-lg">Administrativo</h3>
                    <p className="text-xs text-slate-500 mt-1">Analítica operativa y gestión de datos</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-slate-200/50 p-4 text-center" style={{ boxSizing: 'border-box' }}>
            <p className="text-xs text-slate-500 font-semibold tracking-wide">
              ClinicaIA Secure Access • v2.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
