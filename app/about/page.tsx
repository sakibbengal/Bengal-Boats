"use client"

import { PageLayout } from "@/components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SailboatIcon as Boat, Car, Wrench, Users, Target, Heart, Award, ShoppingBag, Phone } from "lucide-react"
import Link from "next/link"

export default function About() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#222831] mb-6">About Bengal Boats Beyond</h1>
          <p className="text-xl text-[#393E46] max-w-3xl mx-auto leading-relaxed">
            Your premier destination for remote control boats, cars, and accessories. We're passionate about bringing
            the excitement of RC hobbies to enthusiasts across Bangladesh and beyond.
          </p>
        </div>

        {/* Company Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-[#222831] mb-6">Our Story</h2>
            <div className="space-y-4 text-[#393E46]">
              <p>
                Founded with a passion for remote control vehicles, Bengal Boats Beyond started as a small hobby shop
                with a big dream: to make high-quality RC products accessible to everyone in Bangladesh.
              </p>
              <p>
                What began as a personal interest in RC boats quickly evolved into a comprehensive business serving the
                entire RC community. We recognized the need for reliable, affordable, and innovative RC products in our
                local market.
              </p>
              <p>
                Today, we're proud to be one of the leading RC retailers in the region, offering everything from
                beginner-friendly models to professional-grade racing machines.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#00ADB5]/10 to-[#222831]/10 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-6">
                <Boat className="h-16 w-16 text-[#00ADB5]" />
                <Car className="h-16 w-16 text-[#00ADB5]" />
                <Wrench className="h-16 w-16 text-[#00ADB5]" />
              </div>
              <h3 className="text-2xl font-bold text-[#222831] mb-2">Since 2020</h3>
              <p className="text-[#393E46]">Serving the RC community with passion and expertise</p>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#222831] text-center mb-12">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#00ADB5]/10 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-[#00ADB5]" />
                </div>
                <CardTitle className="text-[#222831]">Quality First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#393E46]">
                  We carefully select every product to ensure it meets our high standards for performance, durability,
                  and value.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#00ADB5]/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-[#00ADB5]" />
                </div>
                <CardTitle className="text-[#222831]">Customer Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#393E46]">
                  Your satisfaction is our priority. We provide expert advice, reliable support, and exceptional service
                  every step of the way.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-[#00ADB5]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-[#00ADB5]" />
                </div>
                <CardTitle className="text-[#222831]">Community Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#393E46]">
                  We're more than a store – we're part of the RC community, supporting enthusiasts and fostering the
                  growth of the hobby.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Range */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#222831] text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Boat className="h-12 w-12 text-[#00ADB5] mx-auto mb-4" />
                <h3 className="font-semibold text-[#222831] mb-2">RC Boats</h3>
                <p className="text-sm text-[#393E46]">
                  High-speed racing boats, scale models, and beginner-friendly options
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Car className="h-12 w-12 text-[#00ADB5] mx-auto mb-4" />
                <h3 className="font-semibold text-[#222831] mb-2">RC Cars</h3>
                <p className="text-sm text-[#393E46]">
                  On-road racers, off-road trucks, and drift cars for all skill levels
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Wrench className="h-12 w-12 text-[#00ADB5] mx-auto mb-4" />
                <h3 className="font-semibold text-[#222831] mb-2">Parts & Accessories</h3>
                <p className="text-sm text-[#393E46]">Replacement parts, upgrades, and maintenance tools</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-[#00ADB5] mx-auto mb-4" />
                <h3 className="font-semibold text-[#222831] mb-2">Expert Support</h3>
                <p className="text-sm text-[#393E46]">Technical guidance, repair services, and hobby advice</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#00ADB5] to-[#222831] rounded-lg p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your RC Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our extensive collection of RC vehicles and accessories, or get in touch with our expert team for
            personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[#00ADB5] hover:bg-gray-100">
              <Link href="/shop">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Products
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#00ADB5] bg-transparent"
            >
              <Link href="/contact">
                <Phone className="h-5 w-5 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
