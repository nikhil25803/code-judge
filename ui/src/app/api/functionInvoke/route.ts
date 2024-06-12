// pages/api/route.ts
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

interface ApiRequestBodyInterface {
  code: string;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    const response = await fetch(
      "http://localhost:9000/2015-03-31/functions/function/invocations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();

    return NextResponse.json(
      { message: "API Called Successfully", data: responseData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Unable to make the API call" },
      { status: 500 }
    );
  }
}
