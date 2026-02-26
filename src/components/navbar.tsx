"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Music, Newspaper, Mail, Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Newspaper },
  { href: "/subscribe", label: "Subscribe", icon: Mail },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = !!session?.user?.role;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">
                HomelessGuyNABOX
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Newsletter
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={active ? "text-primary" : "text-muted-foreground hover:text-foreground"}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}

            {/* Stream link */}
            <a
              href="https://homelessguynabox.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm" className="text-neon hover:text-neon/80">
                <Music className="h-4 w-4 mr-1.5" />
                Listen Live
              </Button>
            </a>

            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Shield className="h-4 w-4 mr-1.5" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    className={`w-full justify-start ${active ? "text-primary" : ""}`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
            <a
              href="https://homelessguynabox.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="w-full justify-start text-neon">
                <Music className="h-4 w-4 mr-2" />
                Listen Live
              </Button>
            </a>
            {isAdmin && (
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-primary">
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
