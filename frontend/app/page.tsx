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
      const contentWidth = pdfWidth - margin * 2;

      let currentY = margin;

      // Capture header
      const header = element.querySelector(".bg-indigo-600");
      if (header) {
        const headerCanvas = await html2canvas(header as HTMLElement, {
          scale: 1.5,
          backgroundColor: "#4F46E5",
          useCORS: true,
          logging: false,
        });

        const headerImgData = headerCanvas.toDataURL("image/png", 1.0);
        const headerHeight =
          (headerCanvas.height * contentWidth) / headerCanvas.width;

        pdf.addImage(
          headerImgData,
          "PNG",
          margin,
          currentY,
          contentWidth,
          headerHeight,
          undefined,
          "FAST"
        );
        currentY += headerHeight + 5;
      }

      // Capture KPIs
      const kpis = element.querySelector(".grid.grid-cols-2.sm\\:grid-cols-3");
      if (kpis) {
        const kpisCanvas = await html2canvas(kpis as HTMLElement, {
          scale: 1.5,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
        });

        const kpisImgData = kpisCanvas.toDataURL("image/png", 1.0);
        const kpisHeight =
          (kpisCanvas.height * contentWidth) / kpisCanvas.width;

        pdf.addImage(
          kpisImgData,
          "PNG",
          margin,
          currentY,
          contentWidth,
          kpisHeight,
          undefined,
          "FAST"
        );
        currentY += kpisHeight + 5;
      }

      // Get all chart cards
      const chartCards = Array.from(
        element.querySelectorAll("[data-chart-card]")
      );

      // ========== DYNAMIC CHART PROCESSING ==========
      // Process charts one by one, automatically adding pages as needed
      for (let chartIndex = 0; chartIndex < chartCards.length; chartIndex++) {
        const card = chartCards[chartIndex] as HTMLElement;

        const cardCanvas = await html2canvas(card, {
          scale: 1.5,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          allowTaint: true,
          imageTimeout: 15000,
        });

        const cardImgData = cardCanvas.toDataURL("image/png", 1.0);
        const cardWidth = contentWidth;
        const cardHeight =
          (cardCanvas.height * cardWidth) / cardCanvas.width;

        // Check if card fits on current page
        if (currentY + cardHeight > pdfHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(
          cardImgData,
          "PNG",
          margin,
          currentY,
          cardWidth,
          cardHeight,
          undefined,
          "FAST"
        );
        currentY += cardHeight + 5;

        console.log(`Processed chart ${chartIndex + 1}/${chartCards.length}`);
      }

      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `${dashboardData.title.replace(
        /[^a-z0-9]/gi,
        "_"
      )}_${timestamp}.pdf`;

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
          {/* <div className="origin-top scale-[0.86] min-h-[116%]"> */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
">
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
              <Dashboard />
            </div>
          </div>
          </div>
        {/* </div> */}
      </main>

      {/* ================= FLOATING CHAT BUTTON ================= */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-500/50 transition-all z-40 flex items-center gap-2 no-print"
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="font-semibold">AI Assistant</span>
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