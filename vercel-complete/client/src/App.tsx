import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import CreatorDashboard from "./pages/CreatorDashboard";
import Platforms from "./pages/Platforms";
import Legal from "./pages/Legal";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/admin" component={Admin} />
        <Route path="/creator-dashboard" component={CreatorDashboard} />
        <Route path="/platforms" component={Platforms} />
        <Route path="/legal" component={Legal} />
        <Route path="/support" component={Support} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
