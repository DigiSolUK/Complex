import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/">
            <span className="text-xl font-bold text-primary hover:text-primary/90 cursor-pointer">ComplexCare.dev</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <div className="relative group">
              <span className="cursor-pointer px-2 py-1">Product</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 min-w-40 z-10">
                <Link href="/features">
                  <span className="block px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">Features</span>
                </Link>
                <Link href="/pricing">
                  <span className="block px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">Pricing</span>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <span className="cursor-pointer px-2 py-1">Support</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 min-w-40 z-10">
                <Link href="/documentation">
                  <span className="block px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">Documentation</span>
                </Link>
                <Link href="/contact">
                  <span className="block px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">Contact Us</span>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <span className="cursor-pointer px-2 py-1">Company</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 min-w-40 z-10">
                <Link href="/about">
                  <span className="block px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">About Us</span>
                </Link>
                <Link href="/careers">
                  <span className="block px-4 py-2 hover:bg-gray-100 rounded-sm cursor-pointer">Careers</span>
                </Link>
              </div>
            </div>
            <Link href="/legal">
              <span className="px-2 py-1 cursor-pointer">Legal</span>
            </Link>
          </nav>
          <div className="flex space-x-2">
            <Link href="/auth">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link href="/auth">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-100 py-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">ComplexCare CRM</h3>
              <p className="text-gray-600 text-sm">
                A comprehensive healthcare management platform designed for UK complex care providers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/features"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Features</span></Link></li>
                <li><Link href="/pricing"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Pricing</span></Link></li>
                <li><Link href="/documentation"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Documentation</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">About Us</span></Link></li>
                <li><Link href="/careers"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Careers</span></Link></li>
                <li><Link href="/contact"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Contact Us</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/legal/terms"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Terms of Service</span></Link></li>
                <li><Link href="/legal/privacy"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Privacy Policy</span></Link></li>
                <li><Link href="/legal/cookies"><span className="text-gray-600 hover:text-primary text-sm cursor-pointer">Cookie Policy</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-5 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">&copy; {new Date().getFullYear()} ComplexCare CRM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
