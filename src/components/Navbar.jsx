// src/components/Navbar.js
'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function Navbar () {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Contents", path: "/contents" },
    { name: "Find Similar", path: "/find-similar" },
    { name: "Answer", path: "/answer" },
  ];

  return (
    <nav className="fixed flex  w-full border-b border-border/40 bg-background z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 mr-2">
            <Image 
              src="/exa-logo.png" 
              alt="Exa AI Logo" 
              width={30} 
              height={30}  
            />
            <span className="font-medium text-lg">Exa Next.js</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-base transition-colors hover:text-foreground/80 ${
                  pathname === item.path ? "text-foreground font-medium" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="https://github.com/yourusername/create-exa-app" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:cursor-pointer" aria-label="GitHub Repository">
              <svg viewBox="0 0 24 24" className="h-6 w-6">
                <path
                  fill="currentColor"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.163 6.839 9.489.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.16 22 16.42 22 12c0-5.523-4.477-10-10-10z"
                ></path>
              </svg>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 hover:cursor-pointer"
            onClick={toggleTheme} 
            aria-label="Toggle Theme"
          >
            <SunIcon className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}