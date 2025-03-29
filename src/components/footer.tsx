"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-950/10 to-gray-900/0 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                SoundScope AI
              </span>
            </Link>
            <p className="text-gray-400 max-w-md mb-4">
              Elevate your music with AI-powered analysis. Get detailed insights and recommendations to take your production to the next level.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-blue-400 transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Integrations</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Guides</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center md:flex md:justify-between md:text-left">
          <p className="text-gray-500 mb-4 md:mb-0">
            © {currentYear} SoundScope AI. All rights reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-6">
            <Link href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-500 hover:text-blue-400 transition-colors text-sm">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

