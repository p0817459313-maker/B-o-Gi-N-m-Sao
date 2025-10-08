export interface QuoteItem {
  id: string;
  description: string;
  unit: string;
  quantity: string;
  unitPrice: string;
}

export interface QuoteData {
  customerName: string;
  address: string;
  email: string;
  phone: string;
  items: QuoteItem[];
  signatureImage?: string | null;
  vatRate: string;
  applyVat: boolean;
  companyLogo?: string | null;
}