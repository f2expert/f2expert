import Map from "../atoms/Map";

export default function Footer() {
  return (
    <>
      <footer className="container px-10 py-8 bg-[#012f5c] text-white text-sm">
        <ul className="flex justify-between max-w-7xl mx-auto gap-5">
          <li className="w-80">
            <img src="assets/f2expert.jpg" alt="F2Expert Training Center" />
            <p className="text-sm pt-3">
              F2Expert Training Center is a leading provider of professional
              training and development programs, offering a wide range of
              courses to help individuals and organizations achieve their goals.
            </p>
            <div className="pt-3">
              <h1 className="text-lg pt-3">Get In Touch</h1>
              <a className="py-2" href="">
                info@f2expert.com
              </a>
              <p className="py-2">+919990012545</p>
            </div>
          </li>
          <li>
            <h2 className="text-lg text-gray-300 py-2">Company</h2>
            <ul>
              <li className="py-1">
                {" "}
                <a href="">Home</a>
              </li>
              <li className="py-1">
                {" "}
                <a href="">About Us</a>
              </li>
              <li className="py-1">
                {" "}
                <a href="">Contact Us</a>
              </li>
              <li className="py-1">
                {" "}
                <a href="">Courses</a>
              </li>
              <li className="py-1">
                {" "}
                <a href="">Trainings</a>
              </li>
              <li className="py-1">
                {" "}
                <a href="">Tutorials</a>
              </li>
              <li className="py-1">
                {" "}
                <a href="">Dashboard</a>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="text-lg text-gray-300 py-2 w-80">Training Center</h2>
            <Map />
          </li>
          <li>
            <h2 className="text-lg text-gray-300 py-2">Quick Connect</h2>
            <ul>
              <li className="py-2">
                <input
                  type="text"
                  placeholder="User Name"
                  className="w-full p-1 rounded-sm"
                />
              </li>
              <li className="py-2">
                <input
                  type="text"
                  placeholder="Email ID"
                  className="w-full p-1 rounded-sm"
                />
              </li>
              <li className="py-2">
                <input
                  type="text"
                  placeholder="Contact No."
                  className="w-full p-1 rounded-sm"
                />
              </li>
              <li className="py-2">
                <textarea
                  className="w-full p-1 rounded-sm"
                  placeholder="Description"
                />
              </li>
              <li className="py-2">
                <button>Apply</button>
              </li>
            </ul>
          </li>
        </ul>
      </footer>
      <div className="container px-10 py-4 bg-[#001a33]">
        <div className="flex justify-between max-w-7xl mx-auto">
          <p style={{ color: "#ededf1" }}>Copyright © 2025</p>
          <ul className="flex justify-around ml-auto gap-7">
            <li>
              <a href="" style={{ color: "#ffc107" }} aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
                <span className="sr-only">Facebook</span>
              </a>
            </li>
            <li>
              <a href="" style={{ color: "#ffc107" }} aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
                <span className="sr-only">Twitter</span>
              </a>
            </li>
            <li>
              <a href="" style={{ color: "#ffc107" }} aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
                <span className="sr-only">Instagram</span>
              </a>
            </li>
            <li>
              <a href="" style={{ color: "#ffc107" }} aria-label="GitHub">
                <i className="fa-brands fa-github-alt"></i>
                <span className="sr-only">GitHub</span>
              </a>
            </li>
            <li>
              <a href="" style={{ color: "#ffc107" }} aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
