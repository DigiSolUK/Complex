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
            <a className="text-xl font-bold text-primary hover:text-primary/90">ComplexCare.dev</a>
          </Link>
          <nav className="flex items-center space-x-6">
            <div className="relative group">
              <span className="cursor-pointer px-2 py-1">Product</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 min-w-40 z-10">
                <Link href="/features">
                  <a className="block px-4 py-2 hover:bg-gray-100 rounded-sm">Features</a>
                </Link>
                <Link href="/pricing">
                  <a className="block px-4 py-2 hover:bg-gray-100 rounded-sm">Pricing</a>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <span className="cursor-pointer px-2 py-1">Support</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 min-w-40 z-10">
                <Link href="/documentation">
                  <a className="block px-4 py-2 hover:bg-gray-100 rounded-sm">Documentation</a>
                </Link>
                <Link href="/contact">
                  <a className="block px-4 py-2 hover:bg-gray-100 rounded-sm">Contact Us</a>
                </Link>
              </div>
            </div>
            <div className="relative group">
              <span className="cursor-pointer px-2 py-1">Company</span>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white shadow-lg rounded-md p-2 min-w-40 z-10">
                <Link href="/about">
                  <a className="block px-4 py-2 hover:bg-gray-100 rounded-sm">About Us</a>
                </Link>
                <Link href="/careers">
                  <a className="block px-4 py-2 hover:bg-gray-100 rounded-sm">Careers</a>
                </Link>
              </div>
            </div>
            <Link href="/legal">
              <a className="px-2 py-1">Legal</a>
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
                <li><Link href="/features"><a className="text-gray-600 hover:text-primary text-sm">Features</a></Link></li>
                <li><Link href="/pricing"><a className="text-gray-600 hover:text-primary text-sm">Pricing</a></Link></li>
                <li><Link href="/documentation"><a className="text-gray-600 hover:text-primary text-sm">Documentation</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about"><a className="text-gray-600 hover:text-primary text-sm">About Us</a></Link></li>
                <li><Link href="/careers"><a className="text-gray-600 hover:text-primary text-sm">Careers</a></Link></li>
                <li><Link href="/contact"><a className="text-gray-600 hover:text-primary text-sm">Contact Us</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/legal/terms"><a className="text-gray-600 hover:text-primary text-sm">Terms of Service</a></Link></li>
                <li><Link href="/legal/privacy"><a className="text-gray-600 hover:text-primary text-sm">Privacy Policy</a></Link></li>
                <li><Link href="/legal/cookies"><a className="text-gray-600 hover:text-primary text-sm">Cookie Policy</a></Link></li>
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
