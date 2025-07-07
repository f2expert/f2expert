import { Link } from "react-router-dom";

interface titleProps {
    title: string;
    label:string;
    link:string;
}

export default function CardTitle(content:titleProps) {
  return (
    <div className="card-title">
            <h1>{content.title}</h1>
            <div className="bar">
                <div className="bar-big"></div>
                <div className="bar-mid"></div>
                <div className="bar-sm"></div>
            </div>
            <div>
                <Link to="/">{content.label}</Link>
            </div>
        </div>
  );
}
