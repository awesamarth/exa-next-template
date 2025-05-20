import Image from "next/image";
import Link from "next/link";


export default function Footer() {

    return (
        <footer className="py-8 border-t border-border/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Image
                        src="/exa-logo.png"
                        alt="Exa AI Logo"
                        width={22}
                        height={22}
                    />
                    <span className="text-base text-muted-foreground">
                        © {new Date().getFullYear()} Exa Next.js Starter
                    </span>
                </div>
                <div className="flex gap-8">
                    <Link
                        href="https://docs.exa.ai"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Documentation
                    </Link>
                    <Link
                        href="https://github.com/awesamarth/create-exa-app"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </Link>
                    <Link
                        href="https://exa.ai"
                        className="text-base text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Exa AI
                    </Link>
                </div>
            </div>
        </footer>
    )
}