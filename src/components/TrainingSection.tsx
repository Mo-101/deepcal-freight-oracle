
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BookOpen } from 'lucide-react';

interface TrainingSectionProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  topics: string[];
}

const TrainingSection: React.FC<TrainingSectionProps> = ({
  title,
  description,
  duration,
  level,
  topics
}) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-lg mb-8 hover:bg-slate-800/40 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-yellow-300" />
              {title}
            </CardTitle>
            <p className="text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>
          <Badge className={`ml-4 ${getLevelColor(level)}`}>
            {level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{duration}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">Interactive Learning</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-300 mb-3">Course Topics:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-slate-400 bg-slate-900/30 rounded-lg p-2"
              >
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                {topic}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingSection;
