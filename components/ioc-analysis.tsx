"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Target, AlertTriangle, Copy, ExternalLink, Download, Eye, FileText } from "lucide-react"
import LogViewerDialog from "./log-viewer-dialog"

interface IOC {
  type: string
  value: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: string
  logReferences?: {
    filename: string
    lineNumbers: number[]
    relevantLines: string[]
  }[]
}

interface IOCAnalysisProps {
  iocs: IOC[]
}

export default function IOCAnalysis({ iocs }: IOCAnalysisProps) {
  // Group IOCs by severity
  const groupedIOCs = {
    critical: iocs.filter((ioc) => ioc.severity === "critical"),
    high: iocs.filter((ioc) => ioc.severity === "high"),
    medium: iocs.filter((ioc) => ioc.severity === "medium"),
    low: iocs.filter((ioc) => ioc.severity === "low"),
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 hover:bg-red-600"
      case "high":
        return "bg-orange-500 hover:bg-orange-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      case "low":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "ip address":
        return "🌐"
      case "file hash":
        return "🔒"
      case "process":
        return "⚙️"
      case "registry key":
        return "📝"
      case "domain":
        return "🌍"
      case "url":
        return "🔗"
      case "user account":
        return "👤"
      case "file path":
        return "📁"
      default:
        return "📋"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportIOCs = () => {
    const csvContent = [
      "Type,Value,Severity,Description,Timestamp",
      ...iocs.map((ioc) => `"${ioc.type}","${ioc.value}","${ioc.severity}","${ioc.description}","${ioc.timestamp}"`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "iocs.csv"
    a.click()
  }

  const renderIOCCard = (ioc: IOC, index: number) => (
    <div key={index} className="p-4 bg-slate-800 rounded-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getTypeIcon(ioc.type)}</span>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {ioc.type}
              </Badge>
              <Badge className={`${getSeverityColor(ioc.severity)} text-white text-xs`}>
                {ioc.severity.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">{ioc.timestamp}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(ioc.value)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="font-mono text-sm bg-slate-950 p-2 rounded border">{ioc.value}</div>
        <p className="text-sm text-slate-300">{ioc.description}</p>
      </div>

      {/* Detailed Log References */}
      {ioc.logReferences && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">Log Evidence</span>
          </div>
          {ioc.logReferences.map((logRef, refIndex) => (
            <div key={refIndex} className="bg-slate-950 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-400">{logRef.filename}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {logRef.lineNumbers.length} line{logRef.lineNumbers.length !== 1 ? "s" : ""}
                  </Badge>
                  <LogViewerDialog filename={logRef.filename} highlightedLines={logRef.lineNumbers}>
                    <Button size="sm" variant="outline" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View Full Log
                    </Button>
                  </LogViewerDialog>
                </div>
              </div>
              <div className="space-y-1">
                {logRef.relevantLines.slice(0, 3).map((line, lineIndex) => (
                  <div key={lineIndex} className="flex gap-3 text-xs font-mono">
                    <span className="text-slate-500 w-12 text-right">{logRef.lineNumbers[lineIndex]}:</span>
                    <span className="text-slate-300 flex-1">{line}</span>
                  </div>
                ))}
                {logRef.relevantLines.length > 3 && (
                  <div className="text-xs text-slate-400 pl-15">
                    ... and {logRef.relevantLines.length - 3} more lines
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator className="my-3 bg-slate-700" />

      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="text-xs">
          <Eye className="h-3 w-3 mr-1" />
          Investigate
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Block
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-400" />
                Indicators of Compromise
              </CardTitle>
              <CardDescription>{iocs.length} IOCs detected from log analysis</CardDescription>
            </div>
            <Button onClick={exportIOCs} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* IOC Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["critical", "high", "medium", "low"].map((severity) => {
              const count = groupedIOCs[severity as keyof typeof groupedIOCs].length
              return (
                <div key={severity} className="text-center p-3 bg-slate-800 rounded-lg">
                  <div className={`text-2xl font-bold ${getSeverityTextColor(severity)}`}>{count}</div>
                  <div className="text-sm text-slate-400 capitalize">{severity}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* IOC List Organized by Severity */}
      <div className="space-y-6">
        {["critical", "high", "medium", "low"].map((severity) => {
          const severityIOCs = groupedIOCs[severity as keyof typeof groupedIOCs]
          if (severityIOCs.length === 0) return null

          return (
            <Card key={severity} className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${getSeverityTextColor(severity)}`}>
                  <AlertTriangle className="h-5 w-5" />
                  {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity IOCs
                  <Badge className={`${getSeverityColor(severity)} text-white ml-auto`}>{severityIOCs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">{severityIOCs.map((ioc, index) => renderIOCCard(ioc, index))}</div>
                </ScrollArea>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {iocs.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-slate-400 mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No IOCs Detected</h3>
            <p className="text-slate-400 text-center">Upload log files to begin IOC analysis</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
