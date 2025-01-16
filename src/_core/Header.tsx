import React from "react";
import Link from "next/link";
export default function Header() {
  return (
    <div className="container px-10 py-2">
      <div className="flex justify-between max-w-7xl mx-auto text-xs font-medium text-gray-400">
        <div className="self-start">
          <Link href="" aria-label="facebook">
            <i className="fa-brands fa-facebook-f p-1 hover:text-yellow-500"></i>
          </Link>
          <Link href="" aria-label="twitter">
            <i className="fa-brands fa-twitter p-1 hover:text-yellow-500"></i>
          </Link>
          <Link href="" aria-label="instagram">
            <i className="fa-brands fa-instagram p-1 hover:text-yellow-500"></i>
          </Link>
          <Link href="" aria-label="github">
            <i className="fa-brands fa-github-alt p-1 hover:text-yellow-500"></i>
          </Link>
          <Link href="" aria-label="linkedin">
            <i className="fa-brands fa-linkedin-in p-1 hover:text-yellow-500"></i>
          </Link>
        </div>
        <div className="self-end">
          <Link href="" className="pr-2">
            Call : +919990012545
          </Link>
          <Link href="">
            E-mail : info@f2expert.com
          </Link>
        </div>
      </div>
    </div>
  );
}
