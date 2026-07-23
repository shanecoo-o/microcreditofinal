import { Shield, Lock, Eye, CheckCircle } from "lucide-react";

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Encriptação de Dados",
      description: "Utilizamos encriptação SSL de 256 bits para proteger todas as suas informações.",
    },
    {
      icon: Shield,
      title: "Protecção de Dados",
      description: "Seguimos as melhores práticas internacionais de protecção de dados pessoais.",
    },
    {
      icon: Eye,
      title: "Privacidade Garantida",
      description: "Os seus dados nunca são partilhados sem a sua autorização expressa.",
    },
    {
      icon: CheckCircle,
      title: "Verificação de Identidade",
      description: "Processo seguro de verificação para protegê-lo contra fraudes.",
    },
  ];

  return (
    <section className="section-padding bg-foreground text-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6">
              Segurança e Confiança
            </span>

            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              A Sua Segurança é a Nossa{" "}
              <span className="text-primary">Prioridade</span>
            </h2>

            <p className="text-lg text-background/80 mb-8 leading-relaxed">
              Na JCF Microcrédito, investimos em tecnologia de ponta para garantir que as suas
              informações pessoais e financeiras estejam sempre protegidas. Trabalhamos
              com os mais altos padrões de segurança do mercado.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary/30 border-2 border-foreground flex items-center justify-center"
                  >
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold">+50.000 clientes</p>
                <p className="text-sm text-background/70">confiam na nossa plataforma</p>
              </div>
            </div>
          </div>

          {/* Right Content - Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-background/5 border border-background/10 backdrop-blur-sm hover:bg-background/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-background/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
