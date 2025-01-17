import {NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log(req.method); // GET
  return NextResponse.json({ status: "success", data: [{name:"HTML"},{name:"CSS"},{name:"JS"}] });
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