"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Search, Download, Copy } from "lucide-react"

interface LogViewerDialogProps {
  filename: string
  highlightedLines: number[]
  children: React.ReactNode
}

export default function LogViewerDialog({ filename, highlightedLines, children }: LogViewerDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  // Mock log content - in a real app, this would be fetched from the server
  const logContent = `Jan 15, 2024 at 2:25:18 PM EST [INFO] Process Monitor: New process created - PID: 4892, Name: svchost.exe, Path: C:\\Windows\\System32\\svchost.exe, Parent: services.exe
Jan 15, 2024 at 2:25:19 PM EST [WARNING] Network Monitor: Outbound connection attempt - Process: svchost.exe, Destination: 192.168.1.100:443, Protocol: HTTPS
Jan 15, 2024 at 2:25:20 PM EST [ERROR] File System Monitor: Suspicious file creation - Path: C:\\Windows\\System32\\malware.exe, Size: 2048576 bytes, Hash: a1b2c3d4e5f67890abcdef1234567890
Jan 15, 2024 at 2:25:21 PM EST [CRITICAL] Registry Monitor: Unauthorized registry modification - Key: HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run, Value: "SystemUpdate", Data: "C:\\Windows\\System32\\malware.exe"
Jan 15, 2024 at 2:25:22 PM EST [WARNING] Process Monitor: Unusual process behavior - PID: 4892, CPU Usage: 85%, Memory: 512MB, Network Activity: High
Jan 15, 2024 at 2:25:25 PM EST [INFO] Authentication: Failed login attempt - User: admin, Source IP: 10.0.0.50, Reason: Invalid credentials
Jan 15, 2024 at 2:25:30 PM EST [ERROR] File System Monitor: File encryption detected - Path: C:\\Users\\john.doe\\Documents\\*, Pattern: .encrypted extension
Jan 15, 2024 at 2:26:15 PM EST [CRITICAL] Network Monitor: Data exfiltration detected - Process: malware.exe, Destination: 192.168.1.100:8080, Data Size: 50MB
Jan 15, 2024 at 2:26:45 PM EST [WARNING] Process Monitor: Process injection detected - Source: malware.exe, Target: explorer.exe, Technique: DLL Injection
Jan 15, 2024 at 2:27:10 PM EST [ERROR] Registry Monitor: Persistence mechanism - Key: HKLM\\System\\CurrentControlSet\\Services\\FakeService, Type: Service Installation
Jan 15, 2024 at 2:27:30 PM EST [INFO] Network Monitor: DNS query - Process: malware.exe, Query: c2-server.malicious-domain.com, Response: 192.168.1.100
Jan 15, 2024 at 2:28:00 PM EST [CRITICAL] File System Monitor: System file modification - Path: C:\\Windows\\System32\\drivers\\*, Modified files: 3
Jan 15, 2024 at 2:28:15 PM EST [WARNING] Process Monitor: Privilege escalation attempt - Process: malware.exe, Technique: Token Impersonation, Target: SYSTEM
Jan 15, 2024 at 2:28:42 PM EST [CRITICAL] Antivirus: Malware detected - File: C:\\Windows\\System32\\malware.exe, Threat: Trojan.Win32.Agent.ABC, Action: Quarantine Failed
Jan 15, 2024 at 2:29:00 PM EST [ERROR] Network Monitor: Command and Control communication - Process: malware.exe, C2 Server: 192.168.1.100, Commands received: 5
Jan 15, 2024 at 2:29:30 PM EST [WARNING] File System Monitor: Lateral movement attempt - Target: \\\\SERVER01\\C$\\Windows\\System32\\, File: malware.exe, Status: Access Denied
Jan 15, 2024 at 2:30:05 PM EST [CRITICAL] Registry Monitor: Boot persistence - Key: HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\BootExecute, Value: Modified
Jan 15, 2024 at 2:30:45 PM EST [INFO] Process Monitor: Process termination - PID: 4892, Name: svchost.exe, Exit Code: 0, Duration: 5 minutes
Jan 15, 2024 at 2:31:00 PM EST [ERROR] Network Monitor: Suspicious network traffic - Protocol: IRC, Destination: 192.168.1.100:6667, Data: Encrypted
Jan 15, 2024 at 2:31:30 PM EST [WARNING] Authentication: Multiple failed login attempts - User: administrator, Source IP: 192.168.1.100, Count: 15
Jan 15, 2024 at 2:32:00 PM EST [CRITICAL] File System Monitor: Ransomware behavior detected - Files encrypted: 1,247, Ransom note: C:\\Users\\john.doe\\Desktop\\README_DECRYPT.txt
Jan 15, 2024 at 2:32:15 PM EST [ERROR] Network Monitor: Data staging detected - Process: malware.exe, Staging Directory: C:\\Temp\\exfil\\, Size: 250MB
Jan 15, 2024 at 2:32:45 PM EST [WARNING] Process Monitor: Memory dump attempt - Target Process: lsass.exe, Source: malware.exe, Status: Blocked by EDR
Jan 15, 2024 at 2:33:00 PM EST [INFO] System Monitor: System performance degradation - CPU: 95%, Memory: 90%, Disk I/O: High
Jan 15, 2024 at 2:33:30 PM EST [CRITICAL] Network Monitor: Large data transfer - Destination: 192.168.1.100:443, Size: 500MB, Duration: 2 minutes
Jan 15, 2024 at 2:34:00 PM EST [ERROR] Registry Monitor: Security policy modification - Key: HKLM\\System\\CurrentControlSet\\Control\\Lsa, Value: Security Packages, Status: Modified
Jan 15, 2024 at 2:34:30 PM EST [WARNING] File System Monitor: Shadow copy deletion - Command: vssadmin delete shadows /all /quiet, Status: Executed
Jan 15, 2024 at 2:35:00 PM EST [CRITICAL] Process Monitor: Rootkit behavior - Process: malware.exe, Technique: SSDT Hooking, Status: Active`

  const logLines = logContent.split("\n")

  const filteredLines = logLines.filter((line, index) => {
    if (!searchTerm) return true
    return line.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getSeverityFromLine = (line: string) => {
    if (line.includes("[CRITICAL]")) return "critical"
    if (line.includes("[ERROR]")) return "high"
    if (line.includes("[WARNING]")) return "medium"
    if (line.includes("[INFO]")) return "low"
    return "unknown"
  }

  const getSeverityColor = (severity: string) => {
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
        return "text-slate-400"
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadLog = () => {
    const blob = new Blob([logContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-6xl h-[80vh] bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            {filename}
            <Badge variant="outline" className="ml-auto">
              {highlightedLines.length} highlighted lines
            </Badge>
          </DialogTitle>
          <DialogDescription>Full log file view with highlighted suspicious activities</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col">
          {/* Search and Actions */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search log entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            <Button size="sm" variant="outline" onClick={downloadLog}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          {/* Log Content */}
          <ScrollArea className="flex-1 border border-slate-700 rounded-lg">
            <div className="p-4 font-mono text-sm">
              {(searchTerm ? filteredLines : logLines).map((line, index) => {
                const actualLineNumber = searchTerm ? logLines.indexOf(line) + 1 : index + 1
                const isHighlighted = highlightedLines.includes(actualLineNumber)
                const severity = getSeverityFromLine(line)

                return (
                  <div
                    key={index}
                    className={`flex gap-3 py-1 px-2 rounded ${
                      isHighlighted ? "bg-yellow-500/20 border-l-4 border-yellow-500" : "hover:bg-slate-800/50"
                    }`}
                  >
                    <span className="text-slate-500 w-8 text-right select-none">{actualLineNumber}:</span>
                    <span className={`flex-1 ${getSeverityColor(severity)}`}>{line}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={() => copyToClipboard(line)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Summary */}
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              {searchTerm ? filteredLines.length : logLines.length} lines
              {searchTerm && ` (filtered from ${logLines.length})`}
            </span>
            <span>{highlightedLines.length} suspicious activities detected</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
