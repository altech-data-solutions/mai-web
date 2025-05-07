import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { APP_NAME, NAVIGATION_ITEMS } from "@/lib/constants";
import {
  DivideIcon as LucideIcon,
  Menu,
  X,
  Braces,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface NavItemProps {
  href: string;
  title: string;
  icon: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

const IconComponent = ({ icon }: { icon: string }) => {
  const icons: Record<string, LucideIcon> = {
    home: (props) => <Braces {...props} />,
    "message-square": (props) => <Braces {...props} />,
    bot: (props) => <Braces {...props} />,
    settings: (props) => <Braces {...props} />,
  };

  const LucideIcon = icons[icon] || Braces;
  return <LucideIcon className="h-5 w-5" />;
};

const NavItem = ({
  href,
  title,
  icon,
  isActive,
  isCollapsed,
  onNavigate,
}: NavItemProps) => {
  return (
    <Link
      to={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
        isCollapsed ? "justify-center" : ""
      )}
    >
      <IconComponent icon={icon} />
      {!isCollapsed && <span>{title}</span>}
    </Link>
  );
};

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-sidebar",
        isCollapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <Braces className="h-6 w-6" />
          {!isCollapsed && <span className="font-semibold">{APP_NAME}</span>}
        </Link>
        {!isCollapsed && (
          <Button
            variant="ghost"
            className="ml-auto"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        {isCollapsed && (
          <Button
            variant="ghost"
            className="ml-auto rotate-180"
            onClick={onToggleCollapse}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1">
          {NAVIGATION_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex h-14 items-center border-b px-4">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <Braces className="h-6 w-6" />
            <span className="font-semibold">{APP_NAME}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-3.5rem)] px-2 py-4">
          <nav className="flex flex-col gap-1">
            {NAVIGATION_ITEMS.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                title={item.title}
                isActive={location.pathname === item.href}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
