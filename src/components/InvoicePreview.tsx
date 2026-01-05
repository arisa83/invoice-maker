import { useRef, useLayoutEffect, useState } from 'react';
import type { Invoice } from '../types';
import { calculateSubtotal, calculateTax, calculateTotal, formatCurrency } from '../utils/calculations';

interface InvoicePreviewProps {
    invoice: Invoice;
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
    const subtotal = calculateSubtotal(invoice.items);
    const tax = calculateTax(subtotal, invoice.taxRate, invoice.enableTax);
    const total = calculateTotal(subtotal, tax);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    };

    // Scaling Logic
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    // Reset scale when invoice changes (content likely changed)
    useLayoutEffect(() => {
        setScale(1);
    }, [invoice]);

    useLayoutEffect(() => {
        if (containerRef.current && contentRef.current) {
            const container = containerRef.current;
            const content = contentRef.current;

            // Calculate available height (297mm in pixels minus padding)
            // We can infer available height from container clientHeight since it has fixed height and padding (box-sizing: border-box)
            // But verify padding is included in height? box-sizing border-box means height includes padding.
            // So available content height = clientHeight - paddingY.

            const style = window.getComputedStyle(container);
            const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
            // Height of A4 @ 96dpi is approx 1123px.
            const availableHeight = container.clientHeight - paddingY;

            // Current content height (at scale 1, because we reset it above/before this runs?)
            // Note: If scale is applied, visual height is layout * scale.
            // But we use width = 100/scale %.

            // To be safe, we calculate based on the current scrollHeight and current scale.
            // content.scrollHeight is the Layout Height.
            // If scale is applied, visual height is layout * scale.
            // But we use width = 100/scale %.

            // Let's use a simpler check:
            // If we are at scale=1, and scrollHeight > availableHeight, we scale down.
            // If we are already scaled, do we need to check?
            // The "Reset" effect might cause an infinite loop if we don't guard.
            // Actually, separating the reset and the measure is tricky.

            // Combined approach:
            // 1. Always start calculation assuming scale=1 (predictive).
            // But we can't easily measure scale=1 if we are currently rendered at 0.5.

            // Simpler: Just rely on scrollHeight > availableHeight check?
            // If current visual height > available, shrink.
            // Visual Height = content.scrollHeight * scale.

            const currentVisualHeight = content.scrollHeight * scale;

            if (currentVisualHeight > availableHeight + 1) { // buffer 1px
                // Need to shrink.
                // Target: height * newScale = available.
                // newScale = available / height.
                // But wait, changing scale changes Width (and thus wrap), so Height changes.
                // Conservatively: newScale = available / (currentVisualHeight / scale)
                // i.e., available / currentLayoutHeight.
                const newScale = availableHeight / content.scrollHeight;
                setScale(newScale);
            }
        }
    }, [invoice, scale]);

    // Client Name Scaling Logic
    const clientNameRef = useRef<HTMLHeadingElement>(null);
    const [clientNameScale, setClientNameScale] = useState(1);

    useLayoutEffect(() => {
        setClientNameScale(1);
    }, [invoice.toName]);

    useLayoutEffect(() => {
        if (clientNameRef.current) {
            const element = clientNameRef.current;
            // Available width is the parent's width.
            // We can get it from offsetParent or explicitly measuring container.
            // The container is the div with width: 60%.
            const containerWidth = element.parentElement?.clientWidth || 0;
            const scrollWidth = element.scrollWidth;

            if (scrollWidth > containerWidth && containerWidth > 0) {
                const newScale = containerWidth / scrollWidth;
                // Prevent infinite loops and unnecessary updates
                if (Math.abs(newScale - clientNameScale) > 0.01) {
                    setClientNameScale(newScale);
                }
            }
        }
    }, [invoice.toName, clientNameScale]);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div
                id="invoice-preview"
                ref={containerRef}
                className="notranslate"
                translate="no"
                style={{
                    width: '210mm',
                    minWidth: '210mm', // Force minimum width
                    height: '297mm',
                    aspectRatio: '210/297',
                    padding: '20mm',
                    backgroundColor: 'white',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    margin: '0 auto',
                    boxSizing: 'border-box',
                    fontSize: '10.5pt',
                    color: '#333',
                    position: 'relative',
                    fontFamily: '"Roboto", "Noto Sans JP", sans-serif',
                    lineHeight: 1.5,
                    overflow: 'hidden', // Ensure no overflow visually
                    flexShrink: 0, // Prevent shrinking in flex container
                }}
            >
                <div
                    ref={contentRef}
                    style={{
                        width: `${100 / scale}%`, // Compensate width to effectively reduce font size
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                    }}
                >
                    {/* Header Section */}
                    {/* Header Section */}
                    <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '26pt', // Increased size (approx +2-3px)
                            fontWeight: 'bold',
                            margin: 0,
                            letterSpacing: '0.1em',
                            color: '#333',
                            display: 'inline-block'
                        }}>
                            請求書
                        </h1>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', marginBottom: '40px' }}>
                        {/* Left Column: Client, Total, Deadline */}
                        <div style={{ width: '55%', display: 'flex', flexDirection: 'column' }}>
                            {/* Client Name */}
                            <div style={{ marginBottom: '20px', overflow: 'hidden' }}>
                                <h2
                                    ref={clientNameRef}
                                    style={{
                                        fontSize: '17.25pt', // Decreased by approx 1px (18pt -> 17.25pt)
                                        fontWeight: 'bold', // Explicitly set bold
                                        textShadow: '0 0 1px #333', // Hack to force bold in html2canvas if weight fails
                                        margin: '0 0 10px 0',
                                        whiteSpace: 'nowrap',
                                        transform: `scale(${clientNameScale})`,
                                        transformOrigin: 'left center',
                                        // Removed width property to prevent infinite loop
                                    }}
                                >
                                    {invoice.toName}
                                </h2>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <p style={{ margin: '0 0 15px 0', fontSize: '10pt' }}>
                                    下記の通りご請求申し上げます。
                                </p>

                                {/* Total Amount Block */}
                                <div style={{
                                    borderBottom: '1px solid #333',
                                    paddingBottom: '0px',
                                    marginBottom: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'baseline'
                                }}>
                                    <span style={{ fontSize: '12pt', fontWeight: 'bold' }}>合計金額</span>
                                    <span style={{ fontSize: '24pt', fontWeight: 'bold' }}>
                                        ¥{total.toLocaleString()}-
                                    </span>
                                </div>
                            </div>


                        </div>

                        {/* Right Column: Sender Info */}
                        <div style={{ width: '40%', textAlign: 'right' }}>
                            {/* Date and No Block */}
                            <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '10pt' }}>
                                {invoice.showInvoiceNumber && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginBottom: '4px' }}>
                                        <span>請求書番号</span>
                                        <span style={{ minWidth: '80px', textAlign: 'right' }}>{invoice.invoiceNumber}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                                    <span>請求日</span>
                                    <span style={{ minWidth: '80px', textAlign: 'right' }}>{formatDate(invoice.date)}</span>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '12pt', fontWeight: 'bold', textShadow: '0 0 1px #333', margin: 0 }}>{invoice.fromName}</h3>
                            <p style={{ whiteSpace: 'pre-line', margin: 0, fontSize: '10pt' }}>{invoice.fromAddress}</p>
                            {invoice.fromPhone && <p style={{ margin: '0 0 4px 0', fontSize: '10pt' }}>TEL:{invoice.fromPhone}</p>}
                            {invoice.showInvoiceRegistrationNumber && invoice.invoiceRegistrationNumber && (
                                <p style={{ margin: '4px 0 0 0', fontSize: '10pt' }}>登録番号: {invoice.invoiceRegistrationNumber}</p>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div style={{ marginBottom: '20px' }}>
                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0, borderTop: '1px solid #e0e0e0', borderLeft: '1px solid #e0e0e0', fontSize: '9pt' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9f9f9' }}>
                                    <th style={{ padding: '10px', fontWeight: 'normal', width: '50%', textAlign: 'center', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>品名</th>
                                    <th style={{ padding: '10px', fontWeight: 'normal', width: '10%', textAlign: 'center', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>数量</th>
                                    <th style={{ padding: '10px', fontWeight: 'normal', width: '20%', textAlign: 'center', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>単価</th>
                                    <th style={{ padding: '10px', fontWeight: 'normal', width: '20%', textAlign: 'center', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>金額</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item) => {
                                    // Check if item is effectively empty to render blank cells
                                    const isEmpty = item.description === '' && item.quantity === 0 && item.unitPrice === 0;
                                    return (
                                        <tr key={item.id}>
                                            <td style={{ padding: '10px', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>{item.description || '\u00A0'}</td>
                                            <td style={{ padding: '10px', textAlign: 'right', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                                                {isEmpty ? '\u00A0' : item.quantity}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'right', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                                                {isEmpty ? '\u00A0' : formatCurrency(item.unitPrice)}
                                            </td>
                                            <td style={{ padding: '10px', textAlign: 'right', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
                                                {isEmpty ? '\u00A0' : formatCurrency(item.quantity * item.unitPrice)}
                                            </td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={2} style={{ border: 'none', borderRight: '1px solid #e0e0e0' }}></td>
                                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>小計</td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>{formatCurrency(subtotal)}</td>
                                </tr>
                                {invoice.enableTax && (
                                    <tr>
                                        <td colSpan={2} style={{ border: 'none', borderRight: '1px solid #e0e0e0' }}></td>
                                        <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', backgroundColor: '#f9f9f9' }}>消費税 (10%)</td>
                                        <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>{formatCurrency(tax)}</td>
                                    </tr>
                                )}
                                <tr>
                                    <td colSpan={2} style={{ border: 'none', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', backgroundColor: 'white' }}></td>
                                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>総額</td>
                                    <td style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0' }}>{formatCurrency(total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Bank Info & Notes */}
                    <div style={{ fontSize: '10pt', lineHeight: 1.6, fontFamily: '"Roboto", "Noto Sans JP", sans-serif' }}>

                        <p style={{ margin: '40px 0 2px 0' }}>下記口座へのお振り込みをお願いいたします。</p>
                        <p style={{ margin: '0 0 20px 0' }}>振り込み手数料は貴社負担でお願いいたします。</p>
                        <p style={{ whiteSpace: 'pre-line', marginBottom: '10px' }}>
                            銀行名： {invoice.bankName}<br />
                            支店名： {invoice.bankBranch}<br />
                            口座番号： {invoice.bankAccountNumber}<br />
                            口座名義： {invoice.bankAccountHolder}
                        </p>
                        <p style={{ textDecoration: 'underline', marginBottom: '40px' }}>お支払い期日： {formatDate(invoice.dueDate)}</p>

                    </div>

                    {/* Notes Box (Always visible) */}
                    <div style={{ border: '1px solid #333', padding: '15px', minHeight: '60px', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span style={{ fontWeight: 'normal', minWidth: '40px' }}>備考</span>
                            <span style={{ whiteSpace: 'pre-line' }}>{invoice.notes}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};
