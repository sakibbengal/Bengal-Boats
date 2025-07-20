import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RefundPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Refund Policy</h1>
          <p className="text-muted-foreground text-center mb-12">Last updated: January 1, 2024</p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Return Period</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We offer a <Badge className="bg-green-500">7-day return policy</Badge> from the date of delivery. You
                  have 7 calendar days to return an item from the date you received it.
                </p>
                <p className="mt-4">
                  To be eligible for a return, your item must be unused and in the same condition that you received it.
                  It must also be in the original packaging with all accessories and documentation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Eligible Items</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4 className="font-semibold mb-2 text-green-600">✅ Returnable Items:</h4>
                <ul className="list-disc pl-6 mb-4">
                  <li>RC boats, cars, and accessories in original packaging</li>
                  <li>Batteries and chargers (unused and sealed)</li>
                  <li>DIY kits with all components intact</li>
                  <li>Parts and accessories in original condition</li>
                </ul>

                <h4 className="font-semibold mb-2 text-red-600">❌ Non-Returnable Items:</h4>
                <ul className="list-disc pl-6">
                  <li>Custom or modified products</li>
                  <li>Items damaged by misuse or normal wear</li>
                  <li>Products without original packaging</li>
                  <li>Items used in water (for hygiene reasons)</li>
                  <li>Electronic items with missing accessories</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Return Process</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>To initiate a return, please follow these steps:</p>
                <ol className="list-decimal pl-6 mt-4 space-y-2">
                  <li>
                    Contact our customer service team at <strong>support@bengalboats.com</strong> or{" "}
                    <strong>+880-1X-XXXXXXX</strong>
                  </li>
                  <li>Provide your order number and reason for return</li>
                  <li>Receive return authorization and instructions</li>
                  <li>Package the item securely with all original materials</li>
                  <li>Ship the item to our return address (customer pays shipping)</li>
                  <li>Track your return shipment</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Refund Processing</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>Once we receive your returned item, we will:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Inspect the item within 2-3 business days</li>
                  <li>Send you an email confirmation of receipt</li>
                  <li>Process your refund within 7-10 business days</li>
                  <li>Refund to your original payment method</li>
                </ul>
                <p className="mt-4">
                  <strong>Note:</strong> Since we currently only accept Cash on Delivery, refunds will be processed via
                  bank transfer or mobile banking (bKash/Nagad) as per your preference.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Shipping Costs</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">✅ We Pay Return Shipping:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Defective products</li>
                      <li>• Wrong item sent</li>
                      <li>• Damaged during shipping</li>
                      <li>• Our error</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-red-600 mb-2">❌ Customer Pays Return Shipping:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Change of mind</li>
                      <li>• Ordered wrong item</li>
                      <li>• No longer needed</li>
                      <li>• Personal preference</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Exchanges</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We currently do not offer direct exchanges. If you need a different item:</p>
                <ol className="list-decimal pl-6 mt-4">
                  <li>Return the original item following our return process</li>
                  <li>Place a new order for the desired item</li>
                  <li>We'll process both transactions separately</li>
                </ol>
                <p className="mt-4">This ensures faster processing and better inventory management.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Warranty vs. Returns</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-600 mb-2">Returns (7 days)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Change of mind</li>
                      <li>• Unused products</li>
                      <li>• Original packaging required</li>
                      <li>• Customer pays return shipping</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-600 mb-2">Warranty Claims</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Manufacturing defects</li>
                      <li>• Longer time period</li>
                      <li>• Repair or replacement</li>
                      <li>• We handle shipping</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Damaged or Defective Items</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>If you receive a damaged or defective item:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Contact us immediately (within 24 hours of delivery)</li>
                  <li>Provide photos of the damage or defect</li>
                  <li>Keep all original packaging</li>
                  <li>We'll arrange pickup and replacement at no cost to you</li>
                </ul>
                <p className="mt-4">
                  <strong>Priority handling:</strong> Damaged/defective items receive expedited processing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Partial Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>Partial refunds may be granted for:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Items returned without original packaging (50% restocking fee)</li>
                  <li>Items with minor damage not caused by us</li>
                  <li>Items returned after 7 days but within 14 days (25% restocking fee)</li>
                  <li>Items missing accessories or documentation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Contact for Returns</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>For all return-related inquiries, please contact us:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="font-semibold mb-2">Customer Service</h4>
                    <ul className="space-y-1 text-sm">
                      <li>📧 Email: returns@bengalboats.com</li>
                      <li>📞 Phone: +880-1X-XXXXXXX</li>
                      <li>💬 WhatsApp: +880-1Z-ZZZZZZZ</li>
                      <li>🕒 Hours: 9 AM - 8 PM (Sat-Thu)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Return Address</h4>
                    <ul className="space-y-1 text-sm">
                      <li>Bengal Boats & Beyond</li>
                      <li>Returns Department</li>
                      <li>123 RC Street, Dhanmondi</li>
                      <li>Dhaka 1205, Bangladesh</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong>Important:</strong> Do not send returns without prior authorization. Unauthorized returns may
                  be refused or delayed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
