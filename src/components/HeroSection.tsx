import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock, CheckCircle2, Upload, FileCheck, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Função para calcular a taxa de inscrição baseada no valor
const calculateFee = (amount: number): number => {
  if (amount >= 5000 && amount <= 20000) return 247;
  if (amount >= 21000 && amount <= 50000) return 397;
  if (amount >= 51000 && amount <= 100000) return 797;
  if (amount >= 101000 && amount <= 200000) return 1297;
  return 0;
};

const HeroSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [collateralFile, setCollateralFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    phone: string;
    amount: string;
    collateralFileName: string;
    fee: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Calcular o valor numérico e a taxa
    const numericAmount = parseInt(formData.amount.replace(/\D/g, ""), 10) || 0;
    const fee = calculateFee(numericAmount);

    // Simulated submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Guardar dados submetidos
    setSubmittedData({
      name: formData.name,
      phone: formData.phone,
      amount: formData.amount,
      collateralFileName: collateralFile ? collateralFile.name : "Não carregado",
      fee: fee,
    });
    setFormSubmitted(true);

    toast({
      title: "Pedido enviado com sucesso!",
      description: "Agora pode contactar-nos pelo WhatsApp para finalizar o processo.",
    });

    setIsSubmitting(false);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const handleCollateralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCollateralFile(e.target.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getWhatsAppUrl = () => {
    if (!submittedData) return "#";
    
    const whatsappNumber = "258856047614";
    const message = encodeURIComponent(
      `Olá! Acabei de preencher o formulário no site da JCF Microcrédito.\n\n` +
      `📋 *Dados do Pedido:*\n` +
      `👤 Nome: ${submittedData.name}\n` +
      `📱 Telefone: ${submittedData.phone}\n` +
      `💰 Valor Desejado: ${submittedData.amount} MZN\n` +
      `📷 Garantia a Penhorar: Imagem carregada (${submittedData.collateralFileName})\n` +
      `📝 Taxa de Inscrição: ${submittedData.fee} MZN\n\n` +
      `Gostaria de dar seguimento ao meu pedido de empréstimo.`
    );
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const features = [
    { icon: Clock, text: "Aprovação em minutos" },
    { icon: Shield, text: "100% seguro" },
    { icon: CheckCircle2, text: "Sem burocracia" },
  ];

  return (
    <section
      id="inicio"
      className="relative pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, hsl(214 100% 97%) 0%, hsl(0 0% 100%) 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              Seguro e Confiável
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Empréstimos Rápidos e Seguros —{" "}
              <span className="gradient-text">Solução Financeira</span> ao Seu Alcance
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Peça o seu empréstimo em apenas alguns minutos com total transparência
              e segurança. Processo simples, rápido e de confiança.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                  <feature.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Form or Success */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
              {!formSubmitted ? (
                <>
                  <div className="text-center mb-6">
                    <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                      Peça Agora
                    </h2>
                    <p className="text-muted-foreground">
                      Preencha o formulário e receba ofertas personalizadas
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground font-medium">
                        Nome Completo
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="O seu nome completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-foreground font-medium">
                        Telemóvel
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+258 84 000 0000"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount" className="text-foreground font-medium">
                        Valor Pretendido (MZN)
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="text"
                        placeholder="Ex: 50000"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Valores entre 5.000 e 200.000 MZN
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="collateral" className="text-foreground font-medium">
                        Garantia a Penhorar (Imagem)
                      </Label>
                      <div className="mt-1.5">
                        <label
                          htmlFor="collateral"
                          className="flex items-center justify-center gap-2 w-full h-12 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        >
                          {collateralFile ? (
                            <>
                              <FileCheck className="w-5 h-5 text-primary" />
                              <span className="text-sm text-foreground truncate max-w-[200px]">
                                {collateralFile.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Clique para carregar imagem da garantia
                              </span>
                            </>
                          )}
                        </label>
                        <Input
                          id="collateral"
                          name="collateral"
                          type="file"
                          accept="image/*"
                          onChange={handleCollateralChange}
                          className="hidden"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Tire uma foto do bem que pretende deixar como garantia (JPG, PNG)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="document" className="text-foreground font-medium">
                        Documento de Identificação (BI/Passaporte)
                      </Label>
                      <div className="mt-1.5">
                        <label
                          htmlFor="document"
                          className="flex items-center justify-center gap-2 w-full h-12 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        >
                          {documentFile ? (
                            <>
                              <FileCheck className="w-5 h-5 text-primary" />
                              <span className="text-sm text-foreground truncate max-w-[200px]">
                                {documentFile.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Clique para carregar documento
                              </span>
                            </>
                          )}
                        </label>
                        <Input
                          id="document"
                          name="document"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleDocumentChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Formatos aceites: PDF, JPG, PNG (máx. 5MB)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary h-12 text-base font-semibold mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "A enviar..." : "Enviar Pedido"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Ao enviar, concorda com a nossa{" "}
                      <a href="#" className="text-primary hover:underline">
                        Política de Privacidade
                      </a>
                    </p>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#25D366]" />
                  </div>
                  
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Pedido Registado!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    O seu pedido foi registado com sucesso. Clique no botão abaixo para contactar-nos pelo WhatsApp e finalizar o processo.
                  </p>

                  {/* Resumo dos dados */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-foreground mb-3">Resumo do Pedido:</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Nome:</span> <span className="text-foreground font-medium">{submittedData?.name}</span></p>
                      <p><span className="text-muted-foreground">Telefone:</span> <span className="text-foreground font-medium">{submittedData?.phone}</span></p>
                      <p><span className="text-muted-foreground">Valor Desejado:</span> <span className="text-foreground font-medium">{submittedData?.amount} MZN</span></p>
                      <p><span className="text-muted-foreground">Garantia a Penhorar:</span> <span className="text-foreground font-medium">{submittedData?.collateralFileName}</span></p>
                      <p><span className="text-muted-foreground">Taxa de Inscrição:</span> <span className="text-primary font-bold">{submittedData?.fee} MZN</span></p>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Contactar via WhatsApp
                  </a>

                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: "", phone: "", amount: "" });
                      setDocumentFile(null);
                      setCollateralFile(null);
                      setSubmittedData(null);
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground mt-4 underline"
                  >
                    Fazer novo pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
