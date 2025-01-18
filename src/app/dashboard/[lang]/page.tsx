"use client";
import Quiz from "@/_core/Quiz";
import { useParams } from "next/navigation";
import { YouTubeEmbed, LinkedInEmbed } from 'react-social-media-embed';

export default function Topic() {
  const params = useParams();
  const lang = params?.lang; // Add optional chaining to avoid errors if `params` is undefined
 
  return (
    <div className="container flex overflow-auto">
      <div className="align-left mt-4 mx-4 w-full">
        <YouTubeEmbed url="https://www.youtube.com/watch?v=Ok3TQXserUI" width={"100%"} height={400} />
        <div className="bg-white">
          <LinkedInEmbed 
            url="https://www.linkedin.com/embed/feed/update/urn:li:share:7280144348048941056"
            postUrl="https://www.linkedin.com/posts/f2expert-training-490479344_lorem-ipsum-dolor-sit-amet-consectetur-adipisicing-activity-7280144348623564800-d9EX"
            width={"100%"}
        />
        </div>
      </div>
      <div className="align-right bg-gray-200 mt-4 mr-4 p-4 w-1/4">
        <h1 className="text-sm font-semibold capitalize py-3">{lang} Interview Questions</h1>
        <Quiz question="What is React?" options={["Option 1", "Option 2", "Option 3", "Option 4"]} answer="A Library" qtype="radio" />
      </div>
    </div>
  );
}
