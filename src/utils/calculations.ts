import type { Invoice } from '../types';

export const calculateSubtotal = (items: Invoice['items']): number => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
};

export const calculateTax = (subtotal: number, taxRate: number, enableTax: boolean): number => {
    if (!enableTax) return 0;
    return Math.floor(subtotal * taxRate);
};

export const calculateTotal = (subtotal: number, tax: number): number => {
    return subtotal + tax;
};

export const formatCurrency = (amount: number): string => {
    return '¥' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
