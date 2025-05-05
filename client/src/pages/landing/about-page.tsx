import { LandingLayout } from "@/components/landing/landing-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Shield, Clock, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            We are dedicated to transforming healthcare delivery through innovative technology that empowers care providers to deliver better, more efficient care.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Our Story
              </div>
              <h2 className="text-3xl font-bold mb-6">Built for Healthcare Providers, By Healthcare Experts</h2>
              <p className="text-gray-600 mb-4">
                ComplexCare CRM was founded in 2019 by a team of healthcare professionals and technology experts who recognized the unique challenges faced by complex care providers in the UK.
              </p>
              <p className="text-gray-600 mb-4">
                After witnessing firsthand the administrative burden, compliance challenges, and fragmented systems that hindered quality care delivery, our founders set out to create a comprehensive solution specifically designed for the UK healthcare market.
              </p>
              <p className="text-gray-600">
                Today, ComplexCare CRM serves hundreds of healthcare organizations across the UK, helping them streamline operations, ensure compliance, and most importantly, improve patient outcomes.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1 rounded-full bg-primary/10 text-primary mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">2019</h3>
                    <p className="text-gray-600">Founded in London with a mission to transform complex care management</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1 rounded-full bg-primary/10 text-primary mr-4">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">2020</h3>
                    <p className="text-gray-600">Launched first version of ComplexCare CRM with 10 pilot organizations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1 rounded-full bg-primary/10 text-primary mr-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">2021</h3>
                    <p className="text-gray-600">Achieved full CQC compliance certification and expanded to 100+ providers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 p-1 rounded-full bg-primary/10 text-primary mr-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Today</h3>
                    <p className="text-gray-600">Serving 500+ healthcare providers and continuously innovating to improve care delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Our Values
            </div>
            <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do at ComplexCare CRM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Patient-Centered</h3>
              <p className="text-gray-600">
                We design every feature with patients' wellbeing as our primary consideration.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">
                We operate with transparency and adhere to the highest ethical standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries to develop new solutions for complex healthcare challenges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We work closely with healthcare providers to ensure our solutions meet real-world needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
              Our Team
            </div>
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our diverse team brings together expertise in healthcare, technology, and business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Dr. Emma Thompson</h3>
              <p className="text-primary mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600">
                Former NHS Clinical Director with 15+ years of experience in healthcare management.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">James Wilson</h3>
              <p className="text-primary mb-3">CTO & Co-Founder</p>
              <p className="text-gray-600">
                Software architect with extensive experience in healthcare IT systems.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-primary mb-3">Chief Product Officer</p>
              <p className="text-gray-600">
                Former care home manager with deep understanding of complex care needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
              <p className="text-primary mb-3">Chief of AI & Innovation</p>
              <p className="text-gray-600">
                AI expert with a focus on healthcare applications and clinical decision support.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Dr. Robert Miller</h3>
              <p className="text-primary mb-3">Clinical Advisor</p>
              <p className="text-gray-600">
                Practicing physician with expertise in geriatric care and health informatics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-1">Amanda Lewis</h3>
              <p className="text-primary mb-3">Customer Success Director</p>
              <p className="text-gray-600">
                Dedicated to ensuring our clients get maximum value from ComplexCare CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Partner with us to transform healthcare delivery and improve patient outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="px-8">Try Demo</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 bg-transparent border-white text-white hover:bg-white hover:text-primary">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
