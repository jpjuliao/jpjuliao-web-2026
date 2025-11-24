import { NextResponse } from "next/server";
import { getFiles } from "../../lib/get-files";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = {
    dir: request.nextUrl.searchParams.get("dir"),
    depth: request.nextUrl.searchParams.get("depth")
  }
  const dir = params.dir ? "contents/" + params.dir : "contents";
  const depth = params.depth ? parseInt(params.depth) : 0;
  const response = await getFiles(dir, depth);
  return NextResponse.json(response);
}