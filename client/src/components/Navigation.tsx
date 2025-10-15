import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Heart, LayoutDashboard, Plus } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="text-xl font-bold">FundRaiser</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className={`text-sm font-medium transition-colors hover:text-primary ${
                location === '/' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Explore Events
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={`text-sm font-medium transition-colors hover:text-primary ${
                location === '/dashboard' ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                Dashboard
              </a>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/create">
              <Button data-testid="button-create-event">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
