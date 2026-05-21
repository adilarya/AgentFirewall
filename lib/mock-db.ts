import type { Purchase } from "./types";

export const PURCHASE: Purchase = {
  orderId: "AC-1001",
  customerName: "Jake Moffatt",
  purchaseAmount: 50,
  maxRefundPercent: 10,
  maxAllowedRefund: 5,
};

export function getPurchase(): Purchase {
  return PURCHASE;
}
