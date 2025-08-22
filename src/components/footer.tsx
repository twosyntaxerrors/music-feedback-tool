"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github, Globe } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-black/50 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-black/0 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-righteous text-white">
                SoundScope
              </span>
            </Link>
            <p className="text-gray-400 max-w-md mb-4">
              Elevate your music with audio analysis. Get detailed insights and recommendations to take your music to the next level.
            </p>
            <div className="flex space-x-4">
              {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a> */}
              <a 
                href="https://x.com/itservnoel" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://www.ervnoel.com" 
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={20} />
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a> */}
            </div>
          </div>
          
          <div>
            <h3 className="font-righteous text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
              {/* <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li> */}
            </ul>
          </div>
          
          <div>
            <h3 className="font-righteous text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Guides</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-righteous text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} SoundScope. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

