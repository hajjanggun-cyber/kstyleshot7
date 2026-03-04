import { getJobFromRequest, jsonNotImplemented } from "@/lib/jobs";

export const maxDuration = 30;

export async function GET(request: Request) {
  const job = await getJobFromRequest(request);
  if (!job) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  return jsonNotImplemented(
    `Poll external predictions here and update job:${job.orderId}.`
  );
}

