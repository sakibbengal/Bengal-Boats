"use client"

import type React from "react"

import { useState } from "react"
import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#222831] mb-4">Contact Us</h1>
          <p className="text-xl text-[#393E46] max-w-2xl mx-auto">
            Have questions about our products or need expert advice? We're here to help! Get in touch with our team of
            RC enthusiasts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#222831] text-center">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#00ADB5] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#222831]">Address</p>
                    <p className="text-[#393E46] text-sm">
                      123 RC Hobby Street
                      <br />
                      Dhaka, Bangladesh 1000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#00ADB5] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#222831]">Phone</p>
                    <p className="text-[#393E46] text-sm">+880 1234-567890</p>
                    <p className="text-[#393E46] text-sm">+880 1987-654321</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[#00ADB5] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#222831]">Email</p>
                    <p className="text-[#393E46] text-sm">info@bengalboats.com</p>
                    <p className="text-[#393E46] text-sm">support@bengalboats.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#00ADB5] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#222831]">Business Hours</p>
                    <p className="text-[#393E46] text-sm">
                      Saturday - Thursday: 9:00 AM - 8:00 PM
                      <br />
                      Friday: 2:00 PM - 8:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
