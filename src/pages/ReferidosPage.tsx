import { Link } from 'react-router-dom';
import { ArrowLeft, Phone, Building2, Users } from 'lucide-react';

interface Referido {
  name: string;
  phone: string;
  institution?: string;
}

const REFERIDOS: Referido[] = [
  {
    name: 'Stephanie Lavaux',
    phone: '321 348 7145',
    institution: 'Uniminuto'
  },
  {
    name: 'Julian Materon',
    phone: '3113310849',
    institution: 'Unico'
  },
  {
    name: 'Vivian Argueta',
    phone: '320 7392282'
  },
  {
    name: 'Sylvain Pradeilles',
    phone: '3173634343'
  }
];

export const ReferidosPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="glass bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 animate-scale-in">
          
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-8 py-10 sm:py-12 text-center relative overflow-hidden">
            <div className="relative z-10">
              <div className="mx-auto bg-white/20 w-20 h-20 rounded-3xl rotate-3 flex items-center justify-center mb-6 backdrop-blur-md shadow-glow border-2 border-white/30 transition-transform hover:rotate-6">
                <Users className="w-10 h-10 text-white -rotate-3 drop-shadow-lg" />
              </div>
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
                Referidos
              </h1>
              <p className="text-blue-100 font-medium text-sm tracking-wide">
                Nuestros Colaboradores
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 sm:p-10 bg-white/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {REFERIDOS.map((referido, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-100/50 shadow-deep hover:shadow-deep-lg hover:scale-[1.02] transition-all duration-300 card-modern animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl shadow-soft flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-xl text-gray-900 mb-3">
                        {referido.name}
                      </h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <a
                            href={`tel:${referido.phone.replace(/\s/g, '')}`}
                            className="text-sm font-semibold hover:text-blue-600 transition-colors"
                          >
                            {referido.phone}
                          </a>
                        </div>
                        
                        {referido.institution && (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-200">
                              {referido.institution}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver al Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

