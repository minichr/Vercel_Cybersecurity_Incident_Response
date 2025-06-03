"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Bot, User, Send, Lightbulb, AlertTriangle, Shield, Search, Target } from "lucide-react"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface ChatInterfaceProps {
  incidentData: any
}

export default function ChatInterface({ incidentData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hello! I'm your Cybersecurity AI Agent. I've analyzed your uploaded logs and detected several indicators of compromise. How can I assist you with the incident response?",
      timestamp: new Date(),
      suggestions: [
        "Explain the detected IOCs",
        "What should I do first?",
        "How severe is this incident?",
        "Show me the attack timeline",
      ],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const quickQuestions = [
    "What type of malware was detected?",
    "How did the attacker gain access?",
    "What systems are affected?",
    "How to prevent lateral movement?",
    "What data might be compromised?",
    "How to collect forensic evidence?",
  ]

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, incidentData)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (userInput: string, data: any) => {
    const input = userInput.toLowerCase()

    if (input.includes("ioc") || input.includes("indicator")) {
      return {
        content: `Based on the log analysis, I've identified ${data.iocs?.length || 0} indicators of compromise:

• **Critical IOCs**: Malware file hash detected in system32 directory
• **High-risk IOCs**: Suspicious outbound connections to known C2 servers
• **Medium-risk IOCs**: Unusual process behaviors and registry modifications

The most concerning finding is the connection to IP 192.168.1.100, which is associated with known threat actors. Immediate containment is recommended.`,
        suggestions: ["How to block this IP?", "What is the malware family?", "Show containment steps"],
      }
    }

    if (input.includes("first") || input.includes("priority")) {
      return {
        content: `Your immediate priorities should be:

1. **Isolate affected systems** - Disconnect from network to prevent lateral movement
2. **Block malicious IPs** - Add firewall rules to block 192.168.1.100
3. **Preserve evidence** - Create memory dumps before any cleanup
4. **Assess scope** - Check for signs of lateral movement

The incident severity is **HIGH** based on the presence of active C2 communication and malware persistence mechanisms.`,
        suggestions: ["How to isolate systems?", "What evidence to collect?", "Check for lateral movement"],
      }
    }

    if (input.includes("severe") || input.includes("impact")) {
      return {
        content: `This incident is classified as **HIGH SEVERITY** based on:

• Active command & control communication
• Malware with persistence mechanisms
• Potential for data exfiltration
• Evidence of system compromise

**Business Impact**: Potential data breach, system downtime, and regulatory compliance issues. Estimated recovery time: 2-4 hours with proper containment.`,
        suggestions: ["What data is at risk?", "How to notify stakeholders?", "Recovery timeline"],
      }
    }

    if (input.includes("timeline") || input.includes("attack")) {
      return {
        content: `**Attack Timeline Reconstruction**:

14:25:18 EST - Initial compromise detected (suspicious process execution)
14:28:42 EST - Malware deployment (file hash matched threat database)
14:30:05 EST - Persistence established (registry modification)
14:32:15 EST - C2 communication initiated (outbound connection to 192.168.1.100)

**Attack Vector**: Likely phishing email or drive-by download. The malware appears to be a Remote Access Trojan (RAT) with data exfiltration capabilities.`,
        suggestions: [
          "How was the initial access gained?",
          "What data was accessed?",
          "Similar attacks in our environment?",
        ],
      }
    }

    return {
      content: `I understand you're asking about "${userInput}". Based on the current incident data, I recommend focusing on immediate containment and evidence preservation. 

The detected IOCs suggest an active threat that requires prompt response. Would you like me to guide you through the specific containment steps or provide more details about the threat indicators?`,
      suggestions: ["Show containment steps", "Explain the IOCs", "What's the next priority?"],
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    })
  }

  return (
    <div className="space-y-4">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            AI Security Assistant
          </CardTitle>
          <CardDescription>Get expert guidance and ask questions about the incident</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Chat Messages */}
          <ScrollArea className="h-96 mb-4">
            <div className="space-y-4 pr-4">
              {messages.map((message) => (
                <div key={message.id} className="space-y-2">
                  <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === "user" ? "bg-blue-600" : "bg-slate-700"
                        }`}
                      >
                        {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.type === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-100"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">{formatTimestamp(message.timestamp)}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions */}
                  {message.type === "ai" && message.suggestions && (
                    <div className="ml-11 space-y-2">
                      <p className="text-xs text-slate-400">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="text-xs h-7"
                            onClick={() => handleSendMessage(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about the incident, IOCs, or next steps..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                className="bg-slate-800 border-slate-700"
              />
              <Button onClick={() => handleSendMessage(inputMessage)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7 text-slate-300 hover:text-white"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Summary Card */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            Current Incident Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-400" />
              <span>IOCs: {incidentData.iocs?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span>Severity: {incidentData.severity?.toUpperCase() || "UNKNOWN"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-blue-400" />
              <span>Status: {incidentData.status || "Initial"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Actions: {incidentData.recommendations?.length || 0}</span>
            </div>
          </div>

          <div className="pt-2">
            <Badge variant="outline" className="text-xs">
              Last Updated: {formatTimestamp(new Date())}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
