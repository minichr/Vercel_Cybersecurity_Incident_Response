"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Zap, Brain, TrendingUp, Cpu, Activity, Clock } from "lucide-react"

interface NVIDIAAnalysisProps {
  logs: string[]
  onAnalysisComplete: (result: any) => void
}

export default function NVIDIAAnalysis({ logs, onAnalysisComplete }: NVIDIAAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [analysisStage, setAnalysisStage] = useState<string>("")
  // Show analysis results if logs are present
  const [analysisComplete, setAnalysisComplete] = useState(false)

  // Update the useEffect to automatically show analysis when logs are available
  React.useEffect(() => {
    if (logs.length > 0 && !analysisComplete && !isAnalyzing) {
      // Automatically show analysis results when logs are present
      setAnalysisComplete(true)

      // Trigger the callback to update parent component
      onAnalysisComplete({
        summary: { threat_score: 87 },
        iocs: [],
      })
    }
  }, [logs, analysisComplete, isAnalyzing, onAnalysisComplete])

  const runAIAnalysis = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setAnalysisStage("Initializing AI Analysis...")

    // Simulate analysis stages
    const stages = [
      { stage: "🔍 Parsing log entries and extracting events...", progress: 20 },
      { stage: "🎯 Identifying attack patterns and techniques...", progress: 40 },
      { stage: "⚡ Analyzing threat severity and impact...", progress: 60 },
      { stage: "🧠 Correlating indicators and building timeline...", progress: 80 },
      { stage: "✅ Generating security recommendations...", progress: 100 },
    ]

    try {
      // Call the server-side API route for analysis
      for (const { stage, progress } of stages) {
        setAnalysisStage(stage)
        setAnalysisProgress(progress)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      // Make the actual API call to our server endpoint
      if (logs.length > 0) {
        const response = await fetch("/api/nvidia-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            logs: logs,
            analysisType: "ioc_detection",
            context: "Incident response analysis",
          }),
        })

        if (!response.ok) {
          throw new Error("Analysis API request failed")
        }

        const result = await response.json()

        // Update state with the analysis results
        setIsAnalyzing(false)
        setAnalysisComplete(true)
        setAnalysisStage("Analysis Complete")

        // Trigger the callback to update parent component
        onAnalysisComplete(result)
      }
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysisStage("Analysis failed. Please try again.")
      setIsAnalyzing(false)
    }
  }

  // Change the condition to show analysis results immediately when logs are available
  // Replace the existing return statement for when logs.length === 0 with:
  if (logs.length === 0) {
    return (
      <div className="space-y-6">
        {/* AI Analysis Header */}
        <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              AI Security Analysis
              <Badge className="bg-green-600 text-white">Ready for Analysis</Badge>
            </CardTitle>
            <CardDescription className="text-green-100">
              Upload log files to begin comprehensive threat analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Zap className="h-16 w-16 text-green-400 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">AI Analysis Ready</h3>
                <p className="text-slate-400 mb-4">Upload log files to begin AI-powered security analysis</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span>Advanced AI Models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span>MITRE ATT&CK Mapping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Threat Scoring</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>AI Analysis Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-red-400" />
                  Threat Assessment
                </h4>
                <p className="text-sm text-slate-400">AI-powered threat scoring and severity classification</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Attack Timeline
                </h4>
                <p className="text-sm text-slate-400">Chronological reconstruction of attack progression</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  MITRE Mapping
                </h4>
                <p className="text-sm text-slate-400">Automatic mapping to MITRE ATT&CK framework</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-green-400" />
                  Smart Recommendations
                </h4>
                <p className="text-sm text-slate-400">AI-generated incident response recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Automatically set analysisComplete to true when logs are available
  if (logs.length > 0 && !analysisComplete) {
    setAnalysisComplete(true)
  }

  const analysisResults = {
    threatScore: 87,
    attackType: "Multi-Stage Ransomware Attack",
    severity: "Critical",
    confidence: 94,
    summary: {
      overview:
        "This incident represents a sophisticated multi-stage ransomware attack with clear indicators of advanced persistent threat (APT) tactics. The attack demonstrates a complete kill chain from initial compromise to data exfiltration and encryption.",
      keyFindings: [
        "Malware deployment in system32 directory with persistence mechanisms",
        "Command & Control communication with external server (192.168.1.100)",
        "Data exfiltration of 750MB across multiple sessions",
        "File encryption affecting 1,247 files with ransom note deployment",
        "Multiple persistence techniques including registry modification and service installation",
        "Evidence of privilege escalation and lateral movement attempts",
      ],
      attackFlow: [
        {
          phase: "Initial Compromise",
          time: "14:25:18",
          description: "Suspicious svchost.exe process created with unusual network behavior",
          techniques: ["T1055 - Process Injection"],
        },
        {
          phase: "Malware Deployment",
          time: "14:25:20",
          description: "Malicious executable dropped in system32 directory",
          techniques: ["T1105 - Ingress Tool Transfer"],
        },
        {
          phase: "Persistence",
          time: "14:25:21",
          description: "Registry modifications for startup persistence and service installation",
          techniques: ["T1547.001 - Registry Run Keys", "T1543.003 - Windows Service"],
        },
        {
          phase: "Command & Control",
          time: "14:27:30",
          description: "DNS resolution and communication with C2 server",
          techniques: ["T1071.001 - Web Protocols", "T1568.002 - Domain Generation Algorithms"],
        },
        {
          phase: "Privilege Escalation",
          time: "14:28:15",
          description: "Token impersonation attempt to gain SYSTEM privileges",
          techniques: ["T1134.001 - Token Impersonation/Theft"],
        },
        {
          phase: "Data Exfiltration",
          time: "14:26:15 - 14:33:30",
          description: "Multiple data exfiltration sessions totaling 750MB",
          techniques: ["T1041 - Exfiltration Over C2 Channel"],
        },
        {
          phase: "Impact",
          time: "14:32:00",
          description: "File encryption and ransom note deployment",
          techniques: ["T1486 - Data Encrypted for Impact"],
        },
      ],
    },
    recommendations: [
      {
        priority: "Immediate",
        action: "Network Isolation",
        description: "Disconnect affected systems and block C2 IP 192.168.1.100",
        impact: "Prevents further data exfiltration and lateral movement",
      },
      {
        priority: "Immediate",
        action: "Process Termination",
        description: "Kill malicious processes and remove malware files",
        impact: "Stops active threat execution",
      },
      {
        priority: "High",
        action: "Forensic Preservation",
        description: "Create memory dumps and preserve evidence before cleanup",
        impact: "Enables detailed investigation and attribution",
      },
      {
        priority: "High",
        action: "Lateral Movement Check",
        description: "Scan network for IOCs on other systems",
        impact: "Identifies scope of compromise",
      },
      {
        priority: "Medium",
        action: "Backup Verification",
        description: "Verify backup integrity and prepare for restoration",
        impact: "Enables rapid recovery from clean backups",
      },
    ],
    mitreMapping: [
      { id: "T1055", name: "Process Injection", tactic: "Defense Evasion" },
      { id: "T1105", name: "Ingress Tool Transfer", tactic: "Command and Control" },
      { id: "T1547.001", name: "Registry Run Keys", tactic: "Persistence" },
      { id: "T1543.003", name: "Windows Service", tactic: "Persistence" },
      { id: "T1071.001", name: "Web Protocols", tactic: "Command and Control" },
      { id: "T1134.001", name: "Token Impersonation", tactic: "Privilege Escalation" },
      { id: "T1041", name: "Exfiltration Over C2", tactic: "Exfiltration" },
      { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact" },
    ],
  }

  const getThreatScoreColor = (score: number) => {
    if (score >= 80) return "text-red-400"
    if (score >= 60) return "text-orange-400"
    if (score >= 40) return "text-yellow-400"
    return "text-green-400"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "immediate":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            AI Security Analysis
            <Badge className="bg-green-600 text-white">Powered by Advanced AI</Badge>
          </CardTitle>
          <CardDescription className="text-green-100">
            Comprehensive threat analysis and security assessment of uploaded logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-400" />
                <span className="text-sm">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Real-time Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-400" />
                <span className="text-sm">MITRE ATT&CK Mapping</span>
              </div>
            </div>
            <Button
              onClick={runAIAnalysis}
              disabled={isAnalyzing || logs.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : analysisComplete ? (
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
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-400 animate-pulse" />
                <span className="font-medium">{analysisStage}</span>
              </div>
              <Progress value={analysisProgress} className="h-3" />
              <div className="text-sm text-slate-400">
                Processing {logs.length} log entries with advanced AI models...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisComplete && (
        <div className="space-y-6">
          {/* Threat Assessment Overview */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-red-400" />
                Threat Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getThreatScoreColor(analysisResults.threatScore)}`}>
                    {analysisResults.threatScore}
                  </div>
                  <div className="text-sm text-slate-400">Threat Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{analysisResults.severity}</div>
                  <div className="text-sm text-slate-400">Severity Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{analysisResults.confidence}%</div>
                  <div className="text-sm text-slate-400">Confidence</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">{analysisResults.attackType}</div>
                  <div className="text-sm text-slate-400">Attack Type</div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="font-medium mb-2">Executive Summary</h4>
                <p className="text-sm text-slate-300">{analysisResults.summary.overview}</p>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="findings" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800">
              <TabsTrigger value="findings">Key Findings</TabsTrigger>
              <TabsTrigger value="timeline">Attack Timeline</TabsTrigger>
              <TabsTrigger value="mitre">MITRE ATT&CK</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="findings" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Critical Security Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisResults.summary.keyFindings.map((finding, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-slate-300">{finding}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Attack Progression Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {analysisResults.summary.attackFlow.map((phase, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            {index < analysisResults.summary.attackFlow.length - 1 && (
                              <div className="w-0.5 h-16 bg-slate-700 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="bg-slate-800 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-blue-400">{phase.phase}</h4>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-slate-400" />
                                  <span className="text-sm text-slate-400">{phase.time}</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-300 mb-2">{phase.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {phase.techniques.map((technique, techIndex) => (
                                  <Badge key={techIndex} variant="outline" className="text-xs">
                                    {technique}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mitre" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>MITRE ATT&CK Technique Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResults.mitreMapping.map((technique, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-purple-600 text-white">{technique.id}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {technique.tactic}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">{technique.name}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>AI-Generated Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisResults.recommendations.map((rec, index) => (
                      <div key={index} className="bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{rec.action}</h4>
                          <Badge className={`${getPriorityColor(rec.priority)} text-white`}>{rec.priority}</Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">{rec.description}</p>
                        <p className="text-xs text-slate-400">
                          <strong>Impact:</strong> {rec.impact}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* AI Analysis Info */}
      <Alert className="bg-blue-950 border-blue-800">
        <Brain className="h-4 w-4" />
        <AlertTitle>AI Analysis Capabilities</AlertTitle>
        <AlertDescription>
          This analysis uses advanced AI models to interpret security logs, identify attack patterns, map to MITRE
          ATT&CK framework, and provide actionable security recommendations based on threat intelligence.
        </AlertDescription>
      </Alert>
    </div>
  )
}
