import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/atoms/Button';

interface Course {
  id: string;
  title: string;
  progress: number;
  nextLesson: string;
  instructor: string;
  totalLessons: number;
  completedLessons: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  icon: string;
}

export const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'courses' | 'achievements' | 'profile'>('overview');

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    joinDate: '2024-01-15',
    avatar: '/api/placeholder/100/100',
    level: 'Intermediate Developer',
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 156,
    certificates: 3
  };

  const enrolledCourses: Course[] = [
    {
      id: '1',
      title: 'Full Stack Web Development',
      progress: 75,
      nextLesson: 'React State Management',
      instructor: 'Priya Sharma',
      totalLessons: 48,
      completedLessons: 36
    },
    {
      id: '2',
      title: 'Data Science & Analytics',
      progress: 45,
      nextLesson: 'Machine Learning Basics',
      instructor: 'Anita Patel',
      totalLessons: 32,
      completedLessons: 14
    },
    {
      id: '3',
      title: 'AWS Cloud Computing',
      progress: 20,
      nextLesson: 'EC2 Instance Setup',
      instructor: 'Michael Johnson',
      totalLessons: 28,
      completedLessons: 6
    }
  ];

  const recentAchievements: Achievement[] = [
    {
      id: '1',
      title: 'React Master',
      description: 'Completed all React fundamentals modules',
      earnedDate: '2024-09-15',
      icon: 'fas fa-react'
    },
    {
      id: '2',
      title: 'Code Warrior',
      description: 'Completed 50 coding exercises',
      earnedDate: '2024-09-10',
      icon: 'fas fa-code'
    },
    {
      id: '3',
      title: 'First Steps',
      description: 'Completed your first course',
      earnedDate: '2024-08-20',
      icon: 'fas fa-graduation-cap'
    }
  ];

  const upcomingDeadlines = [
    { course: 'Full Stack Web Development', assignment: 'Final Project Submission', dueDate: '2024-09-25' },
    { course: 'Data Science & Analytics', assignment: 'Data Visualization Assignment', dueDate: '2024-09-30' },
    { course: 'AWS Cloud Computing', assignment: 'Lambda Function Exercise', dueDate: '2024-10-05' }
  ];

  return (
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="w-full">
          {selectedTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <i className="fas fa-book-open text-blue-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{user.totalCourses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <i className="fas fa-check-circle text-green-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Completed</p>
                      <p className="text-2xl font-bold text-gray-900">{user.completedCourses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <i className="fas fa-clock text-purple-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Learning Hours</p>
                      <p className="text-2xl font-bold text-gray-900">{user.totalHours}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <i className="fas fa-certificate text-yellow-600 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Certificates</p>
                      <p className="text-2xl font-bold text-gray-900">{user.certificates}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Courses Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {enrolledCourses.slice(0, 2).map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">{course.title}</h4>
                          <span className="text-sm text-green-600 font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Next: {course.nextLesson}
                        </p>
                        <Link to={`/courses/${course.id}`}>
                          <Button size="sm" className="w-full">
                            Continue Learning
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                          <div className="p-1 bg-orange-100 rounded">
                            <i className="fas fa-exclamation-triangle text-orange-600 text-sm"></i>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{deadline.assignment}</p>
                            <p className="text-sm text-gray-600">{deadline.course}</p>
                            <p className="text-sm text-orange-600">Due: {deadline.dueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <i className={`${achievement.icon} text-yellow-600 text-xl`}></i>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{achievement.earnedDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                <Link to="/courses">
                  <Button>Browse More Courses</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                          {course.progress}% Complete
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">
                          <strong>Instructor:</strong> {course.instructor}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Next Lesson:</strong> {course.nextLesson}
                        </p>
                      </div>

                      <div className="flex space-x-3">
                        <Link to={`/courses/${course.id}`} className="flex-1">
                          <Button className="w-full">Continue</Button>
                        </Link>
                        <Link to={`/tutorial`} className="flex-1">
                          <Button variant="outline" className="w-full">View Tutorial</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'achievements' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white rounded-lg shadow p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className={`${achievement.icon} text-yellow-600 text-2xl`}></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 mb-3">{achievement.description}</p>
                    <p className="text-sm text-gray-500">Earned on {achievement.earnedDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-6 mb-6">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-24 h-24 rounded-full bg-gray-200"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue={user.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        defaultValue={user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Level</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Learning Path</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Web Development</option>
                        <option>Data Science</option>
                        <option>Cloud Computing</option>
                        <option>Mobile Development</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="py-2" />
      </div>
  );
};

export default Dashboard;