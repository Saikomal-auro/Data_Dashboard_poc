  "use client";

  import React, { useRef, useState } from "react";
  import dynamic from "next/dynamic";
  import html2canvas from "html2canvas";
  import jsPDF from "jspdf";
  import { Download, Loader2 } from "lucide-react";

  import { Dashboard } from "../components/Dashboard";
  import { Button } from "@/components/ui/button";

  /* ================= CHAT POPUP ================= */

  const ChatPopup = dynamic(() => import("../components/ChatPopup"), {
    ssr: false,
  });

  /* ================= TYPES ================= */

  type DashboardData = {
    title: string;
    payload: any;
  };

  /* ================= STATIC DASHBOARD DATA ================= */

  const staticDashboardPayload = {
    mode: "static",
  };

  /* ================= PAGE ================= */

  export default function Home() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const [dashboardData] = useState<DashboardData>({
      title: "Business Performance Dashboard",
      payload: staticDashboardPayload,
    });

    /* ================= IMPROVED PDF GENERATION ================= */

    const dashboardRef = useRef<HTMLDivElement>(null);

const handlePrint = async () => {
  if (!dashboardRef.current) return;

  setIsDownloading(true);

  try {
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 2000));

    const element = dashboardRef.current;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pdfWidth - (margin * 2);
    const maxContentHeight = pdfHeight - (margin * 2);

    let isFirstPage = true;

    // ========== PAGE 1: HEADER + KPIs + SALES OVERVIEW ==========
    let currentY = margin;

    // Capture header
    const header = element.querySelector('.bg-indigo-600');
    if (header) {
      const headerCanvas = await html2canvas(header as HTMLElement, {
        scale: 2.5,
        backgroundColor: "#4F46E5",
        useCORS: true,
        logging: false,
      });

      const headerImgData = headerCanvas.toDataURL("image/png", 1.0);
      const headerHeight = (headerCanvas.height * contentWidth) / headerCanvas.width;

      pdf.addImage(headerImgData, "PNG", margin, currentY, contentWidth, headerHeight, undefined, "FAST");
      currentY += headerHeight + 5;
    }

    // Capture KPIs
    const kpis = element.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3');
    if (kpis) {
      const kpisCanvas = await html2canvas(kpis as HTMLElement, {
        scale: 2.5,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
      });

      const kpisImgData = kpisCanvas.toDataURL("image/png", 1.0);
      const kpisHeight = (kpisCanvas.height * contentWidth) / kpisCanvas.width;

      pdf.addImage(kpisImgData, "PNG", margin, currentY, contentWidth, kpisHeight, undefined, "FAST");
      currentY += kpisHeight + 5;
    }

    // Get all chart cards
    const chartCards = Array.from(element.querySelectorAll('[data-chart-card]'));

    // Define chart groups (customize based on your needs)
    const chartGroups = [
      [0], // Page 1: Sales Overview (already added KPIs above)
      [1, 2], // Page 2: Product Performance + Sales by Category
      [3, 4], // Page 3: Category Mix + Sales vs Profit
      [5, 6], // Page 4: Product Contribution + Customer Transactions
      [7], // Page 5: Sales Comparison Multi-line
    ];

    for (let groupIndex = 0; groupIndex < chartGroups.length; groupIndex++) {
      const chartIndices = chartGroups[groupIndex];
      
      // Add new page for each group (except first if we already have content)
      if (groupIndex > 0 || currentY > margin + 50) {
        pdf.addPage();
        currentY = margin;
      }

      for (const chartIndex of chartIndices) {
        if (chartIndex >= chartCards.length) continue;

        const card = chartCards[chartIndex] as HTMLElement;

        const cardCanvas = await html2canvas(card, {
          scale: 2.5,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          allowTaint: true,
          imageTimeout: 15000,
        });

        const cardImgData = cardCanvas.toDataURL("image/png", 1.0);
        const cardWidth = contentWidth;
        const cardHeight = (cardCanvas.height * cardWidth) / cardCanvas.width;

        // Check if card fits on current page
        if (currentY + cardHeight > pdfHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(cardImgData, "PNG", margin, currentY, cardWidth, cardHeight, undefined, "FAST");
        currentY += cardHeight + 5;

        console.log(`Processed chart ${chartIndex + 1}/${chartCards.length}`);
      }
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `${dashboardData.title.replace(/[^a-z0-9]/gi, "_")}_${timestamp}.pdf`;
    
    pdf.save(fileName);

  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    setIsDownloading(false);
  }
};

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* ================= HEADER ================= */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 shadow-sm sticky top-0 z-30 no-print">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-indigo-600">
                Data Analysis Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Static preview (AI-powered updates coming next)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrint}
                disabled={isDownloading}
                className="bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50"
                size="default"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* ================= MAIN ================= */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* ================= DASHBOARD (PRINTABLE) ================= */}
            <div
              ref={dashboardRef}
              data-dashboard-ref
              className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="bg-indigo-600 px-8 py-5 text-white">
                <h2 className="text-2xl font-bold">{dashboardData.title}</h2>
                <p className="text-indigo-200 text-sm">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="p-8 bg-white">
                <Dashboard  />
              </div>
            </div>
          </div>
        </main>

        {/* ================= FLOATING CHAT BUTTON ================= */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 transition-all z-40 no-print"
          >
            💬 AI Assistant
          </button>
        )}

        {/* ================= CHAT POPUP ================= */}
        {isChatOpen && (
          <ChatPopup
            onClose={() => setIsChatOpen(false)}
            onDashboardGenerated={() => {}}
          />
        )}
      </div>
    );
  }