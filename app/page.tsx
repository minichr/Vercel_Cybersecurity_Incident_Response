"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Target,
  Bot,
  Server,
  Monitor,
  Network,
  RotateCcw,
  Trash2,
} from "lucide-react"
import LogUpload from "@/components/log-upload"
import IOCAnalysis from "@/components/ioc-analysis"
import RecommendationSteps from "@/components/recommendation-steps"
import ChatInterface from "@/components/chat-interface"
import AttackTimeline from "@/components/attack-timeline"

interface IncidentData {
  logs: any[]
  iocs: any[]
  recommendations: any[]
  severity: "unknown" | "low" | "medium" | "high" | "critical"
  status: "initial" | "analyzing" | "complete"
}

const initialIncidentData: IncidentData = {
  logs: [],
  iocs: [],
  recommendations: [],
  severity: "unknown",
  status: "initial",
}

export default function CybersecurityAgent() {
  const [incidentData, setIncidentData] = useState<IncidentData>(initialIncidentData)
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("upload")

  const handleReset = () => {
    setIncidentData(initialIncidentData)
    setActiveStep(0)
    setProgress(0)
    setActiveTab("upload")
  }

  const handleLogUpload = (logs: any[]) => {
    // Use functional updates to avoid race conditions
    setIncidentData((prev) => ({ ...prev, logs, status: "analyzing" }))
    setProgress(25)

    // Simulate analysis with proper async handling
    setTimeout(() => {
      const mockIOCs = [
        {
          type: "IP Address",
          value: "192.168.1.100",
          severity: "critical",
          description: "Command & Control server - Multiple connections detected",
          timestamp: "2024-01-15 14:25:19",
        },
        {
          type: "File Hash",
          value: "a1b2c3d4e5f67890abcdef1234567890",
          severity: "critical",
          description: "Trojan.Win32.Agent.ABC - Malware signature in system32",
          timestamp: "2024-01-15 14:25:20",
        },
        {
          type: "Domain",
          value: "c2-server.malicious-domain.com",
          severity: "high",
          description: "Malicious domain used for C2 communication",
          timestamp: "2024-01-15 14:27:30",
        },
        {
          type: "File Path",
          value: "C:\\Windows\\System32\\malware.exe",
          severity: "critical",
          description: "Malicious executable in system directory",
          timestamp: "2024-01-15 14:25:20",
        },
        {
          type: "Registry Key",
          value: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
          severity: "high",
          description: "Persistence mechanism - Startup entry created",
          timestamp: "2024-01-15 14:25:21",
        },
        {
          type: "Process",
          value: "svchost.exe (PID: 4892)",
          severity: "medium",
          description: "Suspicious svchost process with unusual network activity",
          timestamp: "2024-01-15 14:25:18",
        },
      ]

      const mockRecommendations = [
        {
          id: 1,
          title: "Immediate Network Isolation",
          description: "Isolate infected endpoint and block malicious IP addresses",
          priority: "critical",
          status: "pending",
          estimatedTime: "5 minutes",
          steps: [
            "Disconnect endpoint from network immediately",
            "Block IP 192.168.1.100 at firewall level",
            "Block domain c2-server.malicious-domain.com in DNS",
            "Quarantine user account john.doe",
          ],
        },
        {
          id: 2,
          title: "Malware Containment",
          description: "Stop malicious processes and prevent further execution",
          priority: "critical",
          status: "pending",
          estimatedTime: "10 minutes",
          steps: [
            "Terminate process PID 4892 (malicious svchost.exe)",
            "Delete file C:\\Windows\\System32\\malware.exe",
            "Remove registry persistence entries",
            "Stop any related services (FakeService)",
          ],
        },
        {
          id: 3,
          title: "Evidence Preservation",
          description: "Collect forensic evidence before cleanup",
          priority: "high",
          status: "pending",
          estimatedTime: "20 minutes",
          steps: [
            "Create memory dump of infected system",
            "Backup system and security event logs",
            "Document all IOCs and attack timeline",
            "Preserve network traffic captures",
            "Screenshot ransom note and encrypted files",
          ],
        },
        {
          id: 4,
          title: "Lateral Movement Assessment",
          description: "Check for spread to other systems",
          priority: "high",
          status: "pending",
          estimatedTime: "30 minutes",
          steps: [
            "Scan network for IOCs on other endpoints",
            "Check SERVER01 for compromise indicators",
            "Review authentication logs for suspicious logins",
            "Analyze network traffic for lateral movement",
          ],
        },
        {
          id: 5,
          title: "Data Impact Assessment",
          description: "Determine scope of data encryption and exfiltration",
          priority: "medium",
          status: "pending",
          estimatedTime: "45 minutes",
          steps: [
            "Catalog encrypted files (1,247 files affected)",
            "Assess 500MB data exfiltration impact",
            "Check backup integrity and availability",
            "Determine data classification of affected files",
          ],
        },
        {
          id: 6,
          title: "System Recovery",
          description: "Clean and restore affected systems",
          priority: "medium",
          status: "pending",
          estimatedTime: "2 hours",
          steps: [
            "Run full antimalware scan with updated signatures",
            "Restore encrypted files from clean backups",
            "Rebuild system if rootkit detected",
            "Apply security patches and updates",
            "Reset compromised user credentials",
          ],
        },
      ]

      // Use functional updates to ensure proper state management
      setIncidentData((prev) => ({
        ...prev,
        iocs: mockIOCs,
        recommendations: mockRecommendations,
        severity: "critical" as const,
        status: "complete" as const,
      }))
      setProgress(100)
    }, 3000)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      case "unknown":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityLabel = (severity: string, status: string) => {
    if (status === "initial") {
      return "PENDING"
    }
    if (status === "analyzing") {
      return "ANALYZING"
    }
    return severity.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cybersecurity AI Agent</h1>
              <p className="text-slate-400">Incident Response & Threat Analysis</p>
            </div>
          </div>

          {/* Reset Button - Only show when there's data */}
          {(incidentData.logs.length > 0 || incidentData.status !== "initial") && (
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                New Incident
              </Button>
              <Button onClick={handleReset} variant="destructive" size="sm" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Status Overview */}
        <Card className="mb-6 bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-400" />
                  Incident Status
                  {incidentData.status === "initial" && (
                    <Badge variant="outline" className="ml-2">
                      Ready
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {incidentData.status === "initial"
                    ? "Upload log files to begin incident analysis"
                    : incidentData.status === "analyzing"
                      ? "Analyzing uploaded logs for threats and indicators"
                      : "Current analysis progress and severity assessment"}
                </CardDescription>
              </div>
              <Badge
                className={`${getSeverityColor(incidentData.severity)} text-white`}
                variant={incidentData.status === "initial" ? "outline" : "default"}
              >
                {getSeverityLabel(incidentData.severity, incidentData.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Analysis Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-sm">Logs: {incidentData.logs.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-red-400" />
                  <span className="text-sm">IOCs: {incidentData.iocs.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm">Actions: {incidentData.recommendations.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">Status: {incidentData.status}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Log Upload & Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger value="iocs" className="flex items-center gap-2" disabled={incidentData.iocs.length === 0}>
                  <Search className="h-4 w-4" />
                  IOCs
                  {incidentData.iocs.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {incidentData.iocs.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="steps"
                  className="flex items-center gap-2"
                  disabled={incidentData.recommendations.length === 0}
                >
                  <CheckCircle className="h-4 w-4" />
                  Actions
                  {incidentData.recommendations.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {incidentData.recommendations.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="chat"
                  className="flex items-center gap-2"
                  disabled={incidentData.status === "initial"}
                >
                  <Bot className="h-4 w-4" />
                  AI Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <LogUpload onLogUpload={handleLogUpload} />
              </TabsContent>

              <TabsContent value="iocs" className="space-y-4">
                {incidentData.iocs.length > 0 ? (
                  <IOCAnalysis iocs={incidentData.iocs} />
                ) : (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Target className="h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No IOCs Detected</h3>
                      <p className="text-slate-400 text-center">Upload log files to begin IOC analysis</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                {incidentData.recommendations.length > 0 ? (
                  <RecommendationSteps
                    recommendations={incidentData.recommendations}
                    activeStep={activeStep}
                    onStepChange={setActiveStep}
                  />
                ) : (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle className="h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Recommendations Available</h3>
                      <p className="text-slate-400 text-center">
                        Complete log analysis to receive action recommendations
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                {incidentData.status !== "initial" ? (
                  <ChatInterface incidentData={incidentData} />
                ) : (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Bot className="h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">AI Assistant Ready</h3>
                      <p className="text-slate-400 text-center">
                        Upload and analyze logs to start chatting with the AI assistant
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Quick Actions & Timeline */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Monitor className="h-4 w-4 mr-2" />
                  Request Endpoint Logs
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Server className="h-4 w-4 mr-2" />
                  Get Server Logs
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Network className="h-4 w-4 mr-2" />
                  Network Traffic Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Initiate Containment
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Attack Timeline */}
            <AttackTimeline status={incidentData.status} />

            {/* AI Guidance */}
            <Alert className="bg-blue-950 border-blue-800">
              <Bot className="h-4 w-4" />
              <AlertTitle>AI Recommendation</AlertTitle>
              <AlertDescription>
                {incidentData.status === "initial"
                  ? "Upload log files to begin automated threat analysis and receive AI-powered incident response guidance."
                  : "Based on the analysis, this appears to be a targeted attack. Immediate containment is recommended to prevent lateral movement."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
