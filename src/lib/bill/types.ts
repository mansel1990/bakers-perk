export type BillLineItem = {
  description: string;
  quantity: string;
  rate: string;
  amount: number;
};

export type BillBankDetails = {
  accountHolder: string;
  accountType: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
};

export type BillCustomer = {
  name: string;
  address: string;
  city: string;
  zipCode: string;
};

export type BillPayload = {
  invoiceNumber: string;
  date: string;
  customer: BillCustomer;
  lineItems: BillLineItem[];
  discount: number;
  bank: BillBankDetails;
};

export function billSubtotal(items: BillLineItem[]): number {
  return items.reduce((sum, row) => sum + (Number.isFinite(row.amount) ? row.amount : 0), 0);
}

export function billTotal(items: BillLineItem[], discount: number): number {
  return Math.max(0, billSubtotal(items) - (Number.isFinite(discount) ? discount : 0));
}
