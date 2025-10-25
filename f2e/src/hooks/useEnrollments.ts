import { useAuth } from './useAuth';

export const useEnrollments = () => {
  const { enrollments, user } = useAuth();

  const isEnrolledInCourse = (courseId: string): boolean => {
    return enrollments.some(enrollment => 
      enrollment.courseId === courseId && 
      enrollment.status === 'enrolled'
    );
  };

  const getEnrollmentForCourse = (courseId: string) => {
    return enrollments.find(enrollment => 
      enrollment.courseId === courseId
    );
  };

  const getEnrollmentCount = (): number => {
    return enrollments.filter(enrollment => 
      enrollment.status === 'enrolled'
    ).length;
  };

  return {
    enrollments,
    isEnrolledInCourse,
    getEnrollmentForCourse,
    getEnrollmentCount,
    user,
  };
};