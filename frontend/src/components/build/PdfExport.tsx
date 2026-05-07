import { useRef } from "react";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/currency";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

/**
 * PdfExport — Export the current build summary as a styled PDF.
 * Uses html2canvas + jsPDF.
 */
export default function PdfExport() {
  const { currentBuild, currency } = useStore();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!currentBuild) return;

    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const el = document.getElementById("build-summary");
      if (!el) {
        toast.error("Build summary not found");
        return;
      }

      const canvas = await html2canvas(el, {
        backgroundColor: "#0a1929",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(0, 230, 138);
      pdf.text("SmartBuild AI — PC Build Report", 15, 20);

      // Subtitle
      pdf.setFontSize(12);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Tier: ${currentBuild.tier.toUpperCase()} | Budget: ${formatCurrency(currentBuild.budget, currency)}`, 15, 30);
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 15, 37);

      // Add screenshot
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 15, 45, imgWidth, Math.min(imgHeight, 200));

      // Component list as text (below image)
      let y = 45 + Math.min(imgHeight, 200) + 10;
      if (y > 260) {
        pdf.addPage();
        y = 20;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 230, 138);
      pdf.text("Components", 15, y);
      y += 8;

      pdf.setFontSize(10);
      pdf.setTextColor(200, 200, 200);
      currentBuild.components.forEach((comp) => {
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
        pdf.text(`• ${comp.category.toUpperCase()}: ${comp.name} — ${formatCurrency(comp.price_converted, currency)}`, 15, y);
        y += 6;
      });

      y += 4;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 230, 138);
      pdf.text(`Total: ${formatCurrency(currentBuild.total_cost, currency)}`, 15, y);

      pdf.save(`smartbuild-${currentBuild.tier}-${Date.now()}.pdf`);
      toast.success("PDF exported!");
    } catch (err) {
      toast.error("Failed to export PDF");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  if (!currentBuild) return null;

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="glow-btn flex items-center gap-2 text-sm"
      id="export-pdf-btn"
    >
      {exporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
      {exporting ? "Exporting..." : "Export PDF"}
    </button>
  );
}
