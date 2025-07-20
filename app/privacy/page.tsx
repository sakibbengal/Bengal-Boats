import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          <p className="text-muted-foreground text-center mb-12">Last updated: January 1, 2024</p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, or contact us for support.
                </p>
                <h4 className="font-semibold mt-4 mb-2">Personal Information:</h4>
                <ul className="list-disc pl-6">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>Payment information (for future online payments)</li>
                  <li>Order history and preferences</li>
                  <li>Communication preferences</li>
                </ul>
                <h4 className="font-semibold mt-4 mb-2">Automatically Collected Information:</h4>
                <ul className="list-disc pl-6">
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and account</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send you promotional emails and newsletters (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties except:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>With your explicit consent</li>
                  <li>To trusted service providers who assist in operating our website and business</li>
                  <li>To comply with legal requirements or protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
                <p className="mt-4">
                  All third-party service providers are required to maintain the confidentiality of your information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure servers and databases</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Employee training on data protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We use cookies and similar tracking technologies to enhance your browsing experience.</p>
                <h4 className="font-semibold mt-4 mb-2">Types of Cookies:</h4>
                <ul className="list-disc pl-6">
                  <li>
                    <strong>Essential Cookies:</strong> Required for website functionality
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how visitors use our site
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your preferences and settings
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
                  </li>
                </ul>
                <p className="mt-4">You can control cookie settings through your browser preferences.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your personal information (subject to legal requirements)</li>
                  <li>Object to processing of your information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent for marketing communications</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                  policy, unless a longer retention period is required by law.
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Account information: Until account deletion</li>
                  <li>Order information: 7 years for tax and legal purposes</li>
                  <li>Marketing preferences: Until you unsubscribe</li>
                  <li>Website analytics: 2 years</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Third-Party Links</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy
                  practices or content of these external sites. We encourage you to review the privacy policies of any
                  third-party sites you visit.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal
                  information from children under 13. If we become aware that we have collected personal information
                  from a child under 13, we will take steps to delete such information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Email: privacy@bengalboats.com</li>
                  <li>Phone: +880-1X-XXXXXXX</li>
                  <li>Address: 123 RC Street, Dhanmondi, Dhaka 1205, Bangladesh</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
