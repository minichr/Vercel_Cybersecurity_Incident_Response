"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, AlertTriangle, Shield, Wifi, FileX, Key, Zap, Database, Network, Bug, Eye } from "lucide-react"

interface TimelineEvent {
  id: string
  time: string
  title: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  category: "detection" | "malware" | "network" | "persistence" | "data" | "escalation"
  icon: React.ComponentType<{ className?: string }>
}

interface AttackTimelineProps {
  status: string
}

export default function AttackTimeline({ status }: AttackTimelineProps) {
  const timelineEvents: TimelineEvent[] = [
    {
      id: "1",
      time: "Jan 15, 2024 at 2:25:18 PM EST",
      title: "Initial Detection",
      description: "Suspicious svchost.exe process detected with unusual behavior",
      severity: "medium",
      category: "detection",
      icon: Eye,
    },
    {
      id: "2",
      time: "Jan 15, 2024 at 2:25:20 PM EST",
      title: "Malware Deployment",
      description: "Malicious executable dropped in system32 directory",
      severity: "high",
      category: "malware",
      icon: Bug,
    },
    {
      id: "3",
      time: "Jan 15, 2024 at 2:25:21 PM EST",
      title: "Persistence Established",
      description: "Registry modification for startup persistence",
      severity: "high",
      category: "persistence",
      icon: Key,
    },
    {
      id: "4",
      time: "Jan 15, 2024 at 2:27:30 PM EST",
      title: "DNS Resolution",
      description: "Malicious domain c2-server.malicious-domain.com resolved",
      severity: "medium",
      category: "network",
      icon: Network,
    },
    {
      id: "5",
      time: "Jan 15, 2024 at 2:28:42 PM EST",
      title: "Threat Confirmed",
      description: "File hash matched known Trojan.Win32.Agent.ABC signature",
      severity: "critical",
      category: "malware",
      icon: AlertTriangle,
    },
    {
      id: "6",
      time: "Jan 15, 2024 at 2:30:05 PM EST",
      title: "Boot Persistence",
      description: "Boot execution order modified for persistence",
      severity: "high",
      category: "persistence",
      icon: Zap,
    },
    {
      id: "7",
      time: "Jan 15, 2024 at 2:32:15 PM EST",
      title: "C2 Communication",
      description: "Active command & control communication established",
      severity: "critical",
      category: "network",
      icon: Wifi,
    },
    {
      id: "8",
      time: "Jan 15, 2024 at 2:32:45 PM EST",
      title: "Data Exfiltration",
      description: "500MB of data transferred to external server",
      severity: "critical",
      category: "data",
      icon: Database,
    },
    {
      id: "9",
      time: "Jan 15, 2024 at 2:34:30 PM EST",
      title: "File Encryption",
      description: "1,247 files encrypted with ransomware payload",
      severity: "critical",
      category: "data",
      icon: FileX,
    },
  ]

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
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "detection":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "malware":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "network":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "persistence":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "data":
        return "bg-pink-500/20 text-pink-400 border-pink-500/30"
      case "escalation":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (status === "initial") {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-400" />
            Attack Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                <Clock className="h-8 w-8 opacity-50" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Timeline Ready</h3>
            <p className="text-sm text-center">Attack timeline will appear after incident analysis</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          Attack Timeline
          <Badge variant="outline" className="ml-auto">
            {timelineEvents.length} Events
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-yellow-500 to-red-500"></div>

            <div className="space-y-6">
              {timelineEvents.map((event, index) => {
                const IconComponent = event.icon
                return (
                  <div key={event.id} className="relative flex items-start gap-4">
                    {/* Timeline Node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full ${getSeverityColor(event.severity)} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      {/* Pulse Animation for Critical Events */}
                      {event.severity === "critical" && (
                        <div
                          className={`absolute inset-0 w-12 h-12 rounded-full ${getSeverityColor(event.severity)} animate-ping opacity-20`}
                        ></div>
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-white">{event.title}</h4>
                            <Badge className={`text-xs ${getCategoryColor(event.category)}`}>{event.category}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getSeverityColor(event.severity)} text-white text-xs`}>
                              {event.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-slate-400 font-mono">{event.time}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-300">{event.description}</p>

                        {/* Progress Indicator */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getSeverityColor(event.severity)} transition-all duration-1000 ease-out`}
                              style={{ width: `${((index + 1) / timelineEvents.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400">
                            {Math.round(((index + 1) / timelineEvents.length) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Timeline End Marker */}
            <div className="relative flex items-center gap-4 mt-4">
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-slate-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                  <h4 className="font-medium text-slate-300 mb-1">Incident Response Initiated</h4>
                  <p className="text-xs text-slate-400">Analysis complete - Containment procedures recommended</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Timeline Summary */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-lg font-bold text-red-400">
                {timelineEvents.filter((e) => e.severity === "critical").length}
              </div>
              <div className="text-xs text-slate-400">Critical Events</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-400">9m 12s</div>
              <div className="text-xs text-slate-400">Attack Duration</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
