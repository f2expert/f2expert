import Link from "next/link";

interface titleProps {
    title: string;
    label:string;
    link:string;
}

export default function CardTitle(content:titleProps) {
  return (
    <div className="card-title">
            <h1 className="text-4xl text-blue-950">{content.title}</h1>
            <div className="bar">
                <div className="bar-big"></div>
                <div className="bar-mid"></div>
                <div className="bar-sm"></div>
            </div>
            <div>
                <Link href="/" className="bg-transparent text-yellow-400 border-yellow-400 px-3 py-8">{content.label}</Link>
            </div>
        </div>
  );
}
