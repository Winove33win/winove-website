import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, ShoppingCart, MessageCircle } from "lucide-react";
import { SEO } from "@/lib/seo";

const PaymentCanceled = () => {
  return (
    <>
      <SEO
        title="Pagamento cancelado | Templates Wix Studio | Winove"
        description="Página de orientação quando o pagamento do template Wix Studio é cancelado."
        canonical="https://www.winove.com.br/payment-canceled"
        noindex
      />
        <div className="min-h-screen bg-background text-foreground">
          <div className="section--first px-4 pb-16">
            <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Pagamento Cancelado
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Não se preocupe! Você pode tentar novamente a qualquer momento.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold">O que aconteceu?</h3>
                <p className="text-sm text-muted-foreground">
                  O pagamento foi cancelado e nenhuma cobrança foi realizada. 
                  Seus dados estão seguros conosco.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Dúvidas sobre o pagamento?</strong> Nossa equipe está pronta para ajudar 
                  via WhatsApp ou email.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/templates" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ver Templates
                  </Button>
                </Link>
                <a 
                  href="https://api.whatsapp.com/send?phone=5519982403845&text=Olá! Tive dificuldades no pagamento do template. Podem me ajudar?" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full btn-primary">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Falar com Suporte
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>

        </div>
    </>
  );
};

export default PaymentCanceled;