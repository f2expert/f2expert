"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

export default function Footer() {
  return (
    <Fragment>
      <footer className="container px-10 py-8 bg-blue-900 text-gray-100 text-sm">
        <ul className="flex justify-between max-w-7xl mx-auto gap-3">
          <li>
            <Image src="/f2expert.png" alt="F2Expert Training Center" width="61" height="68" />
            <p>D1/450, Gali No.3, Ashok Nagar, Shahdara, Delhi-93</p>
            <Link className="py-5" href="">
              info@f2expert.com
            </Link>
            <p>+919990012545</p>
          </li>
          <li>
            <h2 className="text-lg text-gray-300">Company</h2>
            <ul>
              <li>
                {" "}
                <Link href="">About</Link>
              </li>
              <li>
                {" "}
                <Link href="">course</Link>
              </li>
              <li>
                {" "}
                <Link href="">blog</Link>
              </li>
              <li>
                {" "}
                <Link href="">Contact</Link>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="text-lg text-gray-300">Links</h2>
            <ul>
              <li>
                {" "}
                <Link href="">event</Link>
              </li>
              <li>
                {" "}
                <Link href="">notice</Link>
              </li>
              <li>
                {" "}
                <Link href="">research</Link>
              </li>
              <li>
                {" "}
                <Link href="">scholarship</Link>
              </li>
              <li>
                {" "}
                <Link href="">teacher</Link>
              </li>
            </ul>
          </li>
          <li>
            <h2 className="text-lg text-gray-300">Courses</h2>
            <ul>
              <li>
                {" "}
                <Link href="">Algorithm</Link>
              </li>
              <li>
                {" "}
                <Link href="">Artificial Intelligence</Link>
              </li>
              <li>
                {" "}
                <Link href="">JavaScript</Link>
              </li>
              <li>
                {" "}
                <Link href="">Mathematics</Link>
              </li>
              <li>
                {" "}
                <Link href="">Photography</Link>
              </li>
            </ul>
          </li>
        </ul>
      </footer>
      <div className="container px-10 py-4 bg-blue-950 border-t-[0.1mm] border-yellow-400">
        <div className="flex justify-between max-w-7xl mx-auto">
          <p style={{ color: "#ededf1" }}>
            Copyright © 2021 a hugo theme by Themefisher
          </p>
          <ul className="flex justify-around ml-auto gap-7">
            <li>
              <Link href="" style={{ color: "#ffc107" }} aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
                <span className="sr-only">Facebook</span>
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "#ffc107" }} aria-label="Twitter">
                <i className="fa-brands fa-twitter"></i>
                <span className="sr-only">Twitter</span>
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "#ffc107" }} aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
                <span className="sr-only">Instagram</span>
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "#ffc107" }} aria-label="GitHub">
                <i className="fa-brands fa-github-alt"></i>
                <span className="sr-only">GitHub</span>
              </Link>
            </li>
            <li>
              <Link href="" style={{ color: "#ffc107" }} aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
}
