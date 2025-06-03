"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Shield,
  Settings,
  CheckCircle,
  Clock,
  Database,
  Network,
  Eye,
  Plug,
  ArrowLeft,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Activity,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Integration {
  id: string
  name: string
  description: string
  category: "siem" | "endpoint" | "network" | "cloud" | "threat-intel"
  status: "connected" | "available" | "configured"
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  setupComplexity: "easy" | "medium" | "advanced"
  dataTypes: string[]
  pricing: "free" | "paid" | "freemium"
}

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const integrations: Integration[] = [
    {
      id: "splunk",
      name: "Splunk Enterprise",
      description: "Connect to Splunk for comprehensive log analysis and SIEM capabilities",
      category: "siem",
      status: "available",
      icon: Database,
      features: ["Real-time log streaming", "Advanced search queries", "Custom dashboards", "Alert correlation"],
      setupComplexity: "medium",
      dataTypes: ["Security Events", "System Logs", "Network Traffic", "Application Logs"],
      pricing: "paid",
    },
    {
      id: "elastic",
      name: "Elastic Stack (ELK)",
      description: "Integrate with Elasticsearch, Logstash, and Kibana for log management",
      category: "siem",
      status: "connected",
      icon: Activity,
      features: ["Elasticsearch queries", "Logstash parsing", "Kibana visualizations", "Machine learning"],
      setupComplexity: "advanced",
      dataTypes: ["All log formats", "Metrics", "APM data", "Security events"],
      pricing: "freemium",
    },
    {
      id: "crowdstrike",
      name: "CrowdStrike Falcon",
      description: "Endpoint detection and response platform integration",
      category: "endpoint",
      status: "configured",
      icon: Shield,
      features: ["Endpoint telemetry", "Threat hunting", "IOC detection", "Real-time protection"],
      setupComplexity: "easy",
      dataTypes: ["Process events", "File activities", "Network connections", "Registry changes"],
      pricing: "paid",
    },
    {
      id: "sentinelone",
      name: "SentinelOne",
      description: "AI-powered endpoint protection and response",
      category: "endpoint",
      status: "available",
      icon: Eye,
      features: ["Behavioral AI", "Automated response", "Threat intelligence", "Forensic data"],
      setupComplexity: "easy",
      dataTypes: ["Endpoint events", "Threat data", "Behavioral analytics", "File hashes"],
      pricing: "paid",
    },
    {
      id: "wireshark",
      name: "Wireshark / Tshark",
      description: "Network protocol analyzer for deep packet inspection",
      category: "network",
      status: "available",
      icon: Network,
      features: ["Packet capture", "Protocol analysis", "Network forensics", "Traffic filtering"],
      setupComplexity: "medium",
      dataTypes: ["Network packets", "Protocol data", "Traffic flows", "Connection logs"],
      pricing: "free",
    },
    {
      id: "suricata",
      name: "Suricata IDS/IPS",
      description: "Open source intrusion detection and prevention system",
      category: "network",
      status: "available",
      icon: Shield,
      features: ["Intrusion detection", "Network monitoring", "File extraction", "Lua scripting"],
      setupComplexity: "advanced",
      dataTypes: ["Alert logs", "Flow data", "HTTP logs", "DNS logs"],
      pricing: "free",
    },
    {
      id: "aws-cloudtrail",
      name: "AWS CloudTrail",
      description: "AWS API call logging and monitoring service",
      category: "cloud",
      status: "available",
      icon: Globe,
      features: ["API logging", "Resource monitoring", "Compliance tracking", "Event history"],
      setupComplexity: "easy",
      dataTypes: ["API calls", "Resource changes", "Authentication events", "Service logs"],
      pricing: "paid",
    },
    {
      id: "azure-sentinel",
      name: "Microsoft Sentinel",
      description: "Cloud-native SIEM and SOAR solution",
      category: "siem",
      status: "available",
      icon: Database,
      features: ["Cloud SIEM", "AI analytics", "Threat hunting", "Automated response"],
      setupComplexity: "medium",
      dataTypes: ["Security events", "Office 365 logs", "Azure logs", "Custom data"],
      pricing: "paid",
    },
    {
      id: "virustotal",
      name: "VirusTotal",
      description: "File and URL analysis service for threat intelligence",
      category: "threat-intel",
      status: "connected",
      icon: Lock,
      features: ["File scanning", "URL analysis", "IOC enrichment", "Threat intelligence"],
      setupComplexity: "easy",
      dataTypes: ["File hashes", "URLs", "IP addresses", "Domain names"],
      pricing: "freemium",
    },
    {
      id: "misp",
      name: "MISP",
      description: "Malware Information Sharing Platform for threat intelligence",
      category: "threat-intel",
      status: "available",
      icon: Zap,
      features: ["Threat sharing", "IOC management", "Event correlation", "API integration"],
      setupComplexity: "advanced",
      dataTypes: ["IOCs", "Threat events", "Attributes", "Taxonomies"],
      pricing: "free",
    },
  ]

  const categories = [
    { id: "all", name: "All Integrations", icon: Plug },
    { id: "siem", name: "SIEM", icon: Database },
    { id: "endpoint", name: "Endpoint", icon: Shield },
    { id: "network", name: "Network", icon: Network },
    { id: "cloud", name: "Cloud", icon: Globe },
    { id: "threat-intel", name: "Threat Intel", icon: Lock },
  ]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory
    const matchesSearch =
      integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "configured":
        return "bg-blue-500"
      case "available":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4" />
      case "configured":
        return <Settings className="h-4 w-4" />
      case "available":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "easy":
        return "text-green-400"
      case "medium":
        return "text-yellow-400"
      case "advanced":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Plug className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Security Integrations</h1>
              <p className="text-slate-400">Connect your security tools and data sources</p>
            </div>
          </div>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-600 rounded-lg">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "connected").length}</p>
                  <p className="text-sm text-slate-400">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "configured").length}</p>
                  <p className="text-sm text-slate-400">Configured</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-600 rounded-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "available").length}</p>
                  <p className="text-sm text-slate-400">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{integrations.length}</p>
                  <p className="text-sm text-slate-400">Total Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      <IconComponent className="h-4 w-4" />
                      {category.name}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const IconComponent = integration.icon
            return (
              <Card
                key={integration.id}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => setIsDialogOpen(true)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${getStatusColor(integration.status)} text-white text-xs`}>
                            {getStatusIcon(integration.status)}
                            <span className="ml-1 capitalize">{integration.status}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {integration.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-300">{integration.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Setup Complexity:</span>
                      <span className={`font-medium capitalize ${getComplexityColor(integration.setupComplexity)}`}>
                        {integration.setupComplexity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Pricing:</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {integration.pricing}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-400">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {integration.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{integration.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm">
                        {integration.status === "connected" ? "Manage" : "Configure"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-800">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-blue-400" />
                          {integration.name}
                        </DialogTitle>
                        <DialogDescription>Integration configuration and management</DialogDescription>
                      </DialogHeader>
                      <div className="py-6 text-center">
                        <div className="mb-4">
                          <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Settings className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Feature in Progress</h3>
                          <p className="text-slate-400 mb-6">
                            Integration configuration and management features are currently under development. Check
                            back soon for full functionality!
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              Close
                            </Button>
                            <Link href="/">
                              <Button className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Return to Dashboard
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredIntegrations.length === 0 && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Plug className="h-12 w-12 text-slate-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No integrations found</h3>
              <p className="text-slate-400 text-center">Try adjusting your search terms or category filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
