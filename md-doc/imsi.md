# 현재 미해결 문제: 헤어 프리뷰 첫 번째 결과 이상

## 증상
사용자가 헤어스타일을 선택하면 두 가지 결과 이미지가 생성되는데, **첫 번째 결과**에서 다음 두 가지 문제가 동시에 발생합니다:

1. **얼굴 왜곡이 심함** — 원본 사진과 얼굴이 크게 달라짐
2. **헤어스타일이 선택한 것과 다름** — 선택한 스타일이 적용되지 않음

두 번째 결과는 정상적으로 나옵니다.

## 기술 스택
- Next.js 앱 (Vercel 배포)
- 헤어 스타일 변환: Replicate API (`flux-kontext-apps/change-haircut` 모델)
- 사용자 사진 → Replicate Files API에 업로드 → URL로 모델 호출
- 두 개의 헤어 결과를 `Promise.all`로 병렬 생성

## 현재 코드 흐름

```
사용자 사진 (원본, 압축 없음)
  → FileReader로 data URL 변환
  → /api/hair/preview POST 요청
  → Replicate Files API에 업로드 → URL 획득
  → Replicate change-haircut 모델 호출 (predictionId 반환)
  → 프론트에서 3초 간격 폴링 → 결과 이미지 URL 수신
```

## 시도한 것들
- 압축 이미지(768px JPEG 0.82) → 원본 이미지로 변경: **효과 없음**
- base64 직접 전송 → Replicate Files API 업로드로 변경: **두 번째 결과는 개선됨, 첫 번째는 여전히 문제**

## 질문
왜 첫 번째 결과만 얼굴 왜곡과 스타일 불일치가 발생하는가? 두 번째는 정상인데 첫 번째만 이상한 원인은?

---

# 헤어 프리뷰 얼굴 왜곡 원인 및 수정 (이전 기록)

## 변경사항 두 가지

1. **원본 사진 그대로 전송** — 기존 768px JPEG 0.82 압축 제거, 원본 이미지 그대로 사용
2. **항상 Replicate Files API로 업로드** — 기존 base64 직접 전송 대신, Replicate 서버에 먼저 업로드 후 URL로 모델 호출

## 테스트 결과

- 1번(압축 제거)은 얼굴 왜곡과 무관
- **2번(base64 → Files API)이 핵심 원인** — base64 직접 전송 시 첫 번째 헤어 결과에서 얼굴 왜곡 발생, Files API URL 전송으로 교체 후 정상

---

# Polar Webhook 401 문제

## 환경
- Next.js 앱 (Vercel Hobby 배포, iad1 리전)
- Polar.sh 결제 연동
- Webhook URL: `https://www.kstyleshot.com/api/webhooks/polar`

## 증상
Polar가 `order.paid` 이벤트 발생 시 webhook을 전송하면 항상 **401** 반환.

Vercel 로그 메시지:
```
{"message":"Webhook verification failed: No matching signature found","status":401}
```

## 현재 코드 (`lib/polar.ts`)

```typescript
import { Webhook, WebhookVerificationError as StdWebhookVerificationError } from "standardwebhooks";

export function verifyPolarWebhookSignature(input: {
  body: string;
  headers: Headers;
}): void {
  assertPolarWebhookEnv();

  const rawSecret = process.env.POLAR_WEBHOOK_SECRET!;
  // polar_whs_ 프리픽스를 whsec_ 로 변환 (standardwebhooks 호환)
  const normalizedSecret = rawSecret.startsWith("polar_whs_")
    ? "whsec_" + rawSecret.slice(10)
    : rawSecret;

  try {
    const wh = new Webhook(normalizedSecret);
    wh.verify(input.body, {
      "webhook-id": input.headers.get("webhook-id") ?? "",
      "webhook-timestamp": input.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": input.headers.get("webhook-signature") ?? "",
    });
  } catch (error) {
    if (error instanceof StdWebhookVerificationError) {
      throw new PolarApiError(`Webhook verification failed: ${error.message}`, 401);
    }
    throw error;
  }
}
```

## Route Handler (`app/api/webhooks/polar/route.ts`)

```typescript
export async function POST(request: Request) {
  const requestId = getRequestId(request);
  const body = await request.text();  // raw body
  let event: unknown;

  try {
    verifyPolarWebhookSignature({ body, headers: request.headers });
    event = parseWebhookEvent(body);
  } catch (error) {
    // 401 반환
  }
}
```

## 확인된 사항
1. `standardwebhooks` 라이브러리 로컬 테스트: `polar_whs_` → `whsec_` 변환 후 `new Webhook()` 정상 생성, key length = 32 bytes ✓
2. Vercel 환경변수 `POLAR_WEBHOOK_SECRET`에 Polar webhook signing secret 설정 완료
3. Polar webhook endpoint: `https://www.kstyleshot.com/api/webhooks/polar` (Enabled 상태)
4. Next.js middleware: `/api/` 경로 제외 (`matcher: ["/((?!api|_next|.*\\..*).*)"]`) ✓
5. 에러는 항상 "No matching signature found" — timestamp 문제나 헤더 누락 아님
6. 새 결제를 해도 동일한 401 발생

## 질문
- `polar_whs_` 형식의 Polar webhook signing secret을 `standardwebhooks` 라이브러리로 올바르게 검증하는 방법은?
- Polar의 signing 방식이 Standard Webhooks 스펙과 다른 점이 있는가?
- `body = await request.text()`로 읽은 값과 Polar가 서명한 body가 다를 수 있는 경우가 있는가?

---

## 추가 분석 (공식 SDK 소스 확인)

공식 `@polar-sh/sdk/webhooks`의 `validateEvent` 소스:

```typescript
const validateEvent = (body, headers, secret) => {
    const base64Secret = Buffer.from(secret, "utf-8").toString("base64");
    const webhook = new Webhook(base64Secret);
    // webhook.verify(body, headers)
};
```

**핵심 발견:**
- `polar_whs_XXXX` 전체 문자열을 UTF-8로 읽어 base64로 변환한 뒤 `standardwebhooks.Webhook`에 전달
- `Webhook`은 `whsec_` 프리픽스가 없으면 base64 디코딩 → 원래 `polar_whs_XXXX` 바이트를 HMAC 키로 사용
- 즉 **Polar 서버도 `polar_whs_XXXX` 전체 문자열(52바이트)을 HMAC 키**로 서명
- `polar_whs_` 제거 후 base64 디코딩하면 32바이트 → 키 불일치 → 401

**결론:** `standardwebhooks.Webhook("whsec_XXXX")` 방식은 틀림. 반드시 `validateEvent(body, headers, "polar_whs_XXXX")` 그대로 사용해야 함.

## 현재 적용된 최종 코드

```typescript
import { validateEvent, WebhookVerificationError as PolarWebhookVerificationError } from "@polar-sh/sdk/webhooks";

export function verifyPolarWebhookSignature(input: {
  body: string;
  headers: Headers;
}): void {
  assertPolarWebhookEnv();

  try {
    validateEvent(input.body, {
      "webhook-id": input.headers.get("webhook-id") ?? "",
      "webhook-timestamp": input.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": input.headers.get("webhook-signature") ?? "",
    }, process.env.POLAR_WEBHOOK_SECRET!);
  } catch (error) {
    if (error instanceof PolarWebhookVerificationError) {
      throw new PolarApiError(`Webhook verification failed: ${error.message}`, 401);
    }
    throw error;
  }
}
```
