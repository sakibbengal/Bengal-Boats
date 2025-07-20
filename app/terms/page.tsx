import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
          <p className="text-muted-foreground text-center mb-12">Last updated: January 1, 2024</p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  By accessing and using the Bengal Boats & Beyond website and services, you accept and agree to be
                  bound by the terms and provision of this agreement. If you do not agree to abide by the above, please
                  do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Product Information</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We strive to provide accurate product descriptions, images, and pricing information. However, we do
                  not warrant that product descriptions or other content is accurate, complete, reliable, current, or
                  error-free.
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li>All products are subject to availability</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Product images are for illustration purposes only</li>
                  <li>Actual products may vary slightly from images</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Orders and Payment</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  By placing an order, you are making an offer to purchase products subject to these terms and
                  conditions.
                </p>
                <ul className="list-disc pl-6 mt-4">
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Payment must be made at the time of order placement or delivery</li>
                  <li>Currently, we accept Cash on Delivery (COD)</li>
                  <li>Online payment options will be available soon</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Shipping and Delivery</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We aim to process and ship orders within 24-48 hours of confirmation.</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Free shipping on orders above ৳10,000</li>
                  <li>Standard shipping charge: ৳100 for orders below ৳10,000</li>
                  <li>Delivery time: 2-5 business days within Bangladesh</li>
                  <li>Remote areas may require additional delivery time</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Returns and Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We want you to be completely satisfied with your purchase.</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>7-day return policy for unused products in original packaging</li>
                  <li>Customer is responsible for return shipping costs</li>
                  <li>Refunds will be processed within 7-10 business days</li>
                  <li>Custom or modified products cannot be returned</li>
                  <li>Electronic items must be returned with all accessories</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Warranty</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>All products come with manufacturer warranty as specified.</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Warranty period varies by product type and manufacturer</li>
                  <li>Warranty covers manufacturing defects only</li>
                  <li>Damage due to misuse, accidents, or normal wear is not covered</li>
                  <li>Warranty claims must be made within the specified period</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>When you create an account with us, you must provide accurate and complete information.</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>You are responsible for maintaining account security</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                  <li>We reserve the right to terminate accounts that violate our terms</li>
                  <li>One account per person is allowed</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Prohibited Uses</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You may not use our service:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>
                    To violate any international, federal, provincial, or state regulations, rules, laws, or local
                    ordinances
                  </li>
                  <li>
                    To infringe upon or violate our intellectual property rights or the intellectual property rights of
                    others
                  </li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Bengal Boats & Beyond shall not be liable for any indirect, incidental, special, consequential, or
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, or other
                  intangible losses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>10. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We reserve the right to update or change our Terms & Conditions at any time without prior notice. Your
                  continued use of the service after we post any modifications constitutes acceptance of those changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>11. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>If you have any questions about these Terms & Conditions, please contact us:</p>
                <ul className="list-disc pl-6 mt-4">
                  <li>Email: support@bengalboats.com</li>
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
