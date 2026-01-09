import { SimulationView } from "@/components/simulation/SimulationView";
import { Brain, Github, Cpu } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full" />
                <div className="relative bg-secondary p-2 rounded-lg border border-primary/30">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-gradient-cyber">
                  NEURAL DRIVE
                </h1>
                <p className="text-xs text-muted-foreground">Self-Driving AI Simulation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
                <Cpu className="w-4 h-4 text-primary animate-glow-pulse" />
                <span>AI ACTIVE</span>
              </div>
              <a
                href="https://github.com/Ukriyte/Self-Driving-Car"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-colors"
              >
                <Github className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-display">
              Live Simulation
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </div>
        
        <SimulationView />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>Neural network visualization powered by real-time AI learning</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                System Online
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
