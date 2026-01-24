import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import BlogPage from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { CasesList } from "./pages/CasesList";
import { CaseDetail } from "./pages/CaseDetail";
import { Admin } from "./pages/Admin";
import Templates from "./pages/Templates";
import TemplateDetail from "./pages/TemplateDetail";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import EmailCorporativo from "./pages/EmailCorporativo";
import ChatWhatsapp from "@/pages/ChatWhatsapp";
import { CentralAtendimento } from "@/pages/CentralAtendimento";
import Promocoes from "./pages/Promocoes";
import NotFound from "./pages/NotFound";
import Cursos from "./pages/Cursos";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiesPolicy from "./pages/CookiesPolicy";
import DataDeletion from "./pages/DataDeletion";
import ProposalPanel from "./pages/ProposalPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <main id="app">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog/*" element={<BlogPage />} />
            <Route path="/blog/:slug/*" element={<BlogPost />} />
            <Route path="/cases" element={<CasesList />} />
            <Route path="/cases/:slug" element={<CaseDetail />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/:slug" element={<TemplateDetail />} />
            <Route path="/email-corporativo" element={<EmailCorporativo />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/chat-whatsapp" element={<ChatWhatsapp />} />
            <Route path="/chatwhatsapp" element={<ChatWhatsapp />} />
            <Route path="/central-atendimento" element={<CentralAtendimento />} />
            <Route path="/comercial-propostas" element={<ProposalPanel />} />
            <Route path="/promocoes" element={<Promocoes />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
            <Route path="/termos-de-uso" element={<TermsOfUse />} />
            <Route path="/politica-de-cookies" element={<CookiesPolicy />} />
            <Route path="/excluir-dados" element={<DataDeletion />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
