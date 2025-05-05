import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LandingLayout } from "@/components/landing/landing-layout";
import { FeatureCard } from "@/components/landing/feature-card";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { StatCard } from "@/components/landing/stat-card";
import { Building, Shield, Clock, Users } from "lucide-react";

export default function HomePage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                UK Healthcare CRM Solution
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">ComplexCare CRM</h1>
              <p className="text-lg text-gray-600 mb-8">
                A comprehensive healthcare management platform designed specifically for UK complex care providers. 
                Streamline patient care, ensure compliance, and improve outcomes.
              </p>
              <div className="flex space-x-4">
                <Link href="/dashboard">
                  <Button className="px-6" size="lg">Explore Demo</Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline" className="px-6" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="space-y-6">
                  <FeatureCard
                    icon={<Building className="h-5 w-5" />}
                    title="Multi-Tenant Architecture"
                    description="Secure data isolation for healthcare organizations"
                  />
                  <FeatureCard
                    icon={<Shield className="h-5 w-5" />}
                    title="CQC Compliance Ready"
                    description="Built to meet UK healthcare regulations"
                  />
                  <FeatureCard
                    icon={<Clock className="h-5 w-5" />}
                    title="Real-time Updates"
                    description="Instant access to critical patient information"
                  />
                  <FeatureCard
                    icon={<Users className="h-5 w-5" />}
                    title="Team Collaboration"
                    description="Seamless communication between care providers"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Comprehensive Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ComplexCare CRM provides everything you need to manage complex care services efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Patient Management</h3>
              <p className="text-gray-600">
                Comprehensive patient records, care plans, and health monitoring in one place.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Care Planning</h3>
              <p className="text-gray-600">
                Create, manage and track personalized care plans for each patient.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compliance Management</h3>
              <p className="text-gray-600">
                Stay compliant with healthcare regulations, policies, and training requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Document Management</h3>
              <p className="text-gray-600">
                Securely store, organize, and share important healthcare documents.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Medication Management</h3>
              <p className="text-gray-600">
                Track prescriptions, dosages, schedules, and medication adherence.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Reporting</h3>
              <p className="text-gray-600">
                Gain insights with powerful analytics and customizable reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Trusted by Healthcare Providers</h2>
            <p className="text-lg text-gray-600">ComplexCare CRM is making a difference in healthcare delivery across the UK.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value="500+" label="Care Providers" />
            <StatCard value="25,000+" label="Patients Managed" />
            <StatCard value="98%" label="Compliance Rate" />
            <StatCard value="30%" label="Time Saved" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="ComplexCare CRM has transformed how we manage our complex care services. The compliance features alone have saved us countless hours."
              author="Sarah Johnson"
              position="Care Home Manager, London"
            />
            <TestimonialCard 
              quote="The patient management system is intuitive and comprehensive. It's helped us improve care coordination and patient outcomes."
              author="Dr. James Wilson"
              position="Clinical Director, Manchester"
            />
            <TestimonialCard 
              quote="The reporting capabilities have given us insights we never had before. We can now make data-driven decisions about our care delivery."
              author="Emma Thompson"
              position="Operations Director, Birmingham"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Care Delivery?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Experience how ComplexCare CRM can help you provide better care, ensure compliance, and improve operational efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="px-8">Explore Demo</Button>
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
