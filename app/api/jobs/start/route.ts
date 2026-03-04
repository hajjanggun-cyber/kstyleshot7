import { getJobFromRequest, jsonNotImplemented } from "@/lib/jobs";

export const maxDuration = 60;

export async function POST(request: Request) {
  const job = await getJobFromRequest(request);
  if (!job) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  return jsonNotImplemented(
    `Wire start logic for step-specific jobs here. Current status=${job.status}.`
  );
}

