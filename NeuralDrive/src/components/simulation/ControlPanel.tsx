import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Save, Trash2, RotateCcw, Brain, Car, Zap, Settings } from "lucide-react";

interface SimulationSettings {
  carCount: number;
  mutationRate: number;
  maxSpeed: number;
}

interface ControlPanelProps {
  onSave: () => void;
  onDiscard: () => void;
  onReset: () => void;
  stats: {
    generation: number;
    alive: number;
    bestY: number;
  };
  settings: SimulationSettings;
  onSettingsChange: (settings: SimulationSettings) => void;
}

export function ControlPanel({ 
  onSave, 
  onDiscard, 
  onReset, 
  stats, 
  settings, 
  onSettingsChange 
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Stats Display */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3 border border-border canvas-glow">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-3 h-3 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Gen</span>
          </div>
          <p className="text-xl font-display font-bold text-primary">{stats.generation}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 border border-border canvas-glow">
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-3 h-3 text-success" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Alive</span>
          </div>
          <p className="text-xl font-display font-bold text-success">{stats.alive}</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 border border-border canvas-glow">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-warning" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Dist</span>
          </div>
          <p className="text-xl font-display font-bold text-warning">{stats.bestY}</p>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-secondary/30 rounded-lg p-4 border border-border/50 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-primary" />
          <span className="font-display text-sm font-semibold text-primary">Settings</span>
        </div>
        
        {/* Car Count */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Total Cars</Label>
          <Input
            type="number"
            min={10}
            max={500}
            value={settings.carCount}
            onChange={(e) => onSettingsChange({ 
              ...settings, 
              carCount: Math.max(10, Math.min(500, parseInt(e.target.value) || 100)) 
            })}
            className="h-8 text-sm bg-background/50"
          />
        </div>

        {/* Mutation Rate */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Mutation Rate</Label>
            <span className="text-xs text-primary font-mono">{settings.mutationRate.toFixed(2)}</span>
          </div>
          <Slider
            value={[settings.mutationRate]}
            onValueChange={([value]) => onSettingsChange({ ...settings, mutationRate: value })}
            min={0.01}
            max={0.5}
            step={0.01}
            className="py-2"
          />
        </div>

        {/* Max Speed */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Max Speed</Label>
            <span className="text-xs text-primary font-mono">{settings.maxSpeed.toFixed(1)}</span>
          </div>
          <Slider
            value={[settings.maxSpeed]}
            onValueChange={([value]) => onSettingsChange({ ...settings, maxSpeed: value })}
            min={2}
            max={6}
            step={0.5}
            className="py-2"
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={onSave}
          size="sm"
          className="flex-1 bg-success hover:bg-success/90 text-success-foreground glow-success"
        >
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button
          onClick={onDiscard}
          size="sm"
          variant="destructive"
          className="flex-1"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Discard
        </Button>
        <Button
          onClick={onReset}
          size="sm"
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Instructions */}
      <div className="bg-secondary/30 rounded-lg p-3 border border-border/50">
        <h3 className="font-display text-xs font-semibold text-primary mb-2">How It Works</h3>
        <ul className="text-[10px] text-muted-foreground space-y-1">
          <li>• AI cars learn to drive using neural networks</li>
          <li>• Best car (green) is tracked in real-time</li>
          <li>• Save brain to preserve learning progress</li>
          <li>• Adjust settings and Reset to apply changes</li>
        </ul>
      </div>
    </div>
  );
}
