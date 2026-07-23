import { Zap, Shield, Eye, Smile, Clock, Headphones } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Aprovação Rápida",
      description: "Análise de crédito em minutos. Sem longas esperas ou processos burocráticos.",
    },
    {
      icon: Shield,
      title: "Processo 100% Seguro",
      description: "Os seus dados são protegidos com encriptação de ponta. Total privacidade garantida.",
    },
    {
      icon: Eye,
      title: "Transparência de Taxas",
      description: "Todas as taxas são apresentadas de forma clara. Sem surpresas ou custos ocultos.",
    },
    {
      icon: Smile,
      title: "Sem Complicação",
      description: "Processo simplificado do início ao fim. Empréstimo fácil de entender e contratar.",
    },
    {
      icon: Clock,
      title: "Dinheiro na Conta Rápido",
      description: "Após aprovação, o valor é depositado directamente na sua conta em até 24 horas.",
    },
    {
      icon: Headphones,
      title: "Apoio Dedicado",
      description: "Equipa especializada disponível para ajudá-lo em todas as etapas do processo.",
    },
  ];

  return (
    <section id="beneficios" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Benefícios
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Porquê Escolher a JCF Microcrédito?
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos a melhor experiência em empréstimos pessoais, com segurança e praticidade.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl border border-border bg-card card-hover"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:shadow-glow transition-all duration-300">
                <benefit.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
