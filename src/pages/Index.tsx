import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import PricingTable from "@/components/PricingTable";
import LoanSimulator from "@/components/LoanSimulator";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import SecuritySection from "@/components/SecuritySection";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>JCF Microcrédito, E.I - Empréstimos Rápidos em Boane | Moçambique</title>
        <meta
          name="description"
          content="Peça o seu empréstimo pessoal de forma rápida e segura na JCF Microcrédito. Aprovação em minutos, taxas transparentes e sem burocracia. Boane, Moçambique."
        />
        <meta
          name="keywords"
          content="empréstimo pessoal, microcrédito, empréstimo rápido, empréstimo Boane, crédito pessoal, Moçambique, metical, Campoane"
        />
        <link rel="canonical" href="https://jcfmicrocredito.co.mz" />
        <meta property="og:title" content="JCF Microcrédito, E.I - Empréstimos Rápidos em Boane" />
        <meta
          property="og:description"
          content="Peça o seu empréstimo pessoal de forma rápida e segura na JCF Microcrédito. Boane, Moçambique."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jcfmicrocredito.co.mz" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <PricingTable />
          <LoanSimulator />
          <HowItWorks />
          <Benefits />
          <Testimonials />
          <SecuritySection />
          <FAQ />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Index;
