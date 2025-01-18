"use client";
interface CircleProps {
  id?: string;
  icon?: React.ReactNode;
  cssClasses?: string;
  activeClass: string;
  children?: React.ReactNode;
  cb?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export default function Circle({ icon, children, cb, id, cssClasses, activeClass }: CircleProps) {
  return (
    <div
      className={cssClasses + (id === activeClass ? "bg-blue-950" : "")}
      onClick={(e) => cb && cb(e)}
      id={id}
    >
      {icon && icon}
      {children && children}
    </div>
  );
}
