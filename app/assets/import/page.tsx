"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, RefreshCw, FileUp } from "lucide-react"

export default function AssetImportPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [importStep, setImportStep] = useState(1)
  const [importProgress, setImportProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename)
  }

  const handleStartImport = () => {
    setImportStep(2)
    setImportStatus("processing")
    setImportProgress(0)

    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setImportStatus("success")
          setImportStep(3)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  // Sample import history
  const importHistory = [
    {
      id: "import-001",
      filename: "asset-inventory-2025-05-20.csv",
      date: "2025-05-20T14:30:00Z",
      status: "success",
      records: 245,
      imported: 245,
      errors: 0,
    },
    {
      id: "import-002",
      filename: "network-devices-2025-05-15.xlsx",
      date: "2025-05-15T10:15:00Z",
      status: "success",
      records: 94,
      imported: 94,
      errors: 0,
    },
    {
      id: "import-003",
      filename: "workstations-2025-05-10.csv",
      date: "2025-05-10T09:45:00Z",
      status: "partial",
      records: 215,
      imported: 210,
      errors: 5,
    },
    {
      id: "import-004",
      filename: "servers-2025-05-05.xlsx",
      date: "2025-05-05T11:30:00Z",
      status: "error",
      records: 78,
      imported: 0,
      errors: 78,
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Success</Badge>
      case "partial":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Partial</Badge>
      case "error":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#006FCF]">Asset Inventory Import</h1>
          <p className="text-muted-foreground">Import your existing asset inventory from CSV or Excel files</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="border-[#006FCF] text-[#006FCF]"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="import">Import Assets</TabsTrigger>
          <TabsTrigger value="history">Import History</TabsTrigger>
        </TabsList>
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Asset Inventory</CardTitle>
              <CardDescription>Import your existing asset inventory from CSV or Excel files</CardDescription>
            </CardHeader>
            <CardContent>
              {importStep === 1 && (
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-[#006FCF] rounded-lg p-12 text-center">
                    <Upload className="mx-auto h-12 w-12 text-[#006FCF]" />
                    <h3 className="mt-4 text-lg font-semibold">Drag and drop your file here</h3>
                    <p className="text-sm text-muted-foreground mt-2">Supported formats: CSV, XLSX, XLS</p>
                    <Button className="mt-4 bg-[#006FCF] hover:bg-[#004F93]">Browse Files</Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Or select a template file</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: "General Asset Template", type: "CSV", size: "12KB" },
                        { name: "Network Devices Template", type: "XLSX", size: "15KB" },
                        { name: "Server Inventory Template", type: "CSV", size: "10KB" },
                        { name: "Workstation Template", type: "XLSX", size: "14KB" },
                      ].map((template, index) => (
                        <div
                          key={index}
                          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedFile === template.name ? "border-[#006FCF] bg-[#F0F7FF]" : "hover:border-[#006FCF]"
                          }`}
                          onClick={() => handleFileSelect(template.name)}
                        >
                          <FileSpreadsheet className="h-8 w-8 mr-4 text-[#006FCF]" />
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {template.type} • {template.size}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleStartImport}
                      disabled={!selectedFile}
                      className="bg-[#006FCF] hover:bg-[#004F93]"
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Start Import
                    </Button>
                  </div>
                </div>
              )}

              {importStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <h3 className="text-xl font-semibold mb-4">Importing {selectedFile}...</h3>
                    <Progress value={importProgress} className="h-2 mb-2" />
                    <p className="text-sm text-muted-foreground">{importProgress}% complete</p>
                  </div>
                </div>
              )}

              {importStep === 3 && (
                <div className="space-y-6 py-8">
                  <div className="text-center">
                    {importStatus === "success" ? (
                      <>
                        <CheckCircle className="mx-auto h-16 w-16 text-[#00A859]" />
                        <h3 className="text-xl font-semibold mt-4 mb-2">Import Completed Successfully</h3>
                        <p className="text-muted-foreground mb-6">All assets have been imported into your inventory</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mx-auto h-16 w-16 text-[#D5001F]" />
                        <h3 className="text-xl font-semibold mt-4 mb-2">Import Failed</h3>
                        <p className="text-muted-foreground mb-6">There was an error importing your assets</p>
                      </>
                    )}

                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setImportStep(1)}
                        className="border-[#006FCF] text-[#006FCF]"
                      >
                        Import Another File
                      </Button>
                      <Button className="bg-[#006FCF] hover:bg-[#004F93]">View Asset Inventory</Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Import History</CardTitle>
              <CardDescription>View the history of your asset inventory imports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead className="text-right">Imported</TableHead>
                    <TableHead className="text-right">Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {importHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.filename}</TableCell>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">{item.records}</TableCell>
                      <TableCell className="text-right">{item.imported}</TableCell>
                      <TableCell className="text-right">{item.errors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
