
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ScrambleText, 
  BlurText, 
  GradientText, 
  TypewriterText,
  TiltCard,
  MagneticCard,
  GlowCard,
  BounceCard,
  RippleButton,
  FloatingParticles,
  AuroraBackground,
  AnimatedGrid
} from './index';

export const AnimationShowcase: React.FC = () => {
  const [showEffects, setShowEffects] = useState({
    particles: false,
    aurora: false,
    grid: false
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8 relative overflow-hidden">
      {/* Background Effects */}
      {showEffects.particles && <FloatingParticles count={30} />}
      {showEffects.aurora && <AuroraBackground />}
      {showEffects.grid && <AnimatedGrid />}

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <ScrambleText 
            text="DeepCAL++ Animation Library" 
            className="text-4xl font-bold text-white mb-4"
          />
          <BlurText 
            text="Powered by Framer Motion"
            className="text-xl text-slate-400"
            delay={2}
          />
        </div>

        {/* Background Effect Controls */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="text-white">Background Effects</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={() => setShowEffects(prev => ({ ...prev, particles: !prev.particles }))}
              variant={showEffects.particles ? "default" : "outline"}
              className="text-white"
            >
              Floating Particles
            </Button>
            <Button
              onClick={() => setShowEffects(prev => ({ ...prev, aurora: !prev.aurora }))}
              variant={showEffects.aurora ? "default" : "outline"}
              className="text-white"
            >
              Aurora Background
            </Button>
            <Button
              onClick={() => setShowEffects(prev => ({ ...prev, grid: !prev.grid }))}
              variant={showEffects.grid ? "default" : "outline"}
              className="text-white"
            >
              Animated Grid
            </Button>
          </CardContent>
        </Card>

        <Tabs defaultValue="text" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 text-white">
            <TabsTrigger value="text">Text Effects</TabsTrigger>
            <TabsTrigger value="cards">Card Effects</TabsTrigger>
            <TabsTrigger value="buttons">Interactive</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Scramble Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrambleText 
                    text="Neural Networks Active" 
                    className="text-2xl font-bold text-green-400"
                  />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Blur Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <BlurText 
                    text="Symbolic Intelligence Engine"
                    className="text-2xl font-bold text-blue-400"
                  />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Gradient Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <GradientText 
                    text="DeepCAL++ vΩ"
                    className="text-3xl font-bold"
                    gradient="from-purple-400 via-pink-500 to-red-500"
                  />
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Typewriter</CardTitle>
                </CardHeader>
                <CardContent>
                  <TypewriterText 
                    text="Loading freight intelligence..."
                    className="text-xl text-cyan-400 font-mono"
                    speed={80}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TiltCard className="h-48">
                <Card className="glass-card h-full">
                  <CardContent className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Tilt Card</h3>
                      <p className="text-slate-400">Hover to see 3D tilt effect</p>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>

              <MagneticCard className="h-48">
                <Card className="glass-card h-full border-purple-500/30">
                  <CardContent className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Magnetic Card</h3>
                      <p className="text-slate-400">Follows your cursor</p>
                    </div>
                  </CardContent>
                </Card>
              </MagneticCard>

              <GlowCard className="h-48" glowColor="cyan-500">
                <Card className="glass-card h-full border-cyan-500/30">
                  <CardContent className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Glow Card</h3>
                      <p className="text-slate-400">Hover for glow effect</p>
                    </div>
                  </CardContent>
                </Card>
              </GlowCard>

              <BounceCard delay={0.2} className="h-48">
                <Card className="glass-card h-full border-green-500/30">
                  <CardContent className="p-6 flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">Bounce Card</h3>
                      <p className="text-slate-400">Animated entrance</p>
                    </div>
                  </CardContent>
                </Card>
              </BounceCard>
            </div>
          </TabsContent>

          <TabsContent value="buttons" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-white">Ripple Button</CardTitle>
                </CardHeader>
                <CardContent>
                  <RippleButton 
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold"
                    onClick={() => console.log('Ripple clicked!')}
                  >
                    Click for Ripple Effect
                  </RippleButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <div className="text-center space-y-8">
              <div>
                <GradientText 
                  text="Welcome to the Future"
                  className="text-5xl font-bold mb-4"
                  gradient="from-cyan-400 via-purple-500 to-pink-500"
                />
                <BlurText 
                  text="Where logistics meets artificial intelligence"
                  className="text-xl text-slate-300"
                  delay={1}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                {[0, 1, 2].map((i) => (
                  <BounceCard key={i} delay={i * 0.2}>
                    <MagneticCard>
                      <GlowCard glowColor="purple-500">
                        <Card className="glass-card h-32">
                          <CardContent className="p-6 flex items-center justify-center h-full">
                            <ScrambleText 
                              text={`Feature ${i + 1}`}
                              className="text-xl font-bold text-white"
                              delay={i * 0.5}
                            />
                          </CardContent>
                        </Card>
                      </GlowCard>
                    </MagneticCard>
                  </BounceCard>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
