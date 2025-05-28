"use client"

import type React from "react"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface CreateIncidentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateIncidentModal({ open, onOpenChange }: CreateIncidentModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [service, setService] = useState("")
  const [severity, setSeverity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form and close modal
    setTitle("")
    setDescription("")
    setService("")
    setSeverity("")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#D5001F] rounded-full animate-pulse"></span>
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#FF6900] rounded-full"></span>
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#006FCF] rounded-full"></span>
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#00A859] rounded-full"></span>
            Low
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-[#00175A] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#D5001F]" />
              Create New Incident
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#00175A]">
                Incident Title <span className="text-[#D5001F]">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-[#E5E7EB]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#00175A]">
                Description <span className="text-[#D5001F]">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the incident in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] border-[#E5E7EB]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service" className="text-[#00175A]">
                  Affected Service <span className="text-[#D5001F]">*</span>
                </Label>
                <Select value={service} onValueChange={setService} required>
                  <SelectTrigger id="service" className="border-[#E5E7EB]">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="database">Database Cluster</SelectItem>
                    <SelectItem value="api">API Services</SelectItem>
                    <SelectItem value="payment">Payment Gateway</SelectItem>
                    <SelectItem value="auth">Auth System</SelectItem>
                    <SelectItem value="storage">Object Storage</SelectItem>
                    <SelectItem value="cdn">Content Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity" className="text-[#00175A]">
                  Severity <span className="text-[#D5001F]">*</span>
                </Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger id="severity" className="border-[#E5E7EB]">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#D5001F] rounded-full animate-pulse"></span>
                        Critical
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#FF6900] rounded-full"></span>
                        High
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#006FCF] rounded-full"></span>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#00A859] rounded-full"></span>
                        Low
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB]">
            <div>
              {severity && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#6B7280]">Severity:</span>
                  {getSeverityBadge(severity)}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-[#E5E7EB]">
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#006FCF] hover:bg-[#00175A]"
                disabled={isSubmitting || !title || !description || !service || !severity}
              >
                {isSubmitting ? "Creating..." : "Create Incident"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
