import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Invoice, InvoiceItem } from '../types';

interface InvoiceFormProps {
    invoice: Invoice;
    onChange: (invoice: Invoice) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onChange }) => {
    const handleChange = (field: keyof Invoice, value: any) => {
        onChange({ ...invoice, [field]: value });
    };

    const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
        const newItems = invoice.items.map((item) => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });
        // Create a deeply new object to ensure React detects the change
        onChange({ ...invoice, items: newItems });
    };

    const addItem = () => {
        const newItem: InvoiceItem = {
            id: crypto.randomUUID(),
            description: '',
            quantity: 0,
            unitPrice: 0,
        };
        onChange({ ...invoice, items: [...invoice.items, newItem] });
    };

    const removeItem = (id: string) => {
        onChange({ ...invoice, items: invoice.items.filter((item) => item.id !== id) });
    };

    return (
        <div className="animate-fade-in notranslate invoice-form-container" translate="no">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: 'var(--spacing-lg)' }}>
                請求書を編集
            </h2>





            {/* Date and Due Date (Moved above Invoice Number) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div className="input-group">
                    <label className="label">発行日</label>
                    <input
                        type="date"
                        className="input"
                        value={invoice.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="label">支払期限</label>
                    <input
                        type="date"
                        className="input"
                        value={invoice.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="input-group" style={{ width: '50%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label className="label" style={{ margin: 0 }}>請求書番号</label>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <span style={{ fontSize: '0.8rem', marginRight: '0.5rem', color: '#666' }}>
                            {invoice.showInvoiceNumber ? '表示中' : '非表示'}
                        </span>
                        <div style={{ position: 'relative', width: '36px', height: '20px' }}>
                            <input
                                type="checkbox"
                                checked={invoice.showInvoiceNumber}
                                onChange={(e) => handleChange('showInvoiceNumber', e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <div style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: invoice.showInvoiceNumber ? 'var(--color-primary)' : '#ccc',
                                borderRadius: '34px',
                                transition: '0.4s'
                            }}></div>
                            <div style={{
                                position: 'absolute',
                                content: '""',
                                height: '16px',
                                width: '16px',
                                left: invoice.showInvoiceNumber ? '18px' : '2px',
                                bottom: '2px',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                transition: '0.4s'
                            }}></div>
                        </div>
                    </label>
                </div>
                {invoice.showInvoiceNumber && (
                    <input
                        type="text"
                        className="input"
                        value={invoice.invoiceNumber}
                        onChange={(e) => handleChange('invoiceNumber', e.target.value)}
                    />
                )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-lg) 0' }} />

            {/* To Section (moved above From) */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>請求先 (クライアント)</h3>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                {/* Changed from grid to vertical stack */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <div className="input-group">
                        <label className="label">名前 (会社名・担当者名)</label>
                        <input
                            type="text"
                            className="input"
                            value={invoice.toName}
                            onChange={(e) => handleChange('toName', e.target.value)}
                            placeholder="例：株式会社サンプルクライアント&#13;&#10;営業部 御中"
                        />
                    </div>

                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-lg) 0' }} />

            {/* From Section (moved below To) */}
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>請求元 (あなた)</h3>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="input-group">
                    <label className="label">名前 / 屋号</label>
                    <input
                        type="text"
                        className="input"
                        value={invoice.fromName}
                        onChange={(e) => handleChange('fromName', e.target.value)}
                        placeholder="山田 太郎"
                    />
                </div>
                <div className="input-group">
                    <label className="label">住所</label>
                    <textarea
                        className="input"
                        style={{ height: '80px', resize: 'vertical' }}
                        value={invoice.fromAddress}
                        onChange={(e) => handleChange('fromAddress', e.target.value)}
                        placeholder="東京都渋谷区..."
                    />
                </div>
                <div className="input-group">
                    <label className="label">電話番号</label>
                    <input
                        type="tel"
                        className="input"
                        value={invoice.fromPhone}
                        onChange={(e) => handleChange('fromPhone', e.target.value)}
                        placeholder="03-1234-5678"
                    />
                </div>
                <div className="input-group" style={{ width: '50%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label className="label" style={{ margin: 0 }}>登録番号 (T+13桁)</label>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <span style={{ fontSize: '0.8rem', marginRight: '0.5rem', color: '#666' }}>
                                {invoice.showInvoiceRegistrationNumber ? '表示中' : '非表示'}
                            </span>
                            <div style={{ position: 'relative', width: '36px', height: '20px' }}>
                                <input
                                    type="checkbox"
                                    checked={invoice.showInvoiceRegistrationNumber}
                                    onChange={(e) => handleChange('showInvoiceRegistrationNumber', e.target.checked)}
                                    style={{ opacity: 0, width: 0, height: 0 }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    cursor: 'pointer',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: invoice.showInvoiceRegistrationNumber ? 'var(--color-primary)' : '#ccc',
                                    borderRadius: '34px',
                                    transition: '0.4s'
                                }}></div>
                                <div style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '16px',
                                    width: '16px',
                                    left: invoice.showInvoiceRegistrationNumber ? '18px' : '2px',
                                    bottom: '2px',
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    transition: '0.4s'
                                }}></div>
                            </div>
                        </label>
                    </div>
                    {invoice.showInvoiceRegistrationNumber && (
                        <input
                            type="text"
                            className="input"
                            value={invoice.invoiceRegistrationNumber}
                            onChange={(e) => handleChange('invoiceRegistrationNumber', e.target.value)}
                            placeholder="T1234567890123"
                        />
                    )}
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-lg) 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>品目</h3>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={invoice.enableTax}
                        onChange={(e) => handleChange('enableTax', e.target.checked)}
                    />
                    <span style={{ fontSize: '0.9rem' }}>消費税を計算・表示</span>
                </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' /* tighter gap */ }}>
                {invoice.items.map((item, index) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 3fr) 80px 100px auto', gap: 'var(--spacing-sm)', alignItems: 'end' }}>
                        <div className="input-group" style={{ margin: 0 }}>
                            {index === 0 && <label className="label">品目名</label>}
                            <input
                                type="text"
                                className="input"
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                            />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            {index === 0 && <label className="label">数量</label>}
                            <input
                                type="number"
                                className="input"
                                min="0"
                                value={item.quantity || ''}
                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div className="input-group" style={{ margin: 0 }}>
                            {index === 0 && <label className="label">単価</label>}
                            <input
                                type="number"
                                className="input"
                                min="0"
                                value={item.unitPrice || ''}
                                onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <button
                            className="btn btn-secondary"
                            onClick={() => removeItem(item.id)}
                            style={{ color: '#ef4444', borderColor: '#ef4444', height: '38px', marginTop: 'auto' }}
                            title="削除"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <button className="btn btn-secondary" onClick={addItem} style={{ marginTop: 'var(--spacing-md)', width: '100%' }}>
                <Plus size={18} /> 品目を追加
            </button>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-lg) 0' }} />

            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>振込先口座情報</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm) var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <div className="input-group">
                    <label className="label">銀行名</label>
                    <input
                        type="text"
                        className="input"
                        value={invoice.bankName}
                        onChange={(e) => handleChange('bankName', e.target.value)}
                        placeholder="◯◯銀行"
                    />
                </div>
                <div className="input-group">
                    <label className="label">支店名</label>
                    <input
                        type="text"
                        className="input"
                        value={invoice.bankBranch}
                        onChange={(e) => handleChange('bankBranch', e.target.value)}
                        placeholder="◯◯支店"
                    />
                </div>
                <div className="input-group">
                    <label className="label">口座番号</label>
                    <input
                        type="text"
                        className="input"
                        value={invoice.bankAccountNumber}
                        onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
                        placeholder="普通 1234567"
                    />
                </div>
                <div className="input-group">
                    <label className="label">口座名義</label>
                    <input
                        type="text"
                        className="input"
                        value={invoice.bankAccountHolder}
                        onChange={(e) => handleChange('bankAccountHolder', e.target.value)}
                        placeholder="ヤマダ タロウ"
                    />
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--spacing-lg) 0' }} />

            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: 'var(--spacing-md)' }}>備考</h3>
            <div className="input-group">
                <textarea
                    className="input"
                    rows={3}
                    value={invoice.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                />
            </div>
        </div >
    );
};
