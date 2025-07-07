import { Link } from "react-router-dom";
export default function About() {
  return (
    <div className="flex justify-between max-w-5xl gap-y-10 mx-auto py-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">About F2Expert</h1>
        <p>
          Welcome to F2Expert, where creativity meets functionality, and passion
          for design transforms into expertise. We are a leading UI/UX training
          institute dedicated to empowering individuals with the skills and
          knowledge needed to excel in the dynamic world of user interface and
          user experience design.
        </p>
        <p className="pb-5">
          <h1 className="text-xl font-semibold text-gray-800 py-2">
            What We Offer
          </h1>
          Our comprehensive curriculum is tailored to equip you with in-demand
          skills and tools, covering topics such as: <br />
          <strong>UI Design:</strong>
          Mastering tools like Figma, Sketch, and Adobe XD to create stunning
          interfaces. <br />
          <strong>UX Principles:</strong> Understanding user behavior, research
          methodologies, and journey mapping.
          <br />
          <strong>Prototyping & Wireframing:</strong> Developing interactive
          prototypes to validate design ideas.
          <br />
          <strong>Responsive Design:</strong> Creating adaptable layouts for
          diverse devices and screen sizes. <br />
          <strong>Accessibility & Usability:</strong>
          Ensuring inclusivity and user satisfaction through universal design
          principles.
        </p>
        <Link
          to="/"
          className="text-yellow-400 border-[0.1mm] border-yellow-400 px-4 py-3"
        >
          Learn more
        </Link>
      </div>
      <img src="/assets/about-us.jpg" alt="" width={400} height={333} />
    </div>
  );
}
