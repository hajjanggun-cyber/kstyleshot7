import { getJobFromRequest, jsonNotImplemented } from "@/lib/jobs";

export async function POST(request: Request) {
  const job = await getJobFromRequest(request);
  if (!job) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  return jsonNotImplemented(
    `Persist selection state here and move to the next stage. Current order=${job.orderId}.`
  );
}

