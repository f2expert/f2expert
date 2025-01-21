import {NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(req.method); // GET
  return NextResponse.json({ status: "success", data: [
    {
      id:1,
      imgUrl:"/course-1.jpg",
      alt:"Advance HTML5",
      title:"Advance HTML5",
      description:"Master the latest features of HTML5 to create dynamic, responsive, and cutting-edge web experiences."
    },
    {
      id:2,
      imgUrl:"/course-1.jpg",
      alt:"Advance CSS3",
      title:"Advance CSS3",
      description:"Unlock the power of CSS3 to design visually stunning, responsive, and modern web interfaces."
    },
    {
      id:3,
      imgUrl:"/course-1.jpg",
      alt:"Java Script",
      title:"Java Script",
      description:"Elevate your coding skills with advanced JavaScript techniques to build dynamic and interactive web applications."
    }
  ]});
}

export async function POST(req: Request) {
  const body = await req.json(); // Parse the JSON body
  return NextResponse.json({ message: `User ${body.name} created successfully!` });
}

export async function PUT(req: Request) {
  const body = await req.json(); // Parse the JSON body
  return NextResponse.json({ message: `User ${body.name} updated successfully!` });
}

export async function DELETE(req: Request) {
  const body = await req.json(); // Parse the JSON body
  return NextResponse.json({ message: `User ${body.name} deleted successfully!` });
}