export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  date: string;
  dueDate: string;
  fromName: string;
  fromAddress: string;
  fromPhone: string;
  toName: string;
  toAddress?: string;
  items: QuoteItem[];
  taxRate: number; // 0.1 for 10%
  enableTax: boolean;
  showQuoteNumber: boolean;
  invoiceRegistrationNumber?: string;
  showInvoiceRegistrationNumber: boolean;
  showPhone: boolean;
  notes?: string;
}

export const initialQuote: Quote = {
  id: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    d.setDate(0);
    return d.toISOString().split('T')[0];
  })(),
  quoteNumber: 'Q-001',
  showQuoteNumber: true,
  fromName: '山田 太郎',
  fromAddress: '〒000-0000\n東京都架空区架空町1-2-3',
  fromPhone: '01-2345-6789',
  toName: '株式会社サンプルクライアント御中',
  toAddress: '',
  items: [
    { id: crypto.randomUUID(), description: 'バナー制作', quantity: 1, unitPrice: 10000 },
    { id: crypto.randomUUID(), description: '', quantity: 0, unitPrice: 0 },
    { id: crypto.randomUUID(), description: '', quantity: 0, unitPrice: 0 },
  ],
  taxRate: 0.1,
  enableTax: true,
  showInvoiceRegistrationNumber: true,
  invoiceRegistrationNumber: 'T1234567890123',
  showPhone: true,
};
