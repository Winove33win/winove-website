import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Mail } from "lucide-react";
import { SEO } from "@/lib/seo";

const PaymentSuccess = () => {
  return (
    <>
      <SEO
        title="Pagamento aprovado | Templates Wix Studio | Winove"
        description="Confirmação de compra dos templates Wix Studio da Winove. Página não indexável."
        canonical="https://www.winove.com.br/payment-success"
        noindex
      />
        <div className="min-h-screen bg-background text-foreground">
          <div className="section--first px-4 pb-16">
            <div className="container mx-auto max-w-2xl">
          <Card className="text-center">
            <CardHeader className="pb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600">
                Pagamento Aprovado!
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                Obrigado pela sua compra! Seu template foi processado com sucesso.
              </p>
              
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold">Próximos Passos:</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Verifique seu email para o link de download</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Faça o download do arquivo .wix do template</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Importe no Wix Studio e comece a personalizar</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Suporte:</strong> Precisa de ajuda? Entre em contato conosco pelo WhatsApp 
                  ou email dentro de 30 dias para suporte gratuito.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/templates" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Ver Mais Templates
                  </Button>
                </Link>
                <Link to="/" className="flex-1">
                  <Button className="w-full btn-primary">
                    Voltar ao Início
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
            </div>
          </div>

        </div>
    </>
  );
};

export default PaymentSuccess;