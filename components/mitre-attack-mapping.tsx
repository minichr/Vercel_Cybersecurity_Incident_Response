"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Shield,
  AlertTriangle,
  Target,
  Zap,
  Eye,
  Network,
  Database,
  FileText,
  Lock,
  UserX,
  Layers,
  Terminal,
  RefreshCw,
  Info,
  ExternalLink,
  Search,
} from "lucide-react"

interface MitreAttackMappingProps {
  analysisData?: any
}

export default function MitreAttackMapping({ analysisData }: MitreAttackMappingProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // MITRE ATT&CK Tactics
  const tactics = [
    { id: "initial-access", name: "Initial Access", icon: Shield, color: "bg-red-500" },
    { id: "execution", name: "Execution", icon: Terminal, color: "bg-orange-500" },
    { id: "persistence", name: "Persistence", icon: Lock, color: "bg-yellow-500" },
    { id: "privilege-escalation", name: "Privilege Escalation", icon: Layers, color: "bg-green-500" },
    { id: "defense-evasion", name: "Defense Evasion", icon: Eye, color: "bg-blue-500" },
    { id: "credential-access", name: "Credential Access", icon: UserX, color: "bg-indigo-500" },
    { id: "discovery", name: "Discovery", icon: Search, color: "bg-purple-500" },
    { id: "lateral-movement", name: "Lateral Movement", icon: Network, color: "bg-pink-500" },
    { id: "collection", name: "Collection", icon: Database, color: "bg-cyan-500" },
    { id: "command-and-control", name: "Command & Control", icon: Zap, color: "bg-amber-500" },
    { id: "exfiltration", name: "Exfiltration", icon: FileText, color: "bg-lime-500" },
    { id: "impact", name: "Impact", icon: AlertTriangle, color: "bg-rose-500" },
  ]

  // Get MITRE techniques from analysis data or use fallback
  const getMitreTechniques = () => {
    if (analysisData?.summary?.mitre_mapping && analysisData.summary.mitre_mapping.length > 0) {
      return analysisData.summary.mitre_mapping
    }

    // Fallback data if no analysis data is available
    return [
      {
        technique_id: "T1055",
        technique_name: "Process Injection",
        tactic: "Defense Evasion",
        description: "Malware injected into legitimate svchost.exe process to evade detection",
        confidence: 0.95,
      },
      {
        technique_id: "T1105",
        technique_name: "Ingress Tool Transfer",
        tactic: "Command and Control",
        description: "Malicious executable transferred and deployed in system32 directory",
        confidence: 0.98,
      },
      {
        technique_id: "T1547.001",
        technique_name: "Registry Run Keys / Startup Folder",
        tactic: "Persistence",
        description: "Multiple registry modifications for startup persistence",
        confidence: 0.92,
      },
      {
        technique_id: "T1071.001",
        technique_name: "Web Protocols",
        tactic: "Command and Control",
        description: "HTTPS and custom protocol communication with C2 server",
        confidence: 0.94,
      },
      {
        technique_id: "T1486",
        technique_name: "Data Encrypted for Impact",
        tactic: "Impact",
        description: "File encryption with ransom note deployment",
        confidence: 0.99,
      },
      {
        technique_id: "T1078",
        technique_name: "Valid Accounts",
        tactic: "Defense Evasion",
        description: "Use of compromised credentials for privileged access",
        confidence: 0.85,
      },
      {
        technique_id: "T1083",
        technique_name: "File and Directory Discovery",
        tactic: "Discovery",
        description: "Enumeration of files and directories for data targeting",
        confidence: 0.91,
      },
    ]
  }

  const mitreTechniques = getMitreTechniques()

  // Filter techniques by selected tactic
  const filteredTechniques =
    activeCategory === "all"
      ? mitreTechniques
      : mitreTechniques.filter((technique) => technique.tactic.toLowerCase().replace(/\s+/g, "-") === activeCategory)

  // Calculate threat score based on techniques and confidence
  const calculateThreatScore = () => {
    if (!mitreTechniques || mitreTechniques.length === 0) return 0

    const weightedSum = mitreTechniques.reduce((sum, technique) => {
      // Weight critical tactics higher
      let tacticWeight = 1
      const tactic = technique.tactic.toLowerCase()
      if (tactic.includes("command") || tactic.includes("impact") || tactic.includes("exfiltration")) {
        tacticWeight = 1.5
      }

      return sum + technique.confidence * tacticWeight
    }, 0)

    return Math.min(100, Math.round((weightedSum / mitreTechniques.length) * 100))
  }

  // Get threat type based on techniques
  const getThreatType = () => {
    const tactics = mitreTechniques.map((t) => t.tactic.toLowerCase())

    if (tactics.some((t) => t.includes("impact") && t.includes("encrypt"))) {
      return "Ransomware"
    } else if (tactics.some((t) => t.includes("exfiltration"))) {
      return "Data Theft"
    } else if (tactics.some((t) => t.includes("command"))) {
      return "Advanced Persistent Threat"
    } else {
      return "Malware Infection"
    }
  }

  // Get average confidence level
  const getAverageConfidence = () => {
    if (!mitreTechniques || mitreTechniques.length === 0) return 0

    const sum = mitreTechniques.reduce((total, technique) => total + technique.confidence, 0)
    return Math.round((sum / mitreTechniques.length) * 100)
  }

  // Get color based on confidence level
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-400"
    if (confidence >= 0.7) return "text-yellow-400"
    return "text-orange-400"
  }

  // Get tactic count for visualization
  const getTacticCount = () => {
    const tacticCounts: Record<string, number> = {}

    mitreTechniques.forEach((technique) => {
      const tactic = technique.tactic.toLowerCase().replace(/\s+/g, "-")
      tacticCounts[tactic] = (tacticCounts[tactic] || 0) + 1
    })

    return tacticCounts
  }

  const tacticCounts = getTacticCount()
  const threatScore = calculateThreatScore()
  const threatType = getThreatType()
  const averageConfidence = getAverageConfidence()

  return (
    <div className="space-y-6">
      {/* MITRE ATT&CK Overview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            MITRE ATT&CK Framework Analysis
            <Badge className="ml-auto bg-blue-600">{mitreTechniques.length} Techniques Identified</Badge>
          </CardTitle>
          <CardDescription>AI-powered mapping of attack techniques to the MITRE ATT&CK framework</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Threat Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{threatScore}</div>
                <div className="text-sm text-slate-400">Threat Score</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-yellow-400">{threatType}</div>
                <div className="text-sm text-slate-400">Threat Type</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-green-400">{averageConfidence}%</div>
                <div className="text-sm text-slate-400">Confidence Level</div>
              </div>
            </div>

            {/* Tactics Visualization */}
            <div>
              <h3 className="text-sm font-medium mb-3">Tactics Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tactics.map((tactic) => {
                  const count = tacticCounts[tactic.id] || 0
                  const IconComponent = tactic.icon
                  return (
                    <div
                      key={tactic.id}
                      className={`p-3 rounded-lg border ${count > 0 ? "border-" + tactic.color.substring(3) : "border-slate-700 opacity-50"}`}
                      onClick={() => setActiveCategory(count > 0 ? tactic.id : activeCategory)}
                      style={{ cursor: count > 0 ? "pointer" : "default" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${count > 0 ? tactic.color : "bg-slate-700"}`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{tactic.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <Progress value={count > 0 ? 100 : 0} className="h-1 flex-1" />
                        <Badge variant={count > 0 ? "default" : "outline"} className="ml-2">
                          {count}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory("all")}
              >
                All Techniques
              </Button>
              {tactics.map((tactic) => {
                const count = tacticCounts[tactic.id] || 0
                if (count === 0) return null

                return (
                  <Button
                    key={tactic.id}
                    variant={activeCategory === tactic.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(tactic.id)}
                  >
                    {tactic.name} ({count})
                  </Button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Techniques Detail */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg">
            {activeCategory === "all"
              ? "All Identified Techniques"
              : `${tactics.find((t) => t.id === activeCategory)?.name} Techniques`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {filteredTechniques.length > 0 ? (
                filteredTechniques.map((technique, index) => {
                  const tacticObj = tactics.find(
                    (t) =>
                      t.name.toLowerCase() === technique.tactic.toLowerCase() ||
                      technique.tactic.toLowerCase().includes(t.id.replace("-", " ")),
                  )
                  const IconComponent = tacticObj?.icon || Shield
                  const confidenceColor = getConfidenceColor(technique.confidence)

                  return (
                    <div key={index} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${tacticObj?.color || "bg-blue-500"}`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{technique.technique_name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{technique.technique_id}</Badge>
                              <Badge>{technique.tactic}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${confidenceColor}`}>
                          {Math.round(technique.confidence * 100)}%
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 mb-3">{technique.description}</p>

                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Info className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          MITRE Reference
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Target className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Techniques Found</h3>
                  <p className="text-center">No techniques were identified for this tactic</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Attack Chain Visualization */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Attack Chain Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-yellow-500 to-red-500"></div>

            <div className="space-y-6">
              {analysisData?.summary?.attack_timeline ? (
                analysisData.summary.attack_timeline.map((event: any, index: number) => {
                  // Find matching MITRE technique if available
                  const relatedTechnique = mitreTechniques.find(
                    (t) => event.mitre_technique && event.mitre_technique.includes(t.technique_id),
                  )

                  return (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Timeline Node */}
                      <div className="relative z-10 flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full bg-${event.severity === "critical" ? "red" : event.severity === "high" ? "orange" : "yellow"}-500 flex items-center justify-center`}
                        >
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 pb-6">
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{event.event}</h4>
                            <span className="text-xs text-slate-400">{event.timestamp}</span>
                          </div>

                          {event.mitre_technique && (
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{event.mitre_technique}</Badge>
                              <Badge
                                className={`bg-${event.severity === "critical" ? "red" : event.severity === "high" ? "orange" : "yellow"}-500`}
                              >
                                {event.severity.toUpperCase()}
                              </Badge>
                            </div>
                          )}

                          {relatedTechnique && (
                            <p className="text-sm text-slate-300 mt-2">{relatedTechnique.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <RefreshCw className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Attack Chain Unavailable</h3>
                  <p className="text-center">Run AI analysis to generate attack chain visualization</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
