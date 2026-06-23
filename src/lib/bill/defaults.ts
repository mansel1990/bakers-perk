import type { BillBankDetails, BillLineItem } from "./types";

/** Matches the sample invoice — editable on the bill generator form. */
export const DEFAULT_BILL_BANK: BillBankDetails = {
  accountHolder: "S ALEX RITESH",
  accountType: "SAVING",
  accountNumber: "50100164994535",
  ifsc: "HDFC0003820",
  branch: "MONTIETH ROAD EGMORE",
};

export const EMPTY_LINE_ITEM: BillLineItem = {
  description: "",
  quantity: "",
  rate: "",
  amount: 0,
};
