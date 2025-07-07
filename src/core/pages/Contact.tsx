import { Home, Mail, PhoneOutgoing } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto py-5 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow">
          {/* Left Column Content */}
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="mb-2">
            For questions, technical assistance, or collaboration opportunities
            via the contact information provided.
          </p>

          <div className="mt-4 space-y-2 text-sm text-gray-800">
            <div className="flex items-center gap-4 py-2">
              <Mail className="w-5 h-5 text-gray-700" />
              <span>info@f2expert.com</span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <PhoneOutgoing className="w-5 h-5 text-gray-700" />
              <span>+91 9990062545</span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <Home className="w-5 h-5 text-gray-700" />
              <span>123, Tech Street, Innovation City</span>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-gray-100 p-6 rounded-lg shadow">
          {/* Right Column Content */}
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Contact Number"
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Message"
              className="p-2 border rounded h-32"
            />
            <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
