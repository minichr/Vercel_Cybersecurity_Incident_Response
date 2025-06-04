"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Shield,
  Search,
  FileText,
  Users,
} from "lucide-react"

interface RecommendationStep {
  id: number
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed" | "skipped"
  estimatedTime: string
  steps: string[]
  phase: "detection" | "containment" | "eradication" | "recovery" | "post-incident"
  dependencies?: number[]
  automatable?: boolean
  tools?: string[]
  evidence?: string[]
}

interface RecommendationStepsProps {
  recommendations: RecommendationStep[]
  activeStep: number
  onStepChange: (step: number) => void
}

export default function RecommendationSteps({ recommendations, activeStep, onStepChange }: RecommendationStepsProps) {
  const [stepStatuses, setStepStatuses] = useState<Record<number, string>>(
    recommendations.reduce((acc, rec) => ({ ...acc, [rec.id]: rec.status }), {}),
  )
  const [completedSubSteps, setCompletedSubSteps] = useState<Record<string, boolean>>({})

  // Dynamic Incident Response Framework phases
  const irPhases = [
    {
      id: "detection",
      name: "Detection & Analysis",
      description: "Identify and analyze the security incident",
      icon: Search,
      color: "bg-blue-500",
    },
    {
      id: "containment",
      name: "Containment",
      description: "Contain the threat and prevent further damage",
      icon: Shield,
      color: "bg-orange-500",
    },
    {
      id: "eradication",
      name: "Eradication & Recovery",
      description: "Remove threats and restore normal operations",
      icon: FileText,
      color: "bg-red-500",
    },
    {
      id: "post-incident",
      name: "Post-Incident Activities",
      description: "Document lessons learned and improve processes",
      icon: Users,
      color: "bg-green-500",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-400 animate-pulse" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "skipped":
        return <RotateCcw className="h-5 w-5 text-gray-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const updateStepStatus = (stepId: number, status: string) => {
    setStepStatuses((prev) => ({ ...prev, [stepId]: status }))
  }

  const toggleSubStep = (stepKey: string) => {
    setCompletedSubSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }))
  }

  const getCompletionPercentage = () => {
    const completed = Object.values(stepStatuses).filter((status) => status === "completed").length
    return (completed / recommendations.length) * 100
  }

  const getSubStepCompletion = (stepId: number, steps: string[]) => {
    // Ensure steps is an array and has length
    if (!Array.isArray(steps) || steps.length === 0) return 0

    const completed = steps.filter((_, index) => completedSubSteps[`${stepId}-${index}`]).length
    return (completed / steps.length) * 100
  }

  const getPhaseProgress = (phaseId: string) => {
    const phaseRecommendations = recommendations.filter((rec) => rec.phase === phaseId)
    if (phaseRecommendations.length === 0) return 0

    const completed = phaseRecommendations.filter((rec) => stepStatuses[rec.id] === "completed").length
    return (completed / phaseRecommendations.length) * 100
  }

  const canStartStep = (recommendation: RecommendationStep) => {
    if (!recommendation.dependencies || recommendation.dependencies.length === 0) return true

    return recommendation.dependencies.every((depId) => stepStatuses[depId] === "completed")
  }

  return (
    <div className="space-y-6">
      {/* Dynamic IR Framework Overview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            Dynamic Incident Response Framework
          </CardTitle>
          <CardDescription>Adaptive incident response workflow based on threat characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(getCompletionPercentage())}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-3" />
            </div>

            {/* Phase Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {irPhases.map((phase) => {
                const progress = getPhaseProgress(phase.id)
                const IconComponent = phase.icon
                const phaseRecommendations = recommendations.filter((rec) => rec.phase === phase.id)

                return (
                  <div key={phase.id} className="bg-slate-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1 rounded ${phase.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{phase.name}</span>
                    </div>
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>{Math.round(progress)}% complete</span>
                        <span>{phaseRecommendations.length} tasks</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {["pending", "in-progress", "completed", "skipped"].map((status) => {
                const count = Object.values(stepStatuses).filter((s) => s === status).length
                return (
                  <div key={status} className="p-3 bg-slate-800 rounded-lg">
                    <div className="text-xl font-bold text-white">{count}</div>
                    <div className="text-xs text-slate-400 capitalize">{status.replace("-", " ")}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Steps by Phase */}
      <div className="space-y-6">
        {irPhases.map((phase) => {
          const phaseRecommendations = recommendations.filter((rec) => rec.phase === phase.id)
          if (phaseRecommendations.length === 0) return null

          const IconComponent = phase.icon

          return (
            <Card key={phase.id} className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${phase.color}`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  {phase.name}
                  <Badge variant="outline" className="ml-auto">
                    {phaseRecommendations.length} tasks
                  </Badge>
                </CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {phaseRecommendations.map((recommendation, index) => {
                    const isActive = recommendation.id === recommendations[activeStep]?.id
                    const status = stepStatuses[recommendation.id] || recommendation.status
                    const subStepProgress = getSubStepCompletion(recommendation.id, recommendation.steps || [])
                    const canStart = canStartStep(recommendation)

                    return (
                      <div
                        key={recommendation.id}
                        className={`p-4 rounded-lg border transition-all ${
                          isActive ? "border-blue-500 bg-slate-800" : "border-slate-700 bg-slate-850"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700">
                              <span className="text-sm font-bold">{recommendation.id}</span>
                            </div>
                            <div>
                              <h4 className="font-medium flex items-center gap-2">
                                {recommendation.title}
                                {getStatusIcon(status)}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={`${getPriorityColor(recommendation.priority)} text-white text-xs`}>
                                  {recommendation.priority.toUpperCase()}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs text-slate-400">
                                  <Timer className="h-3 w-3" />
                                  {recommendation.estimatedTime}
                                </span>
                                {recommendation.automatable && (
                                  <Badge variant="outline" className="text-xs">
                                    Automatable
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {status === "pending" && canStart && (
                              <Button size="sm" onClick={() => updateStepStatus(recommendation.id, "in-progress")}>
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                            {status === "pending" && !canStart && (
                              <Button size="sm" disabled variant="outline">
                                <Clock className="h-4 w-4 mr-1" />
                                Blocked
                              </Button>
                            )}
                            {status === "in-progress" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateStepStatus(recommendation.id, "pending")}
                                >
                                  <Pause className="h-4 w-4 mr-1" />
                                  Pause
                                </Button>
                                <Button size="sm" onClick={() => updateStepStatus(recommendation.id, "completed")}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              </>
                            )}
                            {status === "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStepStatus(recommendation.id, "in-progress")}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Redo
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 mb-3">{recommendation.description}</p>

                        {/* Dependencies */}
                        {recommendation.dependencies && recommendation.dependencies.length > 0 && (
                          <div className="mb-3">
                            <span className="text-xs text-slate-400">Dependencies: </span>
                            {recommendation.dependencies.map((depId, idx) => {
                              const depStatus = stepStatuses[depId]
                              const isCompleted = depStatus === "completed"
                              return (
                                <Badge
                                  key={depId}
                                  variant={isCompleted ? "default" : "outline"}
                                  className={`text-xs mr-1 ${isCompleted ? "bg-green-600" : ""}`}
                                >
                                  Task {depId}
                                </Badge>
                              )
                            })}
                          </div>
                        )}

                        {/* Sub-step Progress */}
                        {recommendation.steps && recommendation.steps.length > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-2">
                              <span>Task Progress</span>
                              <span>{Math.round(subStepProgress)}%</span>
                            </div>
                            <Progress value={subStepProgress} className="h-2" />
                          </div>
                        )}

                        {/* Detailed Steps */}
                        {(isActive || status === "in-progress") && recommendation.steps && (
                          <div className="space-y-3 mt-4">
                            <Separator className="bg-slate-700" />
                            <h5 className="font-medium text-sm">Detailed Steps:</h5>
                            <div className="space-y-2">
                              {recommendation.steps.map((step, stepIndex) => {
                                const stepKey = `${recommendation.id}-${stepIndex}`
                                const isCompleted = completedSubSteps[stepKey]

                                return (
                                  <div key={stepIndex} className="flex items-start gap-3 p-2 rounded bg-slate-800">
                                    <Checkbox
                                      checked={isCompleted}
                                      onCheckedChange={() => toggleSubStep(stepKey)}
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <p
                                        className={`text-sm ${
                                          isCompleted ? "line-through text-slate-400" : "text-slate-200"
                                        }`}
                                      >
                                        {step}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tools and Evidence */}
                        {(recommendation.tools || recommendation.evidence) && (
                          <div className="mt-3 pt-3 border-t border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {recommendation.tools && recommendation.tools.length > 0 && (
                                <div>
                                  <span className="text-xs text-slate-400 block mb-1">Required Tools:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {recommendation.tools.map((tool, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {tool}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {recommendation.evidence && recommendation.evidence.length > 0 && (
                                <div>
                                  <span className="text-xs text-slate-400 block mb-1">Evidence to Collect:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {recommendation.evidence.map((evidence, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {evidence}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
