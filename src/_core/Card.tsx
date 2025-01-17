"use client";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

interface CardProps {
  imgUrl?: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  linkClass?: string;
  btnTitle?: string;
  btnClass?: string;
  btnCB?: () => void; // Corrected to be a function callback
  width: number;
  height: number;
  alt: string;
  children?: ReactNode; // Added children to props
}

export default function Card({
  imgUrl,
  title,
  description,
  link,
  linkText,
  linkClass,
  btnTitle,
  btnClass,
  btnCB,
  width,
  height,
  alt,
  children,
}: CardProps) {
  return (
    <div className="card">
      {imgUrl && <Image src={imgUrl} alt={alt} width={width} height={height} />}
      <div className="p-4">
        {children && children}
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-wrap py-2">{description}</p>
        {link && (
          <div>
            <Link href={link} className={linkClass}>{linkText}</Link>
          </div>
        )}
        {btnTitle && (
          <div>
            <button className={btnClass} onClick={btnCB}>
              {btnTitle}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
