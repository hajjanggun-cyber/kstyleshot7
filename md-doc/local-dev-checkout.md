# Local Checkout Handshake Test

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in `NEXT_PUBLIC_APP_URL`, `POLAR_*`, and `UPSTASH_*`
3. Run `npm.cmd run dev`

## Browser Flow

1. Open `/en/create` or `/ko/create`
2. Click `Start Polar checkout`
3. Complete the checkout
4. Return to `/[lang]/create/upload?checkout_id=...`
5. Wait for the upload page to poll `/api/session/status` until it reports ready
6. Confirm that the page removes `checkout_id` from the URL after the session is stored

## Webhook Notes

1. The webhook route is `POST /api/webhooks/polar`
2. The handler only processes `order.paid`
3. On success it writes:
   `checkout:{checkoutId}`
   `session:{sessionToken}`
   `job:{orderId}`
