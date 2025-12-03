import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { Phone, Lock, ArrowRight, Activity, Stethoscope, Briefcase } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">ClinicaIA</h1>
          <p className="text-blue-100">Acceso Seguro</p>
        </div>

        <div className="p-8">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Bienvenido</h2>
                <p className="text-gray-500 text-sm">Ingresa tu número para continuar</p>
              </div>
              
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Número de celular"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Enviar Código <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Verificación</h2>
                <p className="text-gray-500 text-sm">Ingresa el código enviado a WhatsApp</p>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center tracking-[0.5em] font-mono text-lg"
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Verificar <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep('phone')}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Cambiar número
              </button>
            </form>
          )}

          {step === 'role' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Selecciona tu Perfil</h2>
                <p className="text-gray-500 text-sm">¿Cómo deseas ingresar hoy?</p>
              </div>

              <button
                onClick={() => handleRoleSelect('doctor')}
                className="w-full p-4 border-2 border-gray-100 hover:border-blue-500 rounded-xl flex items-center gap-4 transition-all hover:bg-blue-50 group"
              >
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Stethoscope className="w-6 h-6 text-blue-600 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Médico / Especialista</h3>
                  <p className="text-xs text-gray-500">Consulta historias y opiniones IA</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full p-4 border-2 border-gray-100 hover:border-emerald-500 rounded-xl flex items-center gap-4 transition-all hover:bg-emerald-50 group"
              >
                <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-600 transition-colors">
                  <Briefcase className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800">Administrativo</h3>
                  <p className="text-xs text-gray-500">Analítica y gestión operativa</p>
                </div>
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
          ClinicaIA Secure Access • v1.0.0
        </div>
      </div>
    </div>
  );
};

