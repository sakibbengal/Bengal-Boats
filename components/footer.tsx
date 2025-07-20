"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { useSiteSettings } from "@/contexts/site-settings-context"

export function Footer() {
  const { settings, isClient } = useSiteSettings()

  const siteName = isClient && settings.siteName ? settings.siteName : "Bengal Boats Beyond"

  return (
    <footer className="bg-[#222831] text-[#EEEEEE]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#00ADB5]">{siteName}</h3>
            <p className="text-sm text-[#EEEEEE]/80">
              {settings.siteDescription ||
                "Your premier destination for RC boats, cars, and accessories. Quality products for RC enthusiasts."}
            </p>
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {settings.socialMedia.facebook && (
                <Link
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
              )}
              {settings.socialMedia.instagram && (
                <Link
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              )}
              {settings.socialMedia.youtube && (
                <Link
                  href={settings.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#00ADB5]">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-[#EEEEEE]/80 hover:text-[#00ADB5] transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-[#EEEEEE]/80 hover:text-[#00ADB5] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[#EEEEEE]/80 hover:text-[#00ADB5] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#00ADB5]">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-sm text-[#EEEEEE]/80 hover:text-[#00ADB5] transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-[#EEEEEE]/80 hover:text-[#00ADB5] transition-colors"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-[#EEEEEE]/80 hover:text-[#00ADB5] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-[#00ADB5]">Contact Info</h4>
            <div className="space-y-3">
              {settings.contactEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-[#00ADB5]" />
                  <span className="text-sm text-[#EEEEEE]/80">{settings.contactEmail}</span>
                </div>
              )}
              {settings.contactPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-[#00ADB5]" />
                  <span className="text-sm text-[#EEEEEE]/80">{settings.contactPhone}</span>
                </div>
              )}
              {settings.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-[#00ADB5] mt-0.5" />
                  <span className="text-sm text-[#EEEEEE]/80">{settings.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#393E46] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-[#EEEEEE]/60">
              © {new Date().getFullYear()} {siteName}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-sm text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-[#EEEEEE]/60 hover:text-[#00ADB5] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
