import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { getJobFromRequest } from "@/lib/jobs";

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "KStyleShot <noreply@kstyleshot.com>";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const job = await getJobFromRequest(request);
    if (!job) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!job.customerEmail) {
      return NextResponse.json({ error: "No email address on file for this order" }, { status: 400 });
    }

    const body = (await request.json()) as {
      hair1Base64?: unknown;
      hair2Base64?: unknown;
      finalBase64?: unknown;
    };

    const hair1 = typeof body.hair1Base64 === "string" ? body.hair1Base64 : "";
    const hair2 = typeof body.hair2Base64 === "string" ? body.hair2Base64 : "";
    const finalImg = typeof body.finalBase64 === "string" ? body.finalBase64 : "";

    if (!hair1 || !hair2 || !finalImg) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const toBuffer = (b64: string) =>
      Buffer.from(b64.replace(/^data:image\/\w+;base64,/, ""), "base64");

    const { error } = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: job.customerEmail,
      subject: "Your K-StyleShot Results",
      attachments: [
        { filename: "hair-style-1.jpg", content: toBuffer(hair1) },
        { filename: "hair-style-2.jpg", content: toBuffer(hair2) },
        { filename: "final-editorial.jpg", content: toBuffer(finalImg) },
      ],
      html: `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#0d1a2e;font-family:'Helvetica Neue',Arial,sans-serif;color:#f0f0f0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="padding:40px 24px 24px;">
        <h1 style="margin:0 0 8px;font-size:22px;letter-spacing:0.04em;color:#ffffff;">K-StyleShot</h1>
        <p style="margin:0;font-size:13px;color:#8899aa;letter-spacing:0.06em;text-transform:uppercase;">Your Results</p>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 32px;">
        <p style="font-size:15px;line-height:1.7;color:#ccd6e0;margin:0 0 24px;">
          아래 파일 3장이 첨부되어 있습니다.<br />
          헤어 변경 사진 2장과 의상·배경 합성 최종 사진 1장입니다.
        </p>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:8px 12px;background:#1a2a3e;border-radius:6px;font-size:13px;color:#7ec8e3;">
              📎 hair-style-1.jpg &nbsp;·&nbsp; hair-style-2.jpg &nbsp;·&nbsp; final-editorial.jpg
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:0 24px 32px;">
        <p style="font-size:12px;line-height:1.7;color:#6a8099;border-top:1px solid #1e3050;padding-top:20px;margin:0;">
          ※ 본 이메일은 결제 시 입력하신 이메일 주소로 자동 발송됩니다.<br />
          잘못된 이메일 주소로 인한 미수신은 환불 사유에 해당하지 않습니다.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;border-top:1px solid #1e3050;">
        <p style="margin:0;font-size:12px;color:#4a6080;line-height:1.6;">
          This email was sent by KStyleShot · <a href="https://www.kstyleshot.com" style="color:#4a6080;">kstyleshot.com</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if (error) {
      console.error("[email/send] Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[email/send]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
