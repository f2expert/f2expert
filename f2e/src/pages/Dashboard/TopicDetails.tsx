import { useParams } from "react-router-dom";
import { YouTubeEmbed, LinkedInEmbed } from 'react-social-media-embed';
import { useSidebarData } from '../../hooks';

export default function TopicDetails() {
  const params = useParams();
  const { findContentId, findNavItem } = useSidebarData();
  
  const lang = params?.lang ? params.lang : "html"; // Default to html
  const topic = params?.topic ? params.topic : "history"; // Default to history
  
  // Get contentId and navigation item using helper functions
  const contentId = findContentId(lang, topic) || "Ok3TQXserUI"; // Default fallback
  const currentItem = findNavItem(lang, topic);
 
  return (
    <div className="container flex overflow-auto">
      <div className="align-left mt-4 mx-4 w-full">        
        {/* Main Content */}        
        <YouTubeEmbed url={`https://www.youtube.com/watch?v=${topic}`} width={"100%"} height={400} />
        <div className="bg-white">
          <LinkedInEmbed 
            url="https://www.linkedin.com/embed/feed/update/urn:li:share:7280144348048941056"
            postUrl="https://www.linkedin.com/posts/f2expert-training-490479344_lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-activity-7280144348623564800-d9EX"
            width={"100%"}
        />
        </div>
      </div>
      <div className="align-right bg-gray-200 mt-4 mr-4 p-4 w-1/4">
        <h1 className="text-sm font-semibold capitalize py-3">{lang} {currentItem?.title || topic}</h1>
        <p>Welcome to {lang} {currentItem?.title || topic} content</p>
        <div className="mt-4 text-xs text-gray-600">
          <p>Content ID: {contentId}</p>
          <p>Navigation URL: {currentItem?.path || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
