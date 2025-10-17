import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { cn } from '../../../lib/utils';
import type { Tutorial } from '../../../services/tutorialApi';

interface TutorialCardProps {
  tutorial: Tutorial;
  onStart?: (tutorialId: string) => void;
  isStarting?: boolean;
  showStartButton?: boolean;
  className?: string;
}

export function TutorialCard({ 
  tutorial, 
  onStart, 
  isStarting = false, 
  showStartButton = true,
  className 
}: TutorialCardProps) {
  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onStart) {
      onStart(tutorial._id);
    }
  };

  return (
    <Card className={cn("group hover:shadow-md transition-shadow duration-200", className)}>
      <Link to={tutorial.videoUrl} className="block">
        {/* Tutorial Image */}
        {tutorial.thumbnailUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={tutorial.thumbnailUrl}
              alt={tutorial.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/assets/topics/default-tutorial.png';
              }}
            />
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight overflow-hidden">
              <div className="line-clamp-2">
                {tutorial.title}
              </div>
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {tutorial.level || 'Unknown'}
            </Badge>
          </div>
          
          <CardDescription className="text-sm overflow-hidden">
            <div className="line-clamp-2">
              {tutorial.shortDescription || tutorial.description}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-6">
          <div className="space-y-3">
            {/* Tutorial Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>By {tutorial.instructor || 'Unknown'}</span>
              <span>{tutorial.duration || 'N/A'}</span>
            </div>

            {/* Tutorial Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>{tutorial.rating ? tutorial.rating.toFixed(1) : '0.0'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👁️</span>
                <span>{tutorial.views ? tutorial.views.toLocaleString() : '0'}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👍</span>
                <span>{tutorial.likes ? tutorial.likes.toLocaleString() : '0'}</span>
              </div>
            </div>

            {/* Steps Count */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📝</span>
              <span>
                {tutorial.totalMinutes || 0} minutes
                {tutorial.totalMinutes && ` • ${Math.ceil(tutorial.totalMinutes / 60)} steps`}
              </span>
            </div>

            {/* Technologies/Tags */}
            {tutorial.tags && tutorial.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tutorial.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tutorial.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tutorial.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Free Badge */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                  Free Tutorial
                </Badge>
                {tutorial.isFeatured && (
                  <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
      
      {/* Start Button - Outside Link to avoid nested interactive elements */}
      {showStartButton && onStart && (
        <div className="px-6 pb-6">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            size="sm"
            className="w-full"
          >
            {isStarting ? 'Starting...' : 'Start Tutorial'}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default TutorialCard;