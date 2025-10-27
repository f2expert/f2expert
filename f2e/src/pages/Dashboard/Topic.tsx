import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTutorialsByTechnology } from "../../store/slices/tutorialsSlice";
import { TutorialCard } from "../../components/molecules/TutorialCard";
import { Button } from "../../components/atoms/Button/Button";
import { Skeleton } from "../../components/atoms/Skeleton/Skeleton";

export default function Topic() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const lastTechnologyRef = useRef<string>("");
  
  const { tutorials, isLoading, error } = useAppSelector(state => state.tutorials);
  
  const technology = params?.lang ? params.lang : "html"; // Default to html
  
  // Fetch tutorials when component mounts or technology changes (prevent duplicate calls)
  useEffect(() => {
    if (technology !== lastTechnologyRef.current) {
      lastTechnologyRef.current = technology;
      dispatch(fetchTutorialsByTechnology(technology));
    }
  }, [dispatch, technology]);

  // Handle tutorial start
  const handleStartTutorial = async (tutorialId: string) => {
    try {
      console.log('Starting tutorial:', tutorialId);
      // Navigate to tutorial page or start tutorial logic
    } catch (error) {
      console.error('Failed to start tutorial:', error);
    }
  };

  // Retry function
  const handleRetry = () => {
    dispatch(fetchTutorialsByTechnology(technology));
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-medium">Error loading tutorials</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tutorials Grid */}
        {!isLoading && !error && (
          <>
            {tutorials.length > 0 ? (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  <h1 className="text-3xl font-bold text-gray-900">{technology.charAt(0).toUpperCase() + technology.slice(1)}</h1>
                  Found {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''} for {technology}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorials.map(tutorial => (
                    <TutorialCard
                      key={tutorial._id}
                      tutorial={{ ...tutorial, videoUrl: `/dashboard/${technology}/${tutorial.videoUrl}` }}
                      onStart={handleStartTutorial}
                      showStartButton={true}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tutorials found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any tutorials for "{technology}". Try searching for a different topic.
                </p>
                <Button onClick={handleRetry} variant="outline">
                  Refresh
                </Button>
              </div>
            )}
          </>
        )}
      </div>      
    </div>
  );
}
