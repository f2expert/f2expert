import { Link } from "react-router-dom";
export default function THeader() {
  return (
    <div className="social bg-white border-b text-gray-700 px-5 ">
      <div className="mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {/* Social Icons */}
        <div className="flex justify-center sm:justify-start gap-2">
          <Link to="">
            <i className="fa-brands fa-facebook-f"></i>
          </Link>
          <Link to="">
            <i className="fa-brands fa-twitter"></i>
          </Link>
          <Link to="">
            <i className="fa-brands fa-instagram"></i>
          </Link>
          <Link to="">
            <i className="fa-brands fa-github-alt"></i>
          </Link>
          <Link to="">
            <i className="fa-brands fa-linkedin-in"></i>
          </Link>
        </div>

        {/* Contact Info */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center md:gap-6 text-sm text-right">
          <Link to="" className="hover:text-blue-600">
            CALL: +91 9990012545
          </Link>
          <Link to="" className="hover:text-blue-600">
            EMAIL: info@f2expert.com
          </Link>
        </div>
      </div>
    </div>
  );
}
