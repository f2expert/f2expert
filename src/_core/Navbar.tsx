"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  //className={router.pathname === '/dashboard' ? 'bg-blue-500 text-white' : ''}
  return (
    <header className="flex justify-between pl-10">
      <div className="flex bg-white mt-2 px-2 items-center rounded-sm">
        <Image src="/f2expert.png" alt="F2Expert" width="61" height="68" />
      </div>
      <nav className="bg-yellow-600 w-1/2">
        <ul className="flex h-20 gap-10 items-center px-10 text-gray-300">
          <li>
            <Link
              href="/"
              className={
                pathname === "/home" ? "bg-yellow-500 text-white p-3" : ""
              }
            >
              Home{" "}
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              className={
                pathname === "/about" ? "bg-yellow-500 text-white" : ""
              }
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={
                pathname === "/contact" ? "bg-yellow-500 text-white" : ""
              }
            >
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/course">Courses</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
