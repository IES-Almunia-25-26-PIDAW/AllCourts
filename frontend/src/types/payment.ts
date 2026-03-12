export type PaymentStatus = "success" | "failed" | "pending";

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_date: string;
  status: PaymentStatus;
  method?: string;
}

export interface CreatePaymentDTO {
  booking_id: number;
  amount: number;
  method?: string;
}

export interface UpdatePaymentDTO {
  status?: PaymentStatus;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  success: "Exitoso",
  failed: "Fallido",
  pending: "Pendiente",
};
