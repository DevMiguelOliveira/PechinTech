import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Página não encontrada"
        description="A página que você está procurando não existe ou foi movida."
        url={location.pathname}
        noindex
      />
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-bold text-primary">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold">Página não encontrada</h2>
            <p className="text-muted-foreground">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>
          <Button asChild size="lg" className="focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Link to="/" aria-label="Voltar para a página inicial">
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Voltar para o início
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
