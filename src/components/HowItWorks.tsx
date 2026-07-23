import { FileText, Search, ThumbsUp, Wallet } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      step: "01",
      title: "Preencha os seus dados",
      description: "Complete o formulário com as suas informações básicas de forma rápida e segura.",
    },
    {
      icon: Search,
      step: "02",
      title: "Receba ofertas personalizadas",
      description: "Analisamos o seu perfil e apresentamos as melhores opções de empréstimo para si.",
    },
    {
      icon: ThumbsUp,
      step: "03",
      title: "Aprove o seu empréstimo",
      description: "Escolha a melhor oferta e confirme o seu pedido com apenas alguns cliques.",
    },
    {
      icon: Wallet,
      step: "04",
      title: "Receba o dinheiro",
      description: "Após aprovação, o valor é depositado directamente na sua conta em minutos.",
    },
  ];

  return (
    <section id="como-funciona" className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Como Funciona
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Processo Simples e Rápido
          </h2>
          <p className="text-lg text-muted-foreground">
            Em apenas 4 passos, pode ter o dinheiro que precisa na sua conta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
              )}

              <div className="relative bg-background rounded-2xl p-6 border border-border card-hover">
                {/* Step number */}
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {item.step}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
