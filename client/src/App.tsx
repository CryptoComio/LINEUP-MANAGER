import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LineupManager from "@/pages/lineup-manager";
import ShareLineup from "@/pages/share-lineup";
import PostMatchPage from "@/pages/post-match";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LineupManager} />
      <Route path="/share" component={ShareLineup} />
      <Route path="/post-match" component={PostMatchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
