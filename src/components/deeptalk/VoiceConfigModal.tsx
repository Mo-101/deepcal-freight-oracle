
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface VoiceConfigModalProps {
  open: boolean;
  onClose: () => void;
}

export default function VoiceConfigModal({ open, onClose }: VoiceConfigModalProps) {
  const [voice, setVoice] = React.useState("onyx");
  const [speed, setSpeed] = React.useState([0.95]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Configuration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              Voice
            </Label>
            <div className="col-span-3">
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onyx">Onyx</SelectItem>
                  <SelectItem value="nova">Nova</SelectItem>
                  <SelectItem value="alloy">Alloy</SelectItem>
                  <SelectItem value="echo">Echo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="speed" className="text-right">
              Speed
            </Label>
            <div className="col-span-3">
              <Slider
                value={speed}
                onValueChange={setSpeed}
                max={2}
                min={0.25}
                step={0.05}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {speed[0]}x
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
