import { useState, useRef, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { QuoteForm } from './components/QuoteForm';
import { QuotePreview } from './components/QuotePreview';
import { initialQuote } from './types';
import type { Quote } from './types';
import { generatePDF } from './utils/pdfGenerator';
import './index.css';

function App() {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.6);
  const [contentHeight, setContentHeight] = useState(1123); // Default A4 height
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [quote, activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        // A4 width in px (approx 210mm at 96dpi) -> 794px
        // Add some padding buffer (2rem = 32px * 2 = 64px)
        const targetWidth = 794;
        const padding = 64;
        const availableWidth = containerWidth - padding;

        // Calculate scale to fit width. 
        // Allow sizing up to 1.0 (original size), but maintain fit for smaller screens.
        // User asked to "fill the area", but usually A4 shouldn't be stretched beyond 100% too much.
        // Let's cap at 1.0 for now to ensure crisp text, unless screen is huge?
        // Actually, if screen is small (mobile), it scales down. 
        // If screen is large, it should sit at 1.0 or comfortably fill.
        // Let's settle on Math.min(1, ...) to keep it sane, but ensure it uses available width.
        // Wait, if the grey zone IS the viewport width (mobile), we need to fit.

        let newScale = availableWidth / targetWidth;
        // Cap at 1.2 to avoid getting too huge, but allow some zoom above 1.0 if space allows?
        // Or strictly 1.0? 1.0 is safe. 
        // User said "grey zone ippai ni". If grey zone is 1000px, and A4 is 794px, 1.0 leaves 100px margins.
        // That's fine. It's "filling" as much as the paper size allows.
        newScale = Math.min(1, Math.max(0.2, newScale));

        setPreviewScale(newScale);
      }
    };

    // Initial calculation
    handleResize();

    // Use ResizeObserver for more robust sizing than window 'resize'
    const resizeObserver = new ResizeObserver(handleResize);
    if (previewContainerRef.current) {
      resizeObserver.observe(previewContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [activeTab]);

  const handleDownload = async () => {
    setIsGenerating(true);
    // プレビューを見える状態にするためにタブを切り替える（モバイル対応）
    const wasEditMode = activeTab === 'edit';
    if (wasEditMode && window.innerWidth < 1024) {
      setActiveTab('preview');
      // レンダリング待ち
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const dateObj = new Date(quote.date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    // Remove honorifics and newlines for filename safety, fallback to 'Unknown'
    const safeClientName = (quote.toName || 'Client').split('\n')[0].replace(/御中|様/g, '').replace(/[\\/:*?"<>|]/g, '').trim() || 'Client';
    const fileName = `${year}年${month}月_${safeClientName}様御見積書.pdf`;

    await generatePDF('quote-preview', fileName);
    setIsGenerating(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid var(--color-border)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <FileText size={24} />
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              見積書つくる君
            </h1>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={isGenerating}
          >
            {isGenerating ? '生成中...' : <><Download size={18} /> PDFを保存</>}
          </button>
        </div>
      </header>

      {/* Mobile Tabs */}
      <div className="lg-hidden" style={{ padding: '1rem 1rem 0 1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          className={`btn ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => setActiveTab('edit')}
        >
          編集
        </button>
        <button
          className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1 }}
          onClick={() => setActiveTab('preview')}
        >
          プレビュー
        </button>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-hidden { display: none !important; }
          .lg-flex { display: flex !important; }
          .grid-layout { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 2rem; 
            padding-bottom: 2rem;
            /* height constraint moved to panels for sticky behavior */
            align-items: start; /* Important for sticky */
          }
          .scroll-panel {
            /* height: 100%; removed to allow content to flow naturally, or set specific height for scroll */
          }
        }
      `}</style>

      {/* Main Content */}
      <main className="container grid-layout" style={{ flex: 1, paddingTop: '1rem', paddingBottom: '2rem' }}>
        {/* Editor Panel */}
        <div className="scroll-panel" style={{
          display: activeTab === 'edit' || window.innerWidth >= 1024 ? 'block' : 'none'
        }}>
          <QuoteForm quote={quote} onChange={setQuote} />
        </div>

        {/* Preview Panel */}
        <div className="scroll-panel" style={{
          display: activeTab === 'preview' || window.innerWidth >= 1024 ? 'flex' : 'none',
          justifyContent: 'center',
          backgroundColor: '#52525b', // Darker gray background for better contrast
          borderRadius: 'var(--radius-lg)',
          margin: window.innerWidth < 1024 ? '20px 0' : '0',
          position: window.innerWidth >= 1024 ? 'sticky' : 'relative',
          top: window.innerWidth >= 1024 ? '0' : 'auto',
          height: window.innerWidth >= 1024 ? 'calc(100vh - 120px)' : 'auto', // Adjust height to fit viewport minus header
          padding: '2rem',
          overflowY: 'auto', // Allow internal scrolling if preview is taller than screen
          overflowX: 'hidden' // Prevent horizontal scroll from scale
        }}
          ref={previewContainerRef}
        >
          <div style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
            // Ensure the element takes up its space but doesn't force parent scroll
            width: '794px',
            minWidth: '794px', // FORCE layout width to A4 size, preventing squash on mobile
            maxWidth: 'none',  // Override any global max-width (e.g. 100%) constraints
            height: `${contentHeight * previewScale}px`, // Dynamic height to crop ghost space
            // overflow: 'hidden' // Removed to avoid clipping shadows/long content
          }}>
            <div ref={contentRef} style={{ width: '100%', minHeight: '1123px' }}>
              <QuotePreview quote={quote} />
            </div>
          </div>

          {/* Preview Badge */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)'
          }}>
            <FileText size={16} />
            <span>プレビュー</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        padding: '2rem 1rem',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '0.875rem',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <a href="/" style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            color: 'var(--color-primary)',
            backgroundColor: 'transparent',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
          >
            ホームに戻る
          </a>
          <div>&copy; 2026 Vibe App Hub</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
