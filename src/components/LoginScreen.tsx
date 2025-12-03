import { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { Phone, Lock, ArrowRight, Activity, Stethoscope, Briefcase, CheckCircle2 } from 'lucide-react';

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
      // Simulation: Show OTP notification
      setShowOtpNotification(true);
      setTimeout(() => setShowOtpNotification(false), 5000);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456' || otp.length > 0) { // Allow any OTP for demo
      setStep('role');
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    if (role) {
      login(phone, role);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4 relative">
      
      {/* OTP Toast Simulation */}
      {showOtpNotification && (
        <div className="fixed top-4 right-4 max-w-sm bg-white rounded-xl shadow-2xl border-l-4 border-green-500 p-4 flex gap-3 animate-slide-in z-50">
          <div className="bg-green-100 p-2 rounded-full h-fit">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Nuevo mensaje WhatsApp</h4>
            <p className="text-sm text-gray-600 mt-1">Tu código de verificación ClinicaIA es: <span className="font-bold text-gray-900 tracking-wider">123456</span></p>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center relative overflow-hidden">
           {/* Background decoration */}
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
           
          <div className="relative z-10">
            <div className="mx-auto bg-white/20 w-20 h-20 rounded-2xl rotate-3 flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner border border-white/30">
              <Activity className="w-10 h-10 text-white -rotate-3" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">ClinicaIA</h1>
            <p className="text-blue-100 font-light text-sm">Plataforma Médica Inteligente</p>
          </div>
        </div>

        <div className="p-8">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Acceso Seguro</h2>
                <p className="text-slate-500 text-sm mt-1">Ingresa tu móvil para recibir el código</p>
              </div>
              
              <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 pl-3 flex items-center pointer-events-none border-r border-gray-200 bg-gray-50 rounded-l-lg w-[70px] justify-center">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
                         🇨🇴 +57
                    </span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-[80px] pr-4 py-3.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-300"
                  placeholder="300 123 4567"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                Enviar Código <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-xs text-center text-slate-400 mt-4">
                Al continuar, aceptas los términos y política de privacidad de datos médicos.
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Verificación</h2>
                <p className="text-slate-500 text-sm mt-1">Ingresa el código enviado a <span className="font-semibold text-slate-700">+57 {phone}</span></p>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center tracking-[0.5em] font-mono text-xl font-bold text-slate-800"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                Verificar Acceso <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="text-center space-y-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowOtpNotification(true)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                  >
                    Reenviar código SMS
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => setStep('phone')}
                    className="block w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ← Cambiar número de celular
                  </button>
              </div>
            </form>
          )}

          {step === 'role' && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Selecciona tu Perfil</h2>
                <p className="text-slate-500 text-sm">Elige el módulo al que deseas ingresar</p>
              </div>

              <button
                onClick={() => handleRoleSelect('doctor')}
                className="w-full p-4 border border-slate-200 hover:border-blue-500 rounded-2xl flex items-center gap-4 transition-all hover:bg-blue-50/50 group shadow-sm hover:shadow-md"
              >
                <div className="bg-blue-100 p-3.5 rounded-xl group-hover:bg-blue-600 transition-colors">
                  <Stethoscope className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800">Médico / Especialista</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Consulta historias clínicas y opiniones IA</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full p-4 border border-slate-200 hover:border-emerald-500 rounded-2xl flex items-center gap-4 transition-all hover:bg-emerald-50/50 group shadow-sm hover:shadow-md"
              >
                <div className="bg-emerald-100 p-3.5 rounded-xl group-hover:bg-emerald-600 transition-colors">
                  <Briefcase className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800">Administrativo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Analítica operativa y gestión de datos</p>
                </div>
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 border-t border-slate-100 p-4 text-center text-xs text-slate-400 font-medium">
          ClinicaIA Secure Access • v2.0.0
        </div>
      </div>
    </div>
  );
};
