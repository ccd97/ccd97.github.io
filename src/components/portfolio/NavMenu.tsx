import { useState } from "react";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/portfolio/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface NavItem {
  id: string;
  label: string;
}

interface Props {
  name: string;
  items: NavItem[];
  active: string;
  scrolled?: boolean;
  onSelect: (id: string) => void;
}

export function NavMenu({ name, items, active, scrolled, onSelect }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (id: string) => {
    setMobileOpen(false);
    onSelect(id);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 transition-all duration-200",
        scrolled
          ? "bg-background/85 backdrop-blur border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex items-center justify-between gap-2 py-3">
        <span className="font-serif text-xl text-foreground">{name}</span>
        <div className="flex items-center gap-1">
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active === item.id
                    ? "text-[hsl(var(--accent))]"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-foreground hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-serif">{name}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelect(item.id);
                    }}
                    className={cn(
                      "px-3 py-3 text-base font-medium rounded-md transition-colors",
                      active === item.id
                        ? "text-[hsl(var(--accent))] bg-accent-soft/50"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
