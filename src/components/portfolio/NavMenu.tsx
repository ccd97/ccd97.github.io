import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
}

interface Props {
  items: NavItem[];
  active: string;
  fixed?: boolean;
  onSelect: (id: string) => void;
}

export function NavMenu({ items, active, fixed, onSelect }: Props) {
  return (
    <nav
      className={cn(
        fixed &&
          "fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-b shadow-sm",
      )}
    >
      <div className="container mx-auto flex items-center justify-center gap-2 py-4 px-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              onSelect(item.id);
            }}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              active === item.id
                ? "text-brand border-b-2 border-[#0E6EB8]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
