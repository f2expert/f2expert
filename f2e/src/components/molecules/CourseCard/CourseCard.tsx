import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../atoms/Card/Card';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { cn } from '../../../lib/utils';
import type { CourseDetails } from '../../../services/courseApi';

interface CourseCardProps {
  course: CourseDetails;
  onEnroll?: (courseId: string) => void;
  isEnrolling?: boolean;
  showEnrollButton?: boolean;
  className?: string;
}

export function CourseCard({ 
  course, 
  onEnroll, 
  isEnrolling = false, 
  showEnrollButton = false,
  className 
}: CourseCardProps) {
  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll) {
      onEnroll(course._id);
    }
  };

  return (
    <Card className={cn("group hover:shadow-md transition-shadow duration-200", className)}>
      <Link to={`/courses/${course._id}`} className="block">
        {/* Course Image */}
        {course.thumbnailUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = '/assets/topics/default-course.png';
              }}
            />
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight overflow-hidden">
              <div className="line-clamp-2">
                {course.title}
              </div>
            </CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {course.level}
            </Badge>
          </div>
          
          <CardDescription className="text-sm overflow-hidden">
            <div className="line-clamp-2">
              {course.shortDescription || course.description}
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-6">
          <div className="space-y-3">
            {/* Course Info */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>By {course.instructor}</span>
              <span>{course.duration}</span>
            </div>

            {/* Course Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <div>
                {course.totalStudents.toLocaleString()} students
              </div>
              <div>
                {course.totalLectures} lectures
              </div>
            </div>

            {/* Technologies */}
            {course.technologies && course.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {course.technologies.slice(0, 3).map((tech, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {course.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{course.technologies.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Price and Enroll */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  {course.currency}{course.price}
                </span>
                {course.originalPrice > course.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {course.currency}{course.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
      
      {/* Enroll Button - Outside Link to avoid nested interactive elements */}
      {showEnrollButton && onEnroll && (
        <div className="px-6 pb-6">
          <Button
            onClick={handleEnroll}
            disabled={isEnrolling || course.isEnrolled}
            size="sm"
            className="w-full"
          >
            {isEnrolling ? 'Enrolling...' : course.isEnrolled ? 'Enrolled' : 'Enroll'}
          </Button>
        </div>
      )}
    </Card>
  );
}

export default CourseCard;