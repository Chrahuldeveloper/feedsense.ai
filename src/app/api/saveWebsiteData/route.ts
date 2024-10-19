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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const cachedData = await client.get(userId!);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

    const allWebsites = await client.hGetAll(userId!);

    if (Object.keys(allWebsites).length > 0) {
      const parsedData = Object.fromEntries(
        Object.entries(allWebsites).map(([key, value]) => [
          key,
          JSON.parse(value),
        ])
      );

      await client.set(userId!, JSON.stringify(parsedData));
      await client.expire(userId!, 3600);

      return NextResponse.json(parsedData, { status: 200 });
    } else {
      return NextResponse.json({ message: "No data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching websites:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
