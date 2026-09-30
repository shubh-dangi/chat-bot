import { useState } from "react"
import { Upload, FileText, CheckCircle2, Clock, Trash2, RotateCw } from "lucide-react"
import { Button } from "@/shared/components/ui/Button"
import { Badge } from "@/shared/components/ui/Badge"
import { DataTable, type Column } from "@/shared/components/data/DataTable"
import { useToast } from "@/shared/components/feedback/ToastContainer"

interface DocumentItem {
  id: string
  filename: string
  type: string
  size: string
  uploadedAt: string
  status: "Processed" | "Processing" | "Pending" | "Error"
}

const INITIAL_DOCS: DocumentItem[] = [
  {
    id: "doc-1",
    filename: "University_Academic_Curriculum_2026.pdf",
    type: "Syllabus / Regulations",
    size: "4.2 MB",
    uploadedAt: "Sep 12, 2026",
    status: "Processed",
  },
  {
    id: "doc-2",
    filename: "Hostel_Rules_and_Disciplinary_Code.pdf",
    type: "Student Handbook",
    size: "1.8 MB",
    uploadedAt: "Sep 18, 2026",
    status: "Processed",
  },
  {
    id: "doc-3",
    filename: "Campus_Placement_Eligibilities_2026_27.pdf",
    type: "Career Placement",
    size: "820 KB",
    uploadedAt: "Sep 25, 2026",
    status: "Processed",
  },
  {
    id: "doc-4",
    filename: "BCA_Semester_5_Lab_Manual.pdf",
    type: "Course Material",
    size: "2.1 MB",
    uploadedAt: "Sep 29, 2026",
    status: "Processing",
  },
]

export function DocumentManager() {
  const { success } = useToast()
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS)

  const handleSimulateUpload = () => {
    const newDoc: DocumentItem = {
      id: "doc-" + Date.now(),
      filename: `College_Circular_${new Date().toLocaleDateString().replace(/\//g, "_")}.pdf`,
      type: "Official Circular",
      size: "640 KB",
      uploadedAt: "Just now",
      status: "Processing",
    }
    setDocs((prev) => [newDoc, ...prev])
    success("Document queued for knowledge ingestion")

    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.id === newDoc.id ? { ...d, status: "Processed" } : d))
      )
      success("Document indexing complete")
    }, 2500)
  }

  const handleDelete = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
    success("Document removed from knowledge base")
  }

  const handleReprocess = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Processing" } : d))
    )
    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "Processed" } : d))
      )
      success("Document re-indexed successfully")
    }, 1500)
  }

  const columns: Column<DocumentItem>[] = [
    {
      header: "Document Name",
      cell: (d) => (
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-text-muted shrink-0" />
          <div className="min-w-0">
            <div className="font-semibold text-xs text-text-primary truncate">{d.filename}</div>
            <div className="text-[11px] text-text-muted">{d.size} • {d.uploadedAt}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "type",
      className: "text-xs text-text-secondary",
    },
    {
      header: "Status",
      cell: (d) => {
        const variant =
          d.status === "Processed"
            ? "success"
            : d.status === "Processing"
            ? "info"
            : "warning"

        return (
          <Badge variant={variant} size="sm" className="gap-1">
            {d.status === "Processed" ? (
              <CheckCircle2 className="w-3 h-3 text-status-success-text" />
            ) : (
              <Clock className="w-3 h-3 animate-spin" />
            )}
            <span>{d.status}</span>
          </Badge>
        )
      },
    },
    {
      header: "Actions",
      cell: (d) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReprocess(d.id)}
            title="Re-index document"
            className="h-7 w-7 p-0"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(d.id)}
            title="Delete document"
            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-neutral-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Campus Knowledge Documents</h2>
          <p className="text-xs text-text-secondary mt-1">
            Upload institutional PDFs and circulars for AI retrieval and conversational QA.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSimulateUpload} className="gap-2 shrink-0">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </Button>
      </div>

      <DataTable columns={columns} data={docs} keyExtractor={(d) => d.id} />
    </div>
  )
}
