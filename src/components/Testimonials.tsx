import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Machava",
      role: "Empresária",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
      text: "Consegui o empréstimo em menos de 1 hora! O processo foi muito simples e a equipa ajudou-me em todas as etapas. Recomendo muito!",
      rating: 5,
    },
    {
      name: "João Nhaca",
      role: "Comerciante",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&fit=crop&crop=face",
      text: "Estava a precisar de um empréstimo urgente e encontrei a JCF Microcrédito. Atendimento excelente e taxas justas. Muito satisfeito!",
      rating: 5,
    },
    {
      name: "Ana Cossa",
      role: "Professora",
      image: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=100&h=100&fit=crop&crop=face",
      text: "Nunca foi tão fácil conseguir um empréstimo. Zero burocracia e total transparência nas taxas. A melhor experiência que já tive!",
      rating: 5,
    },
  ];

  return (
    <section id="depoimentos" className="section-padding bg-card">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            Testemunhos
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O Que Dizem os Nossos Clientes
          </h2>
          <p className="text-lg text-muted-foreground">
            Milhares de moçambicanos já confiaram na JCF Microcrédito para conquistar os seus objectivos financeiros.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-background rounded-2xl p-6 md:p-8 border border-border card-hover"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 right-6 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
