import { TrendingUp, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const footerLinks = {
  Produto: ['Recursos', 'Preços', 'Portfólio', 'Mercados', 'API'],
  Empresa: ['Sobre', 'Equipe', 'Carreiras', 'Imprensa', 'Blog'],
  Jurídico: ['Política de Privacidade', 'Termos de Serviço', 'Política de Cookies', 'Conformidade'],
  Suporte: ['Central de Ajuda', 'Contato', 'Status', 'Segurança'],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-950">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 pb-16 border-b border-white/5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
                <TrendingUp size={16} className="text-dark-950" />
              </div>
              <span className="text-xl font-semibold gold-text">Aurum</span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed max-w-xs mb-6">
              Ferramentas de investimento de nível institucional para o investidor moderno.
              Construa riqueza com confiança.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-dark-400 hover:text-gold-400 hover:glass-gold transition-all duration-200"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-dark-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-500 text-sm">
            © 2026 Aurum Capital Ltda. Todos os direitos reservados.
          </p>
          <p className="text-dark-600 text-xs text-center md:text-right max-w-md">
            Investir envolve risco. Desempenho passado não indica resultados futuros.
            Isto não é consultoria financeira.
          </p>
        </div>
      </div>
    </footer>
  );
}
