"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Search, Target, AlertTriangle, Copy, ExternalLink, Download, Eye } from "lucide-react"

interface IOC {
  type: string
  value: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: string
}

interface IOCAnalysisProps {
  iocs: IOC[]
}

export default function IOCAnalysis({ iocs }: IOCAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")

  const filteredIOCs = iocs.filter((ioc) => {
    const matchesSearch =
      ioc.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ioc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || ioc.severity === selectedSeverity
    return matchesSearch && matchesSeverity
  })

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
      ...filteredIOCs.map(
        (ioc) => `"${ioc.type}","${ioc.value}","${ioc.severity}","${ioc.description}","${ioc.timestamp}"`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "iocs.csv"
    a.click()
  }

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
              <CardDescription>{filteredIOCs.length} IOCs detected from log analysis</CardDescription>
            </div>
            <Button onClick={exportIOCs} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search IOCs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            <div className="flex gap-2">
              {["all", "critical", "high", "medium", "low"].map((severity) => (
                <Button
                  key={severity}
                  size="sm"
                  variant={selectedSeverity === severity ? "default" : "outline"}
                  onClick={() => setSelectedSeverity(severity)}
                  className="capitalize"
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>

          {/* IOC Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["critical", "high", "medium", "low"].map((severity) => {
              const count = iocs.filter((ioc) => ioc.severity === severity).length
              return (
                <div key={severity} className="text-center p-3 bg-slate-800 rounded-lg">
                  <div
                    className={`text-2xl font-bold ${
                      severity === "critical"
                        ? "text-red-400"
                        : severity === "high"
                          ? "text-orange-400"
                          : severity === "medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                    }`}
                  >
                    {count}
                  </div>
                  <div className="text-sm text-slate-400 capitalize">{severity}</div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* IOC List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {filteredIOCs.map((ioc, index) => (
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
              ))}

              {filteredIOCs.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No IOCs found matching your criteria</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
