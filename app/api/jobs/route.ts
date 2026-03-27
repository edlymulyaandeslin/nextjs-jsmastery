import { handleError } from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
