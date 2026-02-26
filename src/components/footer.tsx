import { Music, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">HomelessGuyNABOX</span>
            <span className="text-xs text-muted-foreground">Newsletter</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://homelessguynabox.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Stream Music
            </a>
            <Link href="/subscribe" className="hover:text-primary transition-colors">
              Subscribe
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Archive
            </Link>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-primary fill-primary" />
            <span>for the community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
