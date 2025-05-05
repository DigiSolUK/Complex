import { LandingLayout } from "@/components/landing/landing-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Choose the plan that works best for your organization. All plans include our core features with options to scale as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <p className="text-gray-600 mb-4">For small care providers</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">£199</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Up to 10 staff users</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Up to 100 patient records</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Core CRM features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Standard reports</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Email support</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Professional Plan */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Popular
              </div>
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold mb-2">Professional</h3>
                <p className="text-gray-600 mb-4">For medium sized providers</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">£499</span>
                  <span className="text-gray-500 ml-2">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Up to 50 staff users</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Up to 500 patient records</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>All CRM features</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Advanced reports & analytics</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>AI insights (100 queries/month)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>NHS Digital Services (2 integrations)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Email + phone support</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                <p className="text-gray-600 mb-4">For large healthcare organizations</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Unlimited staff users</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Unlimited patient records</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>All CRM features + customization</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Custom reports & dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Unlimited AI insights</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>All NHS Digital Services</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>24/7 priority support</span>
                  </li>
                </ul>
                <Link href="/contact">
                  <Button className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compare Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A detailed comparison of what's included in each plan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4 font-medium">Features</th>
                  <th className="text-center p-4 font-medium">Starter</th>
                  <th className="text-center p-4 font-medium">Professional</th>
                  <th className="text-center p-4 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4 font-medium">Patient Management</td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                  <td className="text-center p-4">Advanced + Custom Fields</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Care Planning</td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                  <td className="text-center p-4">Advanced + Custom Templates</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Appointment Scheduling</td>
                  <td className="text-center p-4">✓</td>
                  <td className="text-center p-4">✓</td>
                  <td className="text-center p-4">✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Document Management</td>
                  <td className="text-center p-4">Basic</td>
                  <td className="text-center p-4">Advanced</td>
                  <td className="text-center p-4">Advanced + Workflow</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Reporting</td>
                  <td className="text-center p-4">Standard Reports</td>
                  <td className="text-center p-4">Custom Reports</td>
                  <td className="text-center p-4">Custom Dashboards</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">AI Capabilities</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4">Limited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">NHS Digital Integration</td>
                  <td className="text-center p-4">—</td>
                  <td className="text-center p-4">2 Services</td>
                  <td className="text-center p-4">All Services</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Support</td>
                  <td className="text-center p-4">Email</td>
                  <td className="text-center p-4">Email + Phone</td>
                  <td className="text-center p-4">24/7 Priority</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Can I upgrade my plan later?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade your plan at any time. Your new features will be available immediately, and we'll prorate your billing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Is there a setup fee?</h3>
                <p className="text-gray-600">
                  No, there are no setup fees for our Starter and Professional plans. Enterprise plans may have implementation fees depending on customization needs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Do you offer training?</h3>
                <p className="text-gray-600">
                  Yes, all plans include basic onboarding. Professional plans include additional training sessions, and Enterprise plans include comprehensive training programs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">How secure is patient data?</h3>
                <p className="text-gray-600">
                  We take security seriously. ComplexCare CRM is fully compliant with UK data protection regulations, including GDPR. We use encryption, regular security audits, and follow NHS Digital security standards.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Can I get a custom plan?</h3>
                <p className="text-gray-600">
                  Yes, our Enterprise plan can be fully customized to your organization's specific needs. Contact our sales team to discuss your requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Experience how ComplexCare CRM can transform your healthcare organization.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="px-8">Try Demo</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
