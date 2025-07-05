"use client"

import type React from "react"

import { useState } from "react"
import {
  Calculator,
  CheckCircle,
  Clock,
  PoundSterling,
  Home,
  Mail,
  Phone,
  Star,
  Users,
  LogIn,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function DryliningSite() {
  const [estimate, setEstimate] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectType: "",
    location: "",
    additionalNotes: "",
  })
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [analysis, setAnalysis] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [signingIn, setSigningIn] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const signInWithGoogle = async () => {
    setSigningIn(true)

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock user data (in real implementation, this would come from Google OAuth)
    const mockUser = {
      id: "123456789",
      name: "John Smith",
      email: "john.smith@example.com",
      picture: "https://via.placeholder.com/40x40/4285f4/ffffff?text=JS",
      savedProjects: [],
    }

    setUser(mockUser)
    setSigningIn(false)
  }

  const signOut = () => {
    setUser(null)
    setAnalysis(null)
    setUploadedFiles([])
    setFormData({
      projectType: "",
      location: "",
      additionalNotes: "",
    })
  }

  const analyzeFiles = async () => {
    setLoading(true)
    setAnalysis(null)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Simulate AI analysis results
    const mockAnalysis = {
      id: Date.now().toString(),
      totalArea: Math.floor(Math.random() * 200) + 100,
      roomCount: Math.floor(Math.random() * 8) + 2,
      ceilingHeight: Math.round((2.4 + Math.random() * 0.6) * 10) / 10,
      complexity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      detectedFeatures: [
        "Standard rectangular rooms",
        "Load-bearing walls identified",
        "Electrical outlets marked",
        "Window and door openings",
        "Existing plasterwork visible",
      ].slice(0, Math.floor(Math.random() * 3) + 2),
      recommendations: [
        "Consider acoustic insulation for bedrooms",
        "Fire-rated plasterboard recommended for kitchen",
        "Additional fixings needed for high ceilings",
        "Moisture-resistant boards for bathroom areas",
      ].slice(0, Math.floor(Math.random() * 2) + 1),
      materialCost: 0,
      laborCost: 0,
      totalCost: 0,
      timeEstimate: 0,
      breakdown: [],
      createdAt: new Date().toISOString(),
      projectName: `Project ${new Date().toLocaleDateString()}`,
    }

    // Calculate costs based on analysis
    const baseRate = 15
    const complexityMultiplier =
      mockAnalysis.complexity === "high" ? 1.5 : mockAnalysis.complexity === "medium" ? 1.2 : 1
    mockAnalysis.materialCost = Math.round(mockAnalysis.totalArea * 8 * complexityMultiplier)
    mockAnalysis.laborCost = Math.round(mockAnalysis.totalArea * baseRate * complexityMultiplier)
    mockAnalysis.totalCost = mockAnalysis.materialCost + mockAnalysis.laborCost
    mockAnalysis.timeEstimate = Math.ceil(mockAnalysis.totalArea / 50)
    mockAnalysis.breakdown = [
      { item: "Plasterboard (12.5mm)", cost: Math.round(mockAnalysis.totalArea * 3.5), unit: "m²", rate: 3.5 },
      { item: "Metal Framework", cost: Math.round(mockAnalysis.totalArea * 2.2), unit: "m²", rate: 2.2 },
      { item: "Fixings & Adhesive", cost: Math.round(mockAnalysis.totalArea * 1.8), unit: "m²", rate: 1.8 },
      { item: "Insulation Material", cost: Math.round(mockAnalysis.totalArea * 2.1), unit: "m²", rate: 2.1 },
      { item: "Finishing Compounds", cost: Math.round(mockAnalysis.totalArea * 1.4), unit: "m²", rate: 1.4 },
    ]

    setAnalysis(mockAnalysis)

    // If user is logged in, save to their projects
    if (user) {
      user.savedProjects = user.savedProjects || []
      user.savedProjects.unshift(mockAnalysis)
      // Keep only last 5 projects
      user.savedProjects = user.savedProjects.slice(0, 5)
    }

    setLoading(false)
  }

  const saveProject = () => {
    if (!user || !analysis) return

    // Project is already saved in analyzeFiles function
    alert("Project saved to your account!")
  }

  const generateBoQSpreadsheet = () => {
    if (!analysis) return

    // Create CSV content for Bill of Quantities
    const csvContent = [
      ["Bill of Quantities - Drylining Project"],
      ["Generated:", new Date().toLocaleDateString()],
      ["Project Area:", `${analysis.totalArea}m²`],
      ["Complexity:", analysis.complexity],
      user ? ["Customer:", user.name] : [],
      user ? ["Email:", user.email] : [],
      [""],
      ["Item", "Description", "Quantity", "Unit", "Rate (£)", "Total (£)"],
      ["1", "Plasterboard (12.5mm)", analysis.totalArea, "m²", "3.50", analysis.breakdown[0]?.cost || 0],
      ["2", "Metal Framework", analysis.totalArea, "m²", "2.20", analysis.breakdown[1]?.cost || 0],
      ["3", "Fixings & Adhesive", analysis.totalArea, "m²", "1.80", analysis.breakdown[2]?.cost || 0],
      ["4", "Insulation Material", analysis.totalArea, "m²", "2.10", analysis.breakdown[3]?.cost || 0],
      ["5", "Finishing Compounds", analysis.totalArea, "m²", "1.40", analysis.breakdown[4]?.cost || 0],
      [""],
      ["SUBTOTAL - MATERIALS", "", "", "", "", analysis.materialCost],
      ["LABOUR COSTS", "", "", "", "", analysis.laborCost],
      [""],
      ["TOTAL PROJECT COST", "", "", "", "", analysis.totalCost],
      [""],
      ["Notes:"],
      ["- Prices exclude VAT"],
      ["- Site survey recommended for final quote"],
      ["- Prices valid for 30 days"],
    ]
      .filter((row) => row.length > 0)
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `BoQ_Drylining_${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const generateAnalysisPDF = () => {
    if (!analysis) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20
    let yPosition = 30

    // Header
    doc.setFontSize(24)
    doc.setTextColor(234, 88, 12) // Orange color
    doc.text("AI Analysis Report", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 10
    doc.setFontSize(18)
    doc.setTextColor(0, 0, 0)
    doc.text("Drylining Project Estimate", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 15
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: "center" })

    if (user) {
      yPosition += 8
      doc.text(`Customer: ${user.name} (${user.email})`, pageWidth / 2, yPosition, { align: "center" })
    }

    // Add line separator
    yPosition += 10
    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(2)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 20

    // Project Summary Section
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Project Summary", margin, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    const summaryData = [
      [`Total Area: ${analysis.totalArea}m²`, `Rooms Identified: ${analysis.roomCount}`],
      [`Ceiling Height: ${analysis.ceilingHeight}m`, `Complexity Level: ${analysis.complexity}`],
      [`Estimated Duration: ${analysis.timeEstimate} days`, `Location: ${formData.location || "Not specified"}`],
    ]

    summaryData.forEach((row) => {
      doc.text(row[0], margin, yPosition)
      doc.text(row[1], pageWidth / 2, yPosition)
      yPosition += 8
    })

    yPosition += 10

    // Cost Summary Box
    doc.setFillColor(248, 250, 252) // Light gray background
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 40, "F")
    doc.setDrawColor(234, 88, 12)
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 40)

    yPosition += 15
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("Cost Summary", margin + 10, yPosition)

    yPosition += 10
    doc.setFontSize(12)
    doc.text(`Materials: £${analysis.materialCost.toLocaleString()}`, margin + 10, yPosition)
    doc.text(`Labour: £${analysis.laborCost.toLocaleString()}`, pageWidth / 2, yPosition)

    yPosition += 10
    doc.setFontSize(16)
    doc.setTextColor(234, 88, 12)
    doc.text(`Total: £${analysis.totalCost.toLocaleString()}`, pageWidth / 2, yPosition, { align: "center" })

    yPosition += 25

    // Material Breakdown Table
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Material Breakdown", margin, yPosition)
    yPosition += 10

    const tableData = analysis.breakdown.map((item: any, index: number) => [
      (index + 1).toString(),
      item.item,
      analysis.totalArea.toString(),
      item.unit || "m²",
      `£${item.rate?.toFixed(2) || "0.00"}`,
      `£${item.cost.toLocaleString()}`,
    ])

    autoTable(doc, {
      startY: yPosition,
      head: [["#", "Description", "Quantity", "Unit", "Rate", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [234, 88, 12],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 60 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
      },
    })

    // @ts-ignore – provided by jspdf-autotable
    yPosition = (doc as any).lastAutoTable.finalY + 20

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 30
    }

    // Detected Features
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text("Detected Features", margin, yPosition)
    yPosition += 15

    doc.setFontSize(11)
    analysis.detectedFeatures.forEach((feature: string) => {
      doc.setTextColor(22, 163, 74) // Green color
      doc.text("✓", margin, yPosition)
      doc.setTextColor(0, 0, 0)
      doc.text(feature, margin + 10, yPosition)
      yPosition += 8
    })

    yPosition += 10

    // AI Recommendations
    doc.setFontSize(16)
    doc.text("AI Recommendations", margin, yPosition)
    yPosition += 15

    doc.setFontSize(11)
    analysis.recommendations.forEach((rec: string, index: number) => {
      doc.setTextColor(234, 88, 12)
      doc.text("•", margin, yPosition)
      doc.setTextColor(0, 0, 0)
      const splitText = doc.splitTextToSize(rec, pageWidth - margin - 20)
      doc.text(splitText, margin + 10, yPosition)
      yPosition += splitText.length * 6 + 2
    })

    yPosition += 15

    // Important Notes
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("Important Notes", margin, yPosition)
    yPosition += 10

    doc.setFontSize(10)
    const notes = [
      "• This estimate is based on AI analysis of uploaded documents",
      "• A site survey is recommended for final accurate quotation",
      "• Prices exclude VAT and are valid for 30 days",
      "• Actual costs may vary based on site conditions and access",
    ]

    notes.forEach((note) => {
      const splitNote = doc.splitTextToSize(note, pageWidth - 2 * margin)
      doc.text(splitNote, margin, yPosition)
      yPosition += splitNote.length * 5 + 2
    })

    // Footer
    const footerY = doc.internal.pageSize.height - 30
    doc.setDrawColor(234, 88, 12)
    doc.line(margin, footerY, pageWidth - margin, footerY)

    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text("Generated by Drylining AI Analysis System", pageWidth / 2, footerY + 10, { align: "center" })
    doc.text("Contact: info@drylining.co | 0800 123 4567", pageWidth / 2, footerY + 18, { align: "center" })

    // Save the PDF
    doc.save(`Analysis_Report_${analysis.projectName}_${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">Drylining</h1>
                <p className="text-sm text-slate-600">AI-Powered Drylining Estimates</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#services" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Services
                </a>
                <a href="#estimator" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Estimator
                </a>
                <a href="#about" className="text-slate-600 hover:text-orange-600 transition-colors">
                  About
                </a>
                <a href="#contact" className="text-slate-600 hover:text-orange-600 transition-colors">
                  Contact
                </a>
              </nav>

              {/* Authentication */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <img src={user.picture || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                      <span className="hidden md:inline">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    {user.savedProjects && user.savedProjects.length > 0 && (
                      <>
                        <div className="px-3 py-2 border-b">
                          <p className="text-xs font-medium text-slate-600 mb-2">Recent Projects</p>
                          {user.savedProjects.slice(0, 3).map((project: any) => (
                            <div key={project.id} className="text-xs text-slate-500 mb-1">
                              {project.projectName} - £{project.totalCost.toLocaleString()}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <DropdownMenuItem onClick={signOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={signInWithGoogle}
                  disabled={signingIn}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {signingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in with Google
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">AI-Powered Estimation</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Professional Drylining
            <span className="text-orange-600"> Estimates</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Get accurate, AI-powered cost estimates for your drylining projects in seconds. Professional service with
            transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => document.getElementById("estimator")?.scrollIntoView()}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Get Free Estimate
            </Button>
            <Button size="lg" variant="outline">
              <Phone className="mr-2 h-5 w-5" />
              Call for Quote
            </Button>
          </div>
          {!user && <p className="text-sm text-slate-500 mt-4">Sign in to save your projects and access them later</p>}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Instant Estimates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">AI-powered calculations provide accurate estimates in under 30 seconds</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <PoundSterling className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Transparent Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Detailed breakdowns in £ with no hidden costs or surprise charges</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Expert Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">15+ years experience in commercial and residential drylining</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive drylining solutions for residential and commercial projects
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Stud Partitioning",
              "Plasterboard Installation",
              "Suspended Ceilings",
              "Insulation Services",
              "Fire Rated Systems",
              "Acoustic Solutions",
              "Renovation Projects",
              "New Build Construction",
            ].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="h-8 w-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-slate-900">{service}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Estimator */}
      <section id="estimator" className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">AI Document Analyser</h2>
            <p className="text-slate-600">
              Upload your floor plans, drawings, or project photos for instant AI analysis
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Upload Project Files</CardTitle>
                <CardDescription>Upload PDFs, floor plans, architectural drawings, or project photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-900">Drop files here or click to upload</p>
                      <p className="text-sm text-slate-500 mt-1">Supports: PDF, JPG, PNG, JPEG (Max 10MB per file)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-900">Uploaded Files:</h4>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {file.type.includes("pdf") ? (
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-red-600">PDF</span>
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-600">IMG</span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900">{file.name}</p>
                            <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="projectType">Project Type (Optional)</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select if known" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="new-build">New Build</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location/Postcode</Label>
                    <Input
                      id="location"
                      placeholder="e.g. London, SW1A 1AA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any specific requirements or context about the project..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  onClick={analyzeFiles}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  disabled={loading || uploadedFiles.length === 0}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Analyze Files & Generate Estimate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-600" />
                    AI Analysis Results
                    {user && (
                      <Badge variant="secondary" className="ml-auto">
                        Saved
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Based on uploaded documents and images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">£{analysis.totalCost.toLocaleString()}</div>
                    <div className="text-sm text-slate-600 mt-1">Total Estimated Cost</div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-slate-900">Project Analysis</h4>
                      <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Total Area Detected:</span>
                          <span className="font-medium">{analysis.totalArea}m²</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Rooms Identified:</span>
                          <span className="font-medium">{analysis.roomCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Ceiling Height:</span>
                          <span className="font-medium">{analysis.ceilingHeight}m</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Complexity Level:</span>
                          <span className="font-medium capitalize">{analysis.complexity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-xl font-semibold text-slate-900">
                          £{analysis.materialCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">Materials</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <div className="text-xl font-semibold text-slate-900">
                          £{analysis.laborCost.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">Labour</div>
                      </div>
                    </div>

                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-lg font-semibold text-blue-900">{analysis.timeEstimate} Days</div>
                      <div className="text-sm text-blue-600">Estimated Duration</div>
                    </div>

                    {analysis.detectedFeatures.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Detected Features</h4>
                        <div className="space-y-2">
                          {analysis.detectedFeatures.map((feature: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-slate-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-3">Material Breakdown</h4>
                      <div className="space-y-2">
                        {analysis.breakdown.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-slate-600">{item.item}</span>
                            <span className="font-medium">£{item.cost}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {analysis.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">AI Recommendations</h4>
                        <div className="space-y-2">
                          {analysis.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-slate-700">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <p className="text-xs text-slate-500 mb-4">
                        * AI analysis based on uploaded documents. Site survey recommended for final quote.
                      </p>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Report
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="mr-2 h-4 w-4" />
                          Book Survey
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Button
                          onClick={generateBoQSpreadsheet}
                          className="w-full bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download BoQ Spreadsheet
                        </Button>
                        <Button
                          onClick={generateAnalysisPDF}
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Download Analysis Report (PDF)
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Choose Drylining?</h2>
          <p className="text-lg text-slate-600 mb-8">
            With over 15 years of experience in the drylining industry, we combine traditional craftsmanship with
            cutting-edge AI technology to deliver accurate estimates and exceptional results.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-slate-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-slate-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
              <div className="text-slate-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-slate-300">Ready to start your drylining project? Contact us for a detailed quote.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Phone className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-slate-300">0800 123 4567</p>
            </div>
            <div>
              <Mail className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-slate-300">info@drylining.co</p>
            </div>
            <div>
              <Home className="h-8 w-8 text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-slate-300">London & South East</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-800 text-slate-300">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="h-6 w-6 text-orange-400" />
            <span className="font-bold text-white">Drylining</span>
          </div>
          <p className="text-sm">
            © 2024 Drylining. All rights reserved. Professional drylining services with AI-powered estimation.
          </p>
        </div>
      </footer>
    </div>
  )
}
