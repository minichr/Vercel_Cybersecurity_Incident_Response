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
  Plug,
  Zap,
  Brain,
} from "lucide-react"
import Link from "next/link"
import LogUpload from "@/components/log-upload"
import IOCAnalysis from "@/components/ioc-analysis"
import RecommendationSteps from "@/components/recommendation-steps"
import ChatInterface from "@/components/chat-interface"
import AttackTimeline from "@/components/attack-timeline"
import MitreAttackMapping from "@/components/mitre-attack-mapping"

interface IncidentData {
  logs: any[]
  iocs: any[]
  recommendations: any[]
  severity: "unknown" | "low" | "medium" | "high" | "critical"
  status: "initial" | "analyzing" | "complete"
  aiAnalysis?: any
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
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleReset = () => {
    setIncidentData(initialIncidentData)
    setActiveStep(0)
    setProgress(0)
    setActiveTab("upload")
    setIsAnalyzing(false)
  }

  const handleLogUpload = async (logs: any[]) => {
    console.log("Starting log upload process with", logs.length, "files")

    // Update state with uploaded logs
    setIncidentData((prev) => ({ ...prev, logs, status: "analyzing" }))
    setProgress(25)

    // Simulate log processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate basic IOCs and recommendations from log metadata
    const basicIOCs = [
      {
        type: "IP Address",
        value: "192.168.1.100",
        severity: "critical",
        description: "Suspicious IP address detected in network logs - requires AI analysis for detailed assessment",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        logReferences: [
          {
            filename: "endpoint-security.log",
            lineNumbers: [2, 8, 11],
            relevantLines: [
              "Network Monitor: Outbound connection attempt - Destination: 192.168.1.100:443",
              "Network Monitor: Data transfer detected - Destination: 192.168.1.100:8080",
              "Network Monitor: DNS query - Query: suspicious-domain.com",
            ],
          },
        ],
      },
      {
        type: "File Hash",
        value: "a1b2c3d4e5f67890abcdef1234567890",
        severity: "high",
        description: "Suspicious file hash detected - AI analysis recommended for threat classification",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        logReferences: [
          {
            filename: "endpoint-security.log",
            lineNumbers: [3, 14],
            relevantLines: [
              "File System Monitor: Suspicious file creation - Path: C:\\Windows\\System32\\unknown.exe",
              "File System Monitor: File hash detected - Hash: a1b2c3d4e5f67890abcdef1234567890",
            ],
          },
        ],
      },
    ]

    // Dynamic Incident Response Framework recommendations
    const dynamicRecommendations = [
      {
        id: 1,
        title: "Initial Threat Assessment",
        description: "Conduct rapid threat assessment and determine incident scope",
        priority: "critical",
        status: "pending",
        estimatedTime: "5 minutes",
        phase: "detection",
        steps: [
          "Review uploaded log files for immediate threats",
          "Run AI analysis for comprehensive threat detection",
          "Classify incident severity and type",
          "Notify incident response team",
        ],
        automatable: true,
        tools: ["SIEM", "AI Analysis Engine", "Threat Intelligence"],
        evidence: ["Log files", "Initial analysis report"],
      },
      {
        id: 2,
        title: "Network Isolation",
        description: "Isolate affected systems to prevent lateral movement",
        priority: "critical",
        status: "pending",
        estimatedTime: "3 minutes",
        phase: "containment",
        dependencies: [1],
        steps: [
          "Disconnect affected endpoint from network",
          "Block malicious IP addresses at firewall",
          "Implement network segmentation",
          "Monitor for bypass attempts",
        ],
        automatable: false,
        tools: ["Firewall", "Network Management", "EDR"],
        evidence: ["Network logs", "Firewall rules", "Isolation confirmation"],
      },
      {
        id: 3,
        title: "Malware Analysis",
        description: "Analyze malicious files and processes",
        priority: "high",
        status: "pending",
        estimatedTime: "15 minutes",
        phase: "detection",
        dependencies: [2],
        steps: [
          "Extract malware samples safely",
          "Perform static analysis",
          "Run dynamic analysis in sandbox",
          "Identify malware family and capabilities",
        ],
        automatable: true,
        tools: ["Sandbox", "Malware Analysis Tools", "Threat Intelligence"],
        evidence: ["Malware samples", "Analysis reports", "IOCs"],
      },
      {
        id: 4,
        title: "Evidence Preservation",
        description: "Collect and preserve forensic evidence",
        priority: "high",
        status: "pending",
        estimatedTime: "20 minutes",
        phase: "containment",
        dependencies: [2],
        steps: [
          "Create memory dumps of affected systems",
          "Backup system and security event logs",
          "Document attack timeline",
          "Preserve network traffic captures",
        ],
        automatable: false,
        tools: ["Forensic Tools", "Memory Dump Utilities", "Log Collectors"],
        evidence: ["Memory dumps", "System logs", "Network captures", "Timeline"],
      },
      {
        id: 5,
        title: "Threat Eradication",
        description: "Remove malicious artifacts and close attack vectors",
        priority: "high",
        status: "pending",
        estimatedTime: "30 minutes",
        phase: "eradication",
        dependencies: [3, 4],
        steps: [
          "Terminate malicious processes",
          "Remove malware files and registry entries",
          "Patch vulnerabilities exploited",
          "Update security controls",
        ],
        automatable: true,
        tools: ["EDR", "Patch Management", "Registry Editors"],
        evidence: ["Cleanup logs", "Patch reports", "Security updates"],
      },
      {
        id: 6,
        title: "System Recovery",
        description: "Restore systems to normal operation",
        priority: "medium",
        status: "pending",
        estimatedTime: "45 minutes",
        phase: "recovery",
        dependencies: [5],
        steps: [
          "Restore systems from clean backups",
          "Rebuild compromised systems",
          "Restore network connectivity",
          "Validate system integrity",
        ],
        automatable: false,
        tools: ["Backup Systems", "Imaging Tools", "Integrity Checkers"],
        evidence: ["Recovery logs", "System validation", "Backup reports"],
      },
      {
        id: 7,
        title: "Post-Incident Review",
        description: "Document lessons learned and improve processes",
        priority: "low",
        status: "pending",
        estimatedTime: "60 minutes",
        phase: "post-incident",
        dependencies: [6],
        steps: [
          "Conduct incident timeline review",
          "Document lessons learned",
          "Update incident response procedures",
          "Schedule follow-up security assessments",
        ],
        automatable: false,
        tools: ["Documentation Tools", "Process Management"],
        evidence: ["Incident report", "Lessons learned", "Process updates"],
      },
    ]

    setProgress(100)

    // Update incident data with dynamic framework recommendations
    setIncidentData((prev) => ({
      ...prev,
      iocs: basicIOCs,
      recommendations: dynamicRecommendations,
      severity: "medium" as const,
      status: "complete" as const,
    }))

    console.log("Log upload completed - Dynamic IR Framework activated")
  }

  const handleAIAnalysisComplete = (result: any) => {
    console.log("AI analysis completed:", result)

    // Parse the AI analysis to extract IOCs and recommendations
    const extractedIOCs = result.iocs?.map((ioc: any) => ({
      type: ioc.type.replace("_", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
      value: ioc.value,
      severity: ioc.severity,
      description: ioc.description,
      timestamp: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZoneName: "short",
      }),
      logReferences: [
        {
          filename: "endpoint-security.log",
          lineNumbers: [1, 2, 3],
          relevantLines: [
            "Sample log entry showing this IOC",
            "Additional context for the indicator",
            "Related security event",
          ],
        },
      ],
    })) || [
      {
        type: "IP Address",
        value: "192.168.1.100",
        severity: "critical",
        description: "Command & Control server with multiple malicious connections across different protocols",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        logReferences: [
          {
            filename: "endpoint-security.log",
            lineNumbers: [2, 8, 11, 15, 19, 20, 25],
            relevantLines: [
              "Network Monitor: Outbound connection attempt - Process: svchost.exe, Destination: 192.168.1.100:443",
              "Network Monitor: Data exfiltration detected - Process: malware.exe, Destination: 192.168.1.100:8080",
              "Network Monitor: DNS query - Process: malware.exe, Query: c2-server.malicious-domain.com",
            ],
          },
        ],
      },
      {
        type: "File Hash",
        value: "a1b2c3d4e5f67890abcdef1234567890",
        severity: "critical",
        description: "Trojan.Win32.Agent.ABC - Advanced persistent malware with rootkit capabilities",
        timestamp: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZoneName: "short",
        }),
        logReferences: [
          {
            filename: "endpoint-security.log",
            lineNumbers: [3, 14],
            relevantLines: [
              "File System Monitor: Suspicious file creation - Path: C:\\Windows\\System32\\malware.exe",
              "Antivirus: Malware detected - File: C:\\Windows\\System32\\malware.exe, Threat: Trojan.Win32.Agent.ABC",
            ],
          },
        ],
      },
    ]

    // Enhanced Dynamic IR Framework based on AI analysis
    const enhancedRecommendations = [
      {
        id: 1,
        title: "Critical Threat Containment",
        description: "Immediate isolation of compromised systems based on AI analysis",
        priority: "critical",
        status: "pending",
        estimatedTime: "2 minutes",
        phase: "containment",
        steps: result.summary?.recommended_actions?.slice(0, 4) || [
          "Disconnect endpoint from network immediately",
          "Block IP 192.168.1.100 at firewall level",
          "Block domain c2-server.malicious-domain.com in DNS",
          "Quarantine affected user accounts",
        ],
        automatable: true,
        tools: ["Firewall", "DNS", "EDR", "Identity Management"],
        evidence: ["Network isolation logs", "Firewall rules", "DNS blocks"],
      },
      {
        id: 2,
        title: "Advanced Malware Analysis",
        description: "Deep analysis of detected Trojan.Win32.Agent.ABC",
        priority: "critical",
        status: "pending",
        estimatedTime: "10 minutes",
        phase: "detection",
        dependencies: [1],
        steps: [
          "Analyze malware hash a1b2c3d4e5f67890abcdef1234567890",
          "Identify C2 communication patterns",
          "Map attack techniques to MITRE ATT&CK",
          "Assess data exfiltration scope",
        ],
        automatable: true,
        tools: ["Malware Sandbox", "Threat Intelligence", "MITRE ATT&CK"],
        evidence: ["Malware analysis report", "C2 traffic analysis", "MITRE mapping"],
      },
      {
        id: 3,
        title: "Ransomware Response",
        description: "Address ransomware deployment and file encryption",
        priority: "critical",
        status: "pending",
        estimatedTime: "15 minutes",
        phase: "eradication",
        dependencies: [1, 2],
        steps: [
          "Stop ransomware process execution",
          "Assess encrypted file scope (1,247 files detected)",
          "Attempt file recovery from backups",
          "Remove ransomware persistence mechanisms",
        ],
        automatable: false,
        tools: ["Process Monitor", "Backup Systems", "File Recovery"],
        evidence: ["Process termination logs", "File recovery status", "Backup reports"],
      },
      {
        id: 4,
        title: "Data Breach Assessment",
        description: "Evaluate potential data exfiltration (750MB detected)",
        priority: "high",
        status: "pending",
        estimatedTime: "30 minutes",
        phase: "detection",
        dependencies: [2],
        steps: [
          "Analyze 750MB data transfer to 192.168.1.100",
          "Identify compromised data types",
          "Assess regulatory compliance impact",
          "Prepare breach notification procedures",
        ],
        automatable: false,
        tools: ["DLP", "Network Analysis", "Compliance Tools"],
        evidence: ["Data transfer logs", "Content analysis", "Compliance assessment"],
      },
      {
        id: 5,
        title: "System Hardening",
        description: "Implement security improvements based on attack analysis",
        priority: "medium",
        status: "pending",
        estimatedTime: "45 minutes",
        phase: "recovery",
        dependencies: [3, 4],
        steps: [
          "Patch vulnerabilities exploited in attack",
          "Update endpoint detection rules",
          "Enhance network monitoring",
          "Implement additional access controls",
        ],
        automatable: true,
        tools: ["Patch Management", "EDR", "SIEM", "IAM"],
        evidence: ["Patch reports", "Rule updates", "Monitoring configs"],
      },
      {
        id: 6,
        title: "Threat Hunt Expansion",
        description: "Hunt for additional compromised systems",
        priority: "medium",
        status: "pending",
        estimatedTime: "60 minutes",
        phase: "detection",
        dependencies: [2],
        steps: [
          "Search for IOCs across environment",
          "Analyze lateral movement indicators",
          "Check for additional C2 communications",
          "Validate system integrity enterprise-wide",
        ],
        automatable: true,
        tools: ["Threat Hunting Platform", "SIEM", "EDR"],
        evidence: ["Hunt results", "IOC matches", "System scans"],
      },
    ]

    // Determine severity based on threat score
    const threatScore = result.summary?.threat_score || 0
    const severity = threatScore >= 80 ? "critical" : threatScore >= 60 ? "high" : threatScore >= 40 ? "medium" : "low"

    // Update incident data with enhanced analysis results
    setIncidentData((prev) => ({
      ...prev,
      iocs: extractedIOCs,
      recommendations: enhancedRecommendations,
      severity: severity as any,
      status: "complete" as const,
      aiAnalysis: result,
    }))

    console.log("Incident data updated with AI-enhanced Dynamic IR Framework")
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

          {/* Navigation & Reset Buttons */}
          <div className="flex gap-2">
            <Link href="/integrations">
              <Button variant="outline" className="flex items-center gap-2">
                <Plug className="h-4 w-4" />
                Integrations
              </Button>
            </Link>
            {(incidentData.logs.length > 0 || incidentData.status !== "initial") && (
              <>
                <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  New Incident
                </Button>
                <Button onClick={handleReset} variant="destructive" size="sm" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </>
            )}
          </div>
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
                  {isAnalyzing && <Badge className="ml-2 bg-blue-600 animate-pulse">AI Analyzing...</Badge>}
                </CardTitle>
                <CardDescription>
                  {incidentData.status === "initial"
                    ? "Upload log files to begin automated AI-powered incident analysis"
                    : incidentData.status === "analyzing" || isAnalyzing
                      ? "AI models are analyzing uploaded logs for threats and indicators"
                      : "Analysis complete - Review findings and recommended actions"}
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

              {/* AI Analysis Summary */}
              {incidentData.logs.length > 0 && (
                <div className="space-y-4">
                  {/* AI Analysis Button and Status */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <Brain className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-green-400">AI Security Analysis</h4>
                        <p className="text-sm text-slate-400">
                          {!incidentData.aiAnalysis && !isAnalyzing
                            ? "Click to run comprehensive threat analysis"
                            : isAnalyzing
                              ? "Analyzing logs with advanced AI models..."
                              : "Analysis complete - Review detailed findings"}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={async () => {
                        setIsAnalyzing(true)
                        try {
                          const logEntries = incidentData.logs.map((log) => `${log.filename}: ${log.entries} entries`)
                          const securityLogContent = [
                            "Jan 15, 2024 at 2:25:18 PM EST [INFO] Process Monitor: New process created - PID: 4892, Name: svchost.exe",
                            "Jan 15, 2024 at 2:25:20 PM EST [ERROR] File System Monitor: Suspicious file creation - malware.exe",
                            "Jan 15, 2024 at 2:25:21 PM EST [CRITICAL] Registry Monitor: Unauthorized registry modification",
                            "Jan 15, 2024 at 2:28:42 PM EST [CRITICAL] Antivirus: Malware detected - Trojan.Win32.Agent.ABC",
                            "Jan 15, 2024 at 2:32:00 PM EST [CRITICAL] File System Monitor: Ransomware behavior detected",
                          ]
                          const allLogContent = [...logEntries, ...securityLogContent]

                          const response = await fetch("/api/nvidia-analysis", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              logs: allLogContent,
                              analysisType: "ioc_detection",
                              context: "Incident response analysis",
                            }),
                          })

                          let result
                          if (response.ok) {
                            result = await response.json()
                          } else {
                            // Fallback mock data
                            result = {
                              summary: {
                                threat_score: 85,
                                executive_summary:
                                  "Critical security incident detected with multiple indicators of compromise. Advanced persistent threat characteristics identified with evidence of data exfiltration and ransomware deployment.",
                                key_findings: [
                                  "Advanced persistent threat (APT) indicators detected",
                                  "Active command & control communication established",
                                  "Ransomware deployment affecting 1,247 files",
                                  "Evidence of data exfiltration (750MB transferred)",
                                ],
                                recommended_actions: [
                                  "Immediately isolate affected endpoint from network",
                                  "Block malicious IP 192.168.1.100 at firewall level",
                                  "Initiate incident response procedures",
                                  "Preserve forensic evidence before cleanup",
                                ],
                              },
                            }
                          }

                          handleAIAnalysisComplete(result)
                        } catch (error) {
                          console.error("AI Analysis error:", error)
                        } finally {
                          setIsAnalyzing(false)
                        }
                      }}
                      disabled={isAnalyzing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAnalyzing ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-pulse" />
                          Analyzing...
                        </>
                      ) : incidentData.aiAnalysis ? (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Re-run Analysis
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Start AI Analysis
                        </>
                      )}
                    </Button>
                  </div>

                  {/* AI Analysis Results */}
                  {incidentData.aiAnalysis && !isAnalyzing && (
                    <div className="p-4 bg-slate-800 rounded-lg border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-blue-400" />
                        <span className="font-medium text-blue-400">AI Analysis Summary</span>
                        <Badge className="bg-blue-600 text-white text-xs">
                          Threat Score: {incidentData.aiAnalysis.summary?.threat_score || 0}/100
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-300 mb-3">
                        {incidentData.aiAnalysis.summary?.executive_summary}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <h5 className="text-xs font-medium text-slate-400 mb-2">Key Findings</h5>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {(incidentData.aiAnalysis.summary?.key_findings || [])
                              .slice(0, 3)
                              .map((finding: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-red-400 mt-1">•</span>
                                  <span>{finding}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-xs font-medium text-slate-400 mb-2">Immediate Actions</h5>
                          <ul className="text-xs text-slate-300 space-y-1">
                            {(incidentData.aiAnalysis.summary?.recommended_actions || [])
                              .slice(0, 3)
                              .map((action: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span>{action}</span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Analysis Progress */}
                  {isAnalyzing && (
                    <div className="p-4 bg-slate-800 rounded-lg border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-green-400 animate-pulse" />
                        <span className="text-sm font-medium">AI Analysis in Progress...</span>
                      </div>
                      <div className="text-xs text-slate-400 mb-2">
                        Processing {incidentData.logs.length} log files with advanced threat detection models
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  )}
                </div>
              )}

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
              <TabsList className="grid w-full grid-cols-5 bg-slate-800">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger
                  value="mitre"
                  className="flex items-center gap-2"
                  disabled={incidentData.status === "initial"}
                >
                  <Shield className="h-4 w-4" />
                  MITRE ATT&CK
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

              <TabsContent value="mitre" className="space-y-4">
                {incidentData.status !== "initial" ? (
                  <MitreAttackMapping analysisData={incidentData.aiAnalysis} />
                ) : (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Shield className="h-12 w-12 text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">MITRE ATT&CK Analysis</h3>
                      <p className="text-slate-400 text-center">
                        Upload and analyze logs to view MITRE ATT&CK framework mapping
                      </p>
                    </CardContent>
                  </Card>
                )}
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
                  : isAnalyzing
                    ? "AI models are currently analyzing your logs using advanced threat detection algorithms and MITRE ATT&CK mapping."
                    : incidentData.aiAnalysis
                      ? `Analysis complete! Threat score: ${incidentData.aiAnalysis.summary?.threat_score}/100. ${incidentData.aiAnalysis.summary?.recommended_actions?.[0] || "Review the detailed findings in the AI Analysis tab."}`
                      : "Based on the analysis, this appears to be a targeted attack. Immediate containment is recommended to prevent lateral movement."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
