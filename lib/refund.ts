export async function requestRefund(orderId: string): Promise<boolean> {
  void orderId;

  throw new Error(
    "Refund integration is not wired yet. Use Polar POST /v1/refunds with an idempotency guard."
  );
}

