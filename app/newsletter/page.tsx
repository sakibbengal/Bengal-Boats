"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, Gift, Zap, Users, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    interests: [] as string[],
    frequency: "weekly",
  })
  const [isSubscribed, setIsSubscribed] = useState(false)

  const interests = [
    { id: "rc-boats", label: "RC Boats", icon: "🚤" },
    { id: "rc-cars", label: "RC Cars", icon: "🏎️" },
    { id: "accessories", label: "Parts & Accessories", icon: "🔧" },
    { id: "batteries", label: "Batteries & Chargers", icon: "🔋" },
    { id: "diy-kits", label: "DIY & Custom Kits", icon: "🛠️" },
    { id: "reviews", label: "Product Reviews", icon: "⭐" },
    { id: "tutorials", label: "Tutorials & Tips", icon: "📚" },
    { id: "events", label: "Events & Competitions", icon: "🏆" },
  ]

  const benefits = [
    {
      icon: <Gift className="h-8 w-8 text-yellow-600" />,
      title: "Exclusive Offers",
      description: "Get access to subscriber-only discounts and early bird sales",
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "New Product Alerts",
      description: "Be the first to know about new RC products and launches",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Community Updates",
      description: "Stay connected with the RC community and upcoming events",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Expert Tips",
      description: "Receive professional tips and tutorials from RC experts",
    },
  ]

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        interests: prev.interests.filter((id) => id !== interestId),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate subscription
    setTimeout(() => {
      setIsSubscribed(true)
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to the Bengal Boats & Beyond newsletter family!",
      })
    }, 1000)
  }

  if (isSubscribed) {
    return (
      <div className="min-h-screen">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold mb-4">Welcome Aboard! 🎉</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for subscribing to our newsletter. You're now part of the Bengal Boats & Beyond family!
            </p>

            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <span>You'll receive a welcome email within the next few minutes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <span>Your first newsletter will arrive this weekend</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <span>Enjoy exclusive offers and RC community updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => (window.location.href = "/shop")}>
                Start Shopping
              </Button>
              <Button variant="outline" size="lg" onClick={() => (window.location.href = "/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Mail className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Newsletter</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay updated with the latest RC products, exclusive offers, and community news
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Benefits Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Subscribe?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">{benefit.icon}</div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Subscription Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Subscribe Now
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="name">Name (Optional)</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">What interests you?</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select your interests to receive personalized content
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {interests.map((interest) => (
                          <div key={interest.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={interest.id}
                              checked={formData.interests.includes(interest.id)}
                              onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                            />
                            <Label htmlFor={interest.id} className="text-sm flex items-center gap-2">
                              <span>{interest.icon}</span>
                              {interest.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Email Frequency</Label>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="weekly"
                            name="frequency"
                            value="weekly"
                            checked={formData.frequency === "weekly"}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                          />
                          <Label htmlFor="weekly">Weekly (Recommended)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="monthly"
                            name="frequency"
                            value="monthly"
                            checked={formData.frequency === "monthly"}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                          />
                          <Label htmlFor="monthly">Monthly</Label>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Subscribe to Newsletter
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By subscribing, you agree to our{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </a>
                      . You can unsubscribe at any time.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Newsletter Preview */}
            <div>
              <h3 className="text-2xl font-bold mb-6">What You'll Receive</h3>

              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Weekly RC Roundup</CardTitle>
                    <Badge>This Week</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">🚤 New Product Spotlight</h4>
                      <p className="text-sm text-muted-foreground">
                        Speedster Pro RC Boat - Now with improved battery life
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold">💰 Exclusive Offer</h4>
                      <p className="text-sm text-muted-foreground">20% off all RC car accessories - Subscribers only</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">📚 RC Tips & Tricks</h4>
                      <p className="text-sm text-muted-foreground">How to extend your LiPo battery lifespan</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold">🏆 Community News</h4>
                      <p className="text-sm text-muted-foreground">Upcoming RC boat racing championship in Dhaka</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Subscriber Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">2,500+</p>
                      <p className="text-sm text-muted-foreground">Active Subscribers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">4.8/5</p>
                      <p className="text-sm text-muted-foreground">Satisfaction Rating</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">Weekly</p>
                      <p className="text-sm text-muted-foreground">Fresh Content</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">Exclusive</p>
                      <p className="text-sm text-muted-foreground">Subscriber Deals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">What Our Subscribers Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    "The newsletter keeps me updated on all the latest RC products. The exclusive discounts are
                    amazing!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">AR</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Ahmed Rahman</p>
                      <p className="text-xs text-muted-foreground">RC Enthusiast</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    "Great tips and tutorials! I've learned so much about RC maintenance from the newsletter."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold text-sm">FK</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Fatima Khan</p>
                      <p className="text-xs text-muted-foreground">Hobbyist</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    "Perfect frequency - not too much, not too little. Always relevant and interesting content."
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-bold text-sm">MA</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Mohammad Ali</p>
                      <p className="text-xs text-muted-foreground">Professional Racer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
