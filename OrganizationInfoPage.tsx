import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrganizationInfoPageProps {
  onSubmit: (name: string, contactName: string, contactRole: string, contactEmail: string) => void
  onBack: () => void
}

export default function OrganizationInfoPage({ onSubmit, onBack }: OrganizationInfoPageProps) {
  const [name, setName] = React.useState("")
  const [contactName, setContactName] = React.useState("")
  const [contactRole, setContactRole] = React.useState("")
  const [contactEmail, setContactEmail] = React.useState("")

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("organizationInfo") || "{}")
    setName(savedData.name || "")
    setContactName(savedData.contactName || "")
    setContactRole(savedData.contactRole || "")
    setContactEmail(savedData.contactEmail || "")
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { name, contactName, contactRole, contactEmail }
    localStorage.setItem("organizationInfo", JSON.stringify(data))
    onSubmit(name, contactName, contactRole, contactEmail)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/95 shadow-lg rounded-xl overflow-hidden backdrop-blur-sm">
      <CardHeader className="bg-[#152e65] text-white">
        <CardTitle className="text-xl sm:text-2xl">Organization Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="mt-4 p-4 sm:p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                placeholder="Enter your organization's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-name">Contact Name</Label>
              <Input
                id="contact-name"
                placeholder="Enter contact person's name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-role">Contact Role</Label>
              <Input
                id="contact-role"
                placeholder="Enter contact person's role"
                value={contactRole}
                onChange={(e) => setContactRole(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                placeholder="Enter email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <Button type="button" onClick={onBack} className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300">
            Back
          </Button>
          <Button type="submit" className="flex-1 bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white">
            Continue to Quiz
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
