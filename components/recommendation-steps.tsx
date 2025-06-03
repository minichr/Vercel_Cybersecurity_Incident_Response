"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, AlertTriangle, ArrowRight, Play, Pause, RotateCcw, Timer } from "lucide-react"

interface RecommendationStep {
  id: number
  title: string
  description: string
  priority: "critical" | "high" | "medium" | "low"
  status: "pending" | "in-progress" | "completed" | "skipped"
  estimatedTime: string
  steps: string[]
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
    const completed = steps.filter((_, index) => completedSubSteps[`${stepId}-${index}`]).length
    return steps.length > 0 ? (completed / steps.length) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Incident Response Progress
          </CardTitle>
          <CardDescription>Follow these recommended steps to contain and remediate the incident</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{Math.round(getCompletionPercentage())}%</span>
              </div>
              <Progress value={getCompletionPercentage()} className="h-3" />
            </div>

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

      {/* Recommendation Steps */}
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => {
          const isActive = index === activeStep
          const status = stepStatuses[recommendation.id] || recommendation.status
          const subStepProgress = getSubStepCompletion(recommendation.id, recommendation.steps)

          return (
            <Card
              key={recommendation.id}
              className={`bg-slate-900 border-slate-800 transition-all ${isActive ? "ring-2 ring-blue-500" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {recommendation.title}
                        {getStatusIcon(status)}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge className={`${getPriorityColor(recommendation.priority)} text-white text-xs`}>
                          {recommendation.priority.toUpperCase()}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs">
                          <Timer className="h-3 w-3" />
                          {recommendation.estimatedTime}
                        </span>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {status === "pending" && (
                      <Button size="sm" onClick={() => updateStepStatus(recommendation.id, "in-progress")}>
                        <Play className="h-4 w-4 mr-1" />
                        Start
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
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-slate-300">{recommendation.description}</p>

                {/* Sub-step Progress */}
                {recommendation.steps.length > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Step Progress</span>
                      <span>{Math.round(subStepProgress)}%</span>
                    </div>
                    <Progress value={subStepProgress} className="h-2" />
                  </div>
                )}

                {/* Detailed Steps */}
                {(isActive || status === "in-progress") && (
                  <div className="space-y-3 mt-4">
                    <Separator className="bg-slate-700" />
                    <h4 className="font-medium text-sm">Detailed Steps:</h4>
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
                                className={`text-sm ${isCompleted ? "line-through text-slate-400" : "text-slate-200"}`}
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

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button variant="outline" size="sm" disabled={index === 0} onClick={() => onStepChange(index - 1)}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === recommendations.length - 1}
                    onClick={() => onStepChange(index + 1)}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
