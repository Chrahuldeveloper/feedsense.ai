import { NextResponse, NextRequest } from "next/server";
import { client } from "../../../redis/db";

export async function POST(req: NextRequest) {
  try {
    const { user, data } = await req.json();

    await client.hSet(user.uid, data.url, JSON.stringify(data));

    return NextResponse.json(
      { message: "Data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
