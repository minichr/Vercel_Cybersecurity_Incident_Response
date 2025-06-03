"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, Server, Monitor, Network, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface LogUploadProps {
  onLogUpload: (logs: any[]) => void
}

export default function LogUpload({ onLogUpload }: LogUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (!files) return

      setIsUploading(true)
      setUploadProgress(0)

      // Simulate file upload and processing
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)

            // Use setTimeout to avoid state update during render
            setTimeout(() => {
              setIsUploading(false)

              // Mock log data
              const mockLogs = Array.from(files).map((file) => ({
                filename: file.name,
                size: file.size,
                type: file.name.includes("endpoint") ? "endpoint" : file.name.includes("server") ? "server" : "network",
                entries: Math.floor(Math.random() * 1000) + 100,
                timeRange: "2024-01-15 14:00:00 - 14:35:00",
              }))

              setUploadedFiles(Array.from(files).map((f) => f.name))
              onLogUpload(mockLogs)
            }, 0)

            return 100
          }
          return prev + 10
        })
      }, 200)

      // Reset the file input
      event.target.value = ""
    },
    [onLogUpload],
  )

  const logTypes = [
    {
      type: "endpoint",
      title: "Endpoint Logs",
      description: "Windows Event Logs, Sysmon, Process logs",
      icon: Monitor,
      examples: ["Security.evtx", "System.evtx", "Sysmon.evtx"],
    },
    {
      type: "server",
      title: "Server Logs",
      description: "Web server, Database, Application logs",
      icon: Server,
      examples: ["access.log", "error.log", "audit.log"],
    },
    {
      type: "network",
      title: "Network Logs",
      description: "Firewall, IDS/IPS, DNS logs",
      icon: Network,
      examples: ["firewall.log", "suricata.log", "dns.log"],
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-400" />
            Log Upload & Analysis
          </CardTitle>
          <CardDescription>
            Upload logs from infected endpoints, servers, or network devices for analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drop log files here or click to browse</h3>
            <p className="text-slate-400 mb-4">Supports .log, .txt, .evtx, .json, .csv files</p>
            <input
              type="file"
              multiple
              accept=".log,.txt,.evtx,.json,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="log-upload"
            />
            <Button asChild variant="outline" disabled={isUploading}>
              <label htmlFor="log-upload" className="cursor-pointer">
                {isUploading ? "Processing..." : "Select Files"}
              </label>
            </Button>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing logs...</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Alert className="bg-green-950 border-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully uploaded {uploadedFiles.length} log file(s): {uploadedFiles.join(", ")}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Log Type Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {logTypes.map((logType) => {
          const IconComponent = logType.icon
          return (
            <Card key={logType.type} className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <IconComponent className="h-4 w-4 text-blue-400" />
                  {logType.title}
                </CardTitle>
                <CardDescription className="text-xs">{logType.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {logType.examples.map((example) => (
                    <Badge key={example} variant="secondary" className="text-xs">
                      {example}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Request Buttons */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm">Quick Log Requests</CardTitle>
          <CardDescription className="text-xs">Request specific logs from your security infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="justify-start">
              <AlertCircle className="h-4 w-4 mr-2" />
              Security Events
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Process Logs
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Network className="h-4 w-4 mr-2" />
              Network Traffic
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Server className="h-4 w-4 mr-2" />
              System Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
