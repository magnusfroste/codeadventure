import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AdventureMap from "./pages/AdventureMap";
import GameLevel from "./pages/GameLevel";
import ScratchEditor from "./pages/ScratchEditor";
import NotFound from "./pages/NotFound";
import { allLevels } from "./data/levels";

function LevelRoute() {
  const { levelId } = useParams();
  const id = Number(levelId);
  if (!Number.isInteger(id) || !allLevels.some(level => level.id === id)) return <Navigate to="/map" replace />;
  return <GameLevel key={id} />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<AdventureMap />} />
          <Route path="/level/:levelId" element={<LevelRoute />} />
          <Route path="/scratch" element={<ScratchEditor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;