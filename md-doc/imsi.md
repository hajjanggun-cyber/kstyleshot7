# KStyleShot 문제점 기록

작성일: 2026-03-22

## 1. 결제 없이 생성 API 호출 가능

확인 파일:

- `app/api/final/render/route.ts`
- `app/api/hair/preview/route.ts`
- `app/api/hair/select/route.ts`

문제:

- 결제 완료 세션 검증 없이 생성 API가 호출된다.
- 현재 구조상 누구나 직접 요청을 보내 AI 생성 기능을 사용할 수 있다.
- `hair/select`에는 세션 검증 TODO가 남아 있다.

영향:

- 유료 기능 우회
- Replicate 비용 유출
- 서비스 남용 가능

심각도:

- 매우 높음

---

## 2. checkoutId만으로 sessionToken 노출 가능

확인 파일:

- `app/api/session/status/route.ts`

문제:

- 인증 없이 `checkoutId`만으로 세션 상태를 조회할 수 있다.
- 경우에 따라 서버가 Polar API를 다시 조회해 새 `sessionToken`을 발급한다.
- 응답에 `sessionToken`, `orderId`, `customerEmail`이 포함된다.

영향:

- 세션 탈취 가능성
- 고객 이메일 노출 가능성
- 후속 보호 API 악용 가능성

심각도:

- 매우 높음

---

## 3. 현재 빌드 실패

확인 결과:

- `npm run typecheck` 실패
- `npm run build` 실패

직접 원인:

- `app/api/email/send/route.ts`에서 `resend` 모듈 import
- 하지만 현재 설치 상태에서 `resend`가 실제로 잡히지 않음

확인 메시지:

- `Cannot find module 'resend' or its corresponding type declarations.`
- `Module not found: Can't resolve 'resend'`

영향:

- 프로덕션 배포 불가
- CI/CD 실패 가능성

심각도:

- 매우 높음

---

## 4. 한글 인코딩 광범위 파손

확인 파일 예시:

- `app/[lang]/page.tsx`
- `app/[lang]/hub/layout.tsx`
- `components/common/SiteHeader.tsx`
- `components/common/SiteFooter.tsx`
- `components/hub/HubMdxPage.tsx`
- `app/[lang]/terms/page.tsx`
- `app/[lang]/privacy/page.tsx`
- `app/[lang]/refund-policy/page.tsx`

문제:

- title, description, 버튼 문구, aria-label, alt 텍스트, 법률 문서 한글이 깨져 있다.

영향:

- 검색 결과 스니펫 품질 저하
- 클릭률 하락 가능성
- 접근성 저하
- 브랜드 신뢰도 하락

심각도:

- 매우 높음

---

## 5. 오타 도메인 혼용

확인 문자열:

- `kstylewshot.com`

문제:

- 실제 서비스 도메인은 `kstyleshot.com`인데 오타 도메인이 메일, 문서, 코드에 남아 있다.

영향:

- 브랜드 신뢰 저하
- 잘못된 링크 생성 가능성
- SEO 신호 혼선 가능성

심각도:

- 높음

---

## 6. SEO용 리다이렉트 전략 문제

확인 파일:

- `next.config.mjs`

문제:

- 예전 블로그 URL들을 관련 없는 허브 메인으로 301 리다이렉트하고 있다.
- `/blog/en/:slug* -> /en/hub`
- `/blog/ko/:slug* -> /ko/hub`
- `/blog/rss.xml -> /en/hub`

영향:

- Google이 soft 404처럼 볼 수 있음
- 기존 링크 자산 손실 가능성
- 정확한 페이지 신호 전달 실패

심각도:

- 높음

---

## 7. 운영 정보 노출 API 존재

확인 파일:

- `app/api/system/readiness/route.ts`
- `lib/env-readiness.ts`

문제:

- 어떤 env가 준비됐는지 외부에 공개 응답으로 노출한다.
- 비밀값 자체는 아니지만 공격자 정찰에는 충분하다.

영향:

- 공격 표면 파악 용이
- 내부 운영 상태 추정 가능

심각도:

- 중간 이상

---

## 8. 보안 헤더 미구성

확인 결과:

다음 항목 구성이 코드상 확인되지 않았다.

- `Content-Security-Policy`
- `X-Frame-Options`
- `Referrer-Policy`
- `Strict-Transport-Security`

영향:

- 보안 기본 방어선 약함

심각도:

- 중간 이상

---

## 9. Next 16 경고 존재

확인 결과:

- `middleware` 파일 규약이 deprecated 상태
- Next 메시지: `Please use "proxy" instead.`

영향:

- 즉시 장애는 아니지만 추후 호환성 이슈 가능

심각도:

- 중간

---

## 총평

좋은 점:

- `robots.ts`, `sitemap.ts`, canonical host 정리, hreflang 대체 링크, 구조화 데이터 등 SEO 기본 골격은 일부 갖춰져 있다.
- App Router, 다국어 구조, MDX 허브 구조 자체는 확장 가능하게 짜여 있다.

핵심 판단:

- 보안: 위험
- 빌드 안정성: 위험
- SEO 품질: 위험
- 구조: 기본 뼈대는 있으나 운영 완성도 부족

지금 가장 먼저 고쳐야 할 순서:

1. 생성 API 전부 세션 검증 추가
2. `session/status` 토큰 노출 차단
3. `resend` 문제 해결 후 빌드 복구
4. 한글 인코딩 전수 수정
5. 오타 도메인 정리
6. 리다이렉트 정책 보정
