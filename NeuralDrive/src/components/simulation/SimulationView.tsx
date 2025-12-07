import { useEffect, useRef, useState, useCallback } from "react";
import { Car } from "@/lib/selfDrivingCar/Car";
import { Road } from "@/lib/selfDrivingCar/Road";
import { NeuralNetwork } from "@/lib/selfDrivingCar/NeuralNetwork";
import { Visualizer } from "@/lib/selfDrivingCar/Visualizer";
import { ControlPanel } from "./ControlPanel";
import { toast } from "sonner";

const START_Y = 100;
const TRAFFIC_SPEED = 2;

interface SimulationSettings {
  carCount: number;
  mutationRate: number;
  maxSpeed: number;
}

export function SimulationView() {
  const carCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const carsRef = useRef<Car[]>([]);
  const trafficRef = useRef<Car[]>([]);
  const roadRef = useRef<Road | null>(null);
  const bestCarRef = useRef<Car | null>(null);
  const generationRef = useRef(1);
  
  const [settings, setSettings] = useState<SimulationSettings>({
    carCount: 100,
    mutationRate: 0.05,  // Lower mutation rate like reference code
    maxSpeed: 3
  });
  
  const [stats, setStats] = useState({ generation: 1, alive: settings.carCount, bestY: 0 });

  const generateCars = useCallback((road: Road, count: number, maxSpeed: number): Car[] => {
    const cars: Car[] = [];
    for (let i = 1; i <= count; i++) {
      cars.push(new Car(road.getLaneCenter(1), START_Y, 30, 50, "AI", maxSpeed));
    }
    return cars;
  }, []);

  const generateTraffic = useCallback((road: Road): Car[] => {
    const trafficCars: Car[] = [];
    // Traffic pattern similar to reference - navigable gaps
    const patterns = [
      // Row 1: lanes 0,2
      { y: -300, lanes: [0, 2] },
      // Row 2: lanes 1,2
      { y: -500, lanes: [1, 2] },
      // Row 3: lanes 0,1
      { y: -700, lanes: [0, 1] },
      // Row 4: lane 0
      { y: -800, lanes: [0] },
      // Row 5: lanes 1,2
      { y: -1000, lanes: [1, 2] },
      // Row 6: lanes 0,2
      { y: -1200, lanes: [0, 2] },
    ];
    
    // Repeat pattern for longer road
    for (let repeat = 0; repeat < 30; repeat++) {
      const offset = repeat * 1000;
      patterns.forEach(pattern => {
        pattern.lanes.forEach(lane => {
          const x = road.getLaneCenter(lane);
          trafficCars.push(new Car(x, pattern.y - offset, 30, 50, "DUMMY", TRAFFIC_SPEED));
        });
      });
    }
    
    return trafficCars;
  }, []);

  const saveBrain = useCallback(() => {
    if (bestCarRef.current?.brain) {
      localStorage.setItem("bestBrain", JSON.stringify(bestCarRef.current.brain));
      toast.success("Brain saved! The AI will remember this progress.");
    }
  }, []);

  const discardBrain = useCallback(() => {
    localStorage.removeItem("bestBrain");
    toast.info("Brain discarded. Starting fresh next reset.");
  }, []);

  const resetSimulation = useCallback(() => {
    if (roadRef.current) {
      carsRef.current.forEach(car => car.destroy());
      trafficRef.current.forEach(car => car.destroy());
      
      const carCanvas = carCanvasRef.current;
      if (carCanvas) {
        roadRef.current = new Road(carCanvas.width / 2, carCanvas.width * 0.85, 3);
      }
      
      carsRef.current = generateCars(roadRef.current, settings.carCount, settings.maxSpeed);
      trafficRef.current = generateTraffic(roadRef.current);
      
      const savedBrain = localStorage.getItem("bestBrain");
      if (savedBrain) {
        for (let i = 0; i < carsRef.current.length; i++) {
          carsRef.current[i].brain = JSON.parse(savedBrain);
          if (i > 0) {
            NeuralNetwork.mutate(carsRef.current[i].brain!, settings.mutationRate);
          }
        }
      }
      
      generationRef.current += 1;
      toast.success(`Generation ${generationRef.current} started with ${settings.carCount} cars!`);
    }
  }, [generateCars, generateTraffic, settings]);

  useEffect(() => {
    const carCanvas = carCanvasRef.current;
    const networkCanvas = networkCanvasRef.current;
    if (!carCanvas || !networkCanvas) return;

    const carCtx = carCanvas.getContext("2d")!;
    const networkCtx = networkCanvas.getContext("2d")!;

    const resizeCanvases = () => {
      // Make road canvas much wider
      const availableWidth = Math.min(window.innerWidth * 0.7, 800);
      carCanvas.width = Math.max(350, availableWidth * 0.55);
      carCanvas.height = window.innerHeight - 200;
      networkCanvas.width = Math.max(280, availableWidth * 0.45);
      networkCanvas.height = window.innerHeight - 200;
    };
    resizeCanvases();
    window.addEventListener("resize", resizeCanvases);

    // Create wider road with 3 lanes
    roadRef.current = new Road(carCanvas.width / 2, carCanvas.width * 0.85, 3);
    carsRef.current = generateCars(roadRef.current, settings.carCount, settings.maxSpeed);
    trafficRef.current = generateTraffic(roadRef.current);
    bestCarRef.current = carsRef.current[0];

    const savedBrain = localStorage.getItem("bestBrain");
    if (savedBrain) {
      for (let i = 0; i < carsRef.current.length; i++) {
        carsRef.current[i].brain = JSON.parse(savedBrain);
        if (i > 0) {
          NeuralNetwork.mutate(carsRef.current[i].brain!, settings.mutationRate);
        }
      }
      toast.info("Loaded saved brain from previous session!");
    }

    const animate = () => {
      for (let i = 0; i < trafficRef.current.length; i++) {
        trafficRef.current[i].update([], []);
      }
      for (let i = 0; i < carsRef.current.length; i++) {
        carsRef.current[i].update(roadRef.current!.borders, trafficRef.current);
      }

      bestCarRef.current = carsRef.current.find(
        (c) => c.y === Math.min(...carsRef.current.map((c) => c.y))
      )!;

      // Clear and draw car canvas
      carCtx.fillStyle = "hsl(220, 20%, 6%)";
      carCtx.fillRect(0, 0, carCanvas.width, carCanvas.height);
      
      carCtx.save();
      carCtx.translate(0, -bestCarRef.current.y + carCanvas.height * 0.7);

      roadRef.current!.draw(carCtx);
      
      for (let i = 0; i < trafficRef.current.length; i++) {
        trafficRef.current[i].draw(carCtx, false, "#ff6b35");
      }

      carCtx.globalAlpha = 0.2;
      for (let i = 0; i < carsRef.current.length; i++) {
        carsRef.current[i].draw(carCtx, false, "#00ffff");
      }
      carCtx.globalAlpha = 1;
      bestCarRef.current.draw(carCtx, true, "#00ff88");

      carCtx.restore();

      // Clear and draw network canvas
      networkCtx.fillStyle = "hsl(220, 20%, 6%)";
      networkCtx.fillRect(0, 0, networkCanvas.width, networkCanvas.height);
      
      networkCtx.lineDashOffset = -Date.now() / 50;
      if (bestCarRef.current.brain) {
        Visualizer.drawNetwork(networkCtx, bestCarRef.current.brain);
      }

      const aliveCars = carsRef.current.filter((c) => !c.damaged).length;
      setStats({
        generation: generationRef.current,
        alive: aliveCars,
        bestY: Math.max(0, Math.round(START_Y - bestCarRef.current.y)),
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvases);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      carsRef.current.forEach(car => car.destroy());
      trafficRef.current.forEach(car => car.destroy());
    };
  }, [generateCars, generateTraffic]);

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full">
      {/* Canvases - 70% of the space */}
      <div className="flex gap-4 justify-center flex-1 min-w-0">
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-lg blur-sm" />
          <canvas
            ref={carCanvasRef}
            className="relative rounded-lg border border-primary/30 canvas-glow"
          />
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-primary font-mono">
            ROAD VIEW
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-b from-accent/20 to-transparent rounded-lg blur-sm" />
          <canvas
            ref={networkCanvasRef}
            className="relative rounded-lg border border-accent/30 network-glow"
          />
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-accent font-mono">
            NEURAL NETWORK
          </div>
        </div>
      </div>

      {/* Controls - 30% of the space */}
      <div className="xl:w-[320px] flex-shrink-0">
        <ControlPanel
          onSave={saveBrain}
          onDiscard={discardBrain}
          onReset={resetSimulation}
          stats={stats}
          settings={settings}
          onSettingsChange={setSettings}
        />
      </div>
    </div>
  );
}
