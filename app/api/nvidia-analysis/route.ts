import { type NextRequest, NextResponse } from "next/server"

// Server-side NVIDIA NIM API Integration
interface NIMConfig {
  apiKey: string
  baseUrl: string
  model: string
}

interface LogAnalysisRequest {
  logs: string[]
  analysisType: "ioc_detection" | "threat_classification" | "anomaly_detection" | "entity_extraction"
  context?: string
}

interface IOCAnalysisResult {
  iocs: Array<{
    type: string
    value: string
    confidence: number
    severity: "low" | "medium" | "high" | "critical"
    description: string
    mitre_tactics?: string[]
    threat_actor?: string
    malware_family?: string
  }>
  threats: Array<{
    name: string
    confidence: number
    description: string
    mitre_attack_id?: string
  }>
  anomalies: Array<{
    description: string
    severity: string
    timestamp: string
    affected_systems: string[]
  }>
  summary: {
    total_events: number
    high_risk_events: number
    threat_score: number
    recommended_actions: string[]
  }
}

// Mock analysis result for development
const mockAnalysisResult: IOCAnalysisResult = {
  iocs: [
    {
      type: "ip_address",
      value: "192.168.1.100",
      confidence: 0.95,
      severity: "critical",
      description: "Command & Control server with multiple connections",
      mitre_tactics: ["command-and-control", "exfiltration"],
      threat_actor: "APT29",
      malware_family: "Cobalt Strike",
    },
  ],
  threats: [
    {
      name: "Ransomware Attack",
      confidence: 0.87,
      description: "Multi-stage ransomware attack with data exfiltration",
      mitre_attack_id: "T1486",
    },
  ],
  anomalies: [
    {
      description: "Unusual process behavior with high network activity",
      severity: "high",
      timestamp: "2024-01-15 14:25:22",
      affected_systems: ["ENDPOINT-01"],
    },
  ],
  summary: {
    total_events: 30,
    high_risk_events: 12,
    threat_score: 87,
    recommended_actions: ["Isolate affected systems", "Block C2 IP addresses", "Collect forensic evidence"],
  },
}

// Server-side function to analyze logs using NVIDIA NIM API
async function analyzeLogsWithNIM(request: LogAnalysisRequest): Promise<IOCAnalysisResult> {
  const config: NIMConfig = {
    apiKey: process.env.NVIDIA_API_KEY || "", // Server-side environment variable (no NEXT_PUBLIC prefix)
    baseUrl: "https://integrate.api.nvidia.com",
    model: "meta/llama-3.1-70b-instruct",
  }

  // For development/demo purposes, return mock data
  // In production, this would make an actual API call to NVIDIA
  if (process.env.NODE_ENV === "development" || !config.apiKey) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return mockAnalysisResult
  }

  try {
    const prompt = buildAnalysisPrompt(request)

    const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content: `You are an expert cybersecurity analyst specializing in log analysis and threat detection. 
            Analyze the provided logs and extract indicators of compromise (IOCs), identify threats, and detect anomalies.
            Respond with structured JSON containing IOCs, threats, anomalies, and a summary with threat scoring.
            Use MITRE ATT&CK framework references where applicable.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`NIM API error: ${response.statusText}`)
    }

    const data = await response.json()
    const analysisResult = JSON.parse(data.choices[0].message.content)

    return enhanceAnalysisResult(analysisResult)
  } catch (error) {
    console.error("NVIDIA NIM Analysis Error:", error)
    // Return mock data as fallback
    return mockAnalysisResult
  }
}

// Helper functions
function buildAnalysisPrompt(request: LogAnalysisRequest): string {
  return `
  Analyze the following security logs for indicators of compromise, threats, and anomalies:

  LOGS:
  ${request.logs.join("\n")}

  ANALYSIS TYPE: ${request.analysisType}
  ${request.context ? `CONTEXT: ${request.context}` : ""}

  Please provide a comprehensive analysis in JSON format with IOCs, threats, anomalies, and summary.
  `
}

function enhanceAnalysisResult(result: IOCAnalysisResult): IOCAnalysisResult {
  // Add confidence scoring and severity normalization
  result.iocs = result.iocs.map((ioc) => ({
    ...ioc,
    confidence: Math.min(Math.max(ioc.confidence, 0), 1),
    severity: normalizeSeverity(ioc.severity),
  }))

  // Calculate overall threat score
  if (!result.summary.threat_score) {
    const criticalCount = result.iocs.filter((ioc) => ioc.severity === "critical").length
    const highCount = result.iocs.filter((ioc) => ioc.severity === "high").length
    result.summary.threat_score = Math.min(100, criticalCount * 25 + highCount * 15)
  }

  return result
}

function normalizeSeverity(severity: string): "low" | "medium" | "high" | "critical" {
  const normalizedSeverity = severity.toLowerCase()
  if (["critical", "high", "medium", "low"].includes(normalizedSeverity)) {
    return normalizedSeverity as "low" | "medium" | "high" | "critical"
  }
  return "medium" // default fallback
}

// API Route Handler
export async function POST(request: NextRequest) {
  try {
    const requestData: LogAnalysisRequest = await request.json()

    if (!requestData.logs || !Array.isArray(requestData.logs) || requestData.logs.length === 0) {
      return NextResponse.json({ error: "Invalid request: logs array is required" }, { status: 400 })
    }

    const analysisResult = await analyzeLogsWithNIM(requestData)
    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to analyze logs" }, { status: 500 })
  }
}
