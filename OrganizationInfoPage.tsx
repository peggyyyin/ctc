import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface OrganizationInfoPageProps {
  onSubmit: (name: string, contact: string) => void
}

export default function OrganizationInfoPage({ onSubmit }: OrganizationInfoPageProps) {
  const [name, setName] = React.useState("")
  const [contact, setContact] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, contact)
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
              <Label htmlFor="org-contact">Contact Information</Label>
              <Input
                id="org-contact"
                placeholder="Enter contact information (email or phone)"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Back
          </Button>
          <Button type="submit" className="bg-[#40c7cc] hover:bg-[#40c7cc]/90 text-white">
            Continue to Quiz
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

