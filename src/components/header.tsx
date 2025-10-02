"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Headphones } from "lucide-react"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavItem {
  title: string;
  href?: string;
  scrollTo?: string;
  children?: {
    title: string;
    href: string;
    description?: string;
  }[];
}

const navItems: NavItem[] = [
  {
    title: "Upload",
    scrollTo: "hero",
  },
  {
    title: "Features",
    scrollTo: "features",
  },
  /* {
    title: "Testimonials",
    scrollTo: "testimonials",
  },
  {
    title: "Pricing",
    scrollTo: "pricing",
  }, */
  {
    title: "FAQ",
    scrollTo: "faq",
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scroll visibility
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Hide when scrolling down
      } else {
        setIsVisible(true); // Show when scrolling up
      }
      
      setLastScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="flex items-center space-x-2"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = '/';
              }}
            >
              <span className="text-2xl font-righteous text-white flex items-center gap-2">
                <Headphones className="w-6 h-6" />
                SoundScope
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger className="text-gray-100 hover:text-white">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.children.map((child) => (
                              <li key={child.title}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={child.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {child.title}
                                    </div>
                                    {child.description && (
                                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                        {child.description}
                                      </p>
                                    )}
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <button
                        onClick={() => item.scrollTo && scrollToSection(item.scrollTo)}
                        className="inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                      >
                        {item.title}
                      </button>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <SignedIn>
              <Link href="/history" className="text-gray-100 hover:text-white text-sm">History</Link>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10">
                  Sign in / Register
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonOuterIdentifier: "text-white",
                    avatarBox: "w-8 h-8",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden text-gray-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-md"
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.title}>
                  <button
                    onClick={() => item.scrollTo && scrollToSection(item.scrollTo)}
                    className="w-full text-left px-4 py-2 text-gray-100 hover:text-blue-400 transition-colors"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
              <SignedIn>
                <li>
                  <Link href="/history" className="w-full block px-4 py-2 text-gray-100 hover:text-blue-400 transition-colors">
                    History
                  </Link>
                </li>
              </SignedIn>
            </ul>
            <div className="mt-6 border-t border-white/10 pt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10">
                    Sign in / Register
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm text-white/80">Account</span>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonOuterIdentifier: "text-white",
                        avatarBox: "w-9 h-9",
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
} 
