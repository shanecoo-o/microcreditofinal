import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Quanto tempo leva para receber o empréstimo?",
      answer: "Após a aprovação, o dinheiro é depositado na sua conta em até 24 horas úteis. Em muitos casos, a transferência ocorre em menos de 1 hora.",
    },
    {
      question: "Que documentos são necessários?",
      answer: "Vai precisar de um documento de identificação válido (BI ou Passaporte), comprovativo de residência e comprovativo de rendimentos. Todo o processo é digital.",
    },
    {
      question: "Posso pedir mesmo com restrição no nome?",
      answer: "Sim! Analisamos cada caso individualmente. Ter restrições não significa que será automaticamente recusado. Entre em contacto connosco.",
    },
    {
      question: "Quais são as taxas de juro?",
      answer: "As taxas variam de acordo com o perfil do cliente e o valor solicitado. Trabalhamos com taxas competitivas a partir de 1,9% ao mês.",
    },
    {
      question: "É seguro fornecer os meus dados?",
      answer: "Absolutamente! Utilizamos encriptação SSL de 256 bits e seguimos as melhores práticas de protecção de dados para proteger as suas informações pessoais.",
    },
    {
      question: "Posso antecipar o pagamento das prestações?",
      answer: "Sim! Pode antecipar prestações a qualquer momento e ainda receber desconto nos juros. Entre em contacto com o nosso apoio ao cliente.",
    },
  ];

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Encontre respostas para as dúvidas mais comuns sobre os nossos serviços.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
