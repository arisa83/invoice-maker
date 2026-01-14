import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePDF = async (elementId: string, fileName: string = 'invoice.pdf') => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        // Clone the element to render it without CSS transforms (scaling)
        const clone = element.cloneNode(true) as HTMLElement;

        // Style the clone to ensure it renders at full A4 size without external influence
        clone.style.position = 'fixed';
        clone.style.top = '-10000px';
        clone.style.left = '-10000px';
        clone.style.transform = 'none'; // Reset any scaling
        clone.style.margin = '0';
        clone.style.zIndex = '-1000';
        // Ensure explicit dimensions are respected
        clone.style.width = '210mm';
        clone.style.height = '297mm';
        clone.style.minWidth = '210mm'; // Ensure min-width doesn't break layout
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';

        // Reset inner content scaling (The div inside #invoice-preview)
        // Structure: #invoice-preview -> div (scaled) -> content
        const innerContent = clone.firstElementChild as HTMLElement;
        if (innerContent) {
            innerContent.style.transform = 'none';
            innerContent.style.width = '100%';
        }

        document.body.appendChild(clone);

        // Wait for images/fonts in the clone (brief delay can help, though html2canvas usually waits for load)
        // Using a small timeout to let the DOM settle
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(clone, {
            scale: 4, // High resolution (increased from 2)
            useCORS: true,
            logging: false, // Disable logging for cleaner console
            allowTaint: true, // Allow cross-origin images if useCORS fails
            backgroundColor: '#ffffff', // Ensure white background
            windowWidth: 210 * 3.78, // Approx px for 210mm (96dpi) - ensures correct viewport
            windowHeight: 297 * 3.78,
            onclone: (clonedDoc) => {
                // Ensure translate="no" is preserved or enforced if needed
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.transform = 'none';
                }
            }
        });

        // Clean up
        document.body.removeChild(clone);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(fileName);
    } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('PDFの生成に失敗しました。');
    }
};
