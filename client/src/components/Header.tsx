import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

interface HeaderProps {
  settings?: Record<string, string>;
}

export default function Header({ settings }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: "Ana Sayfa", path: "/" },
    { label: "Denizcilik", path: "/blog" },
    { label: "Karavan", path: "/karavan" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary font-['Pacifico']">
              {settings?.site_title || "Viya Kaptan"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Social Links & Admin */}
          <div className="hidden md:flex items-center gap-4">
            {settings?.social_instagram && (
              <a 
                href={settings.social_instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <i className="ri-instagram-line text-xl"></i>
              </a>
            )}
            {settings?.social_youtube && (
              <a 
                href={settings.social_youtube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                <i className="ri-youtube-line text-xl"></i>
              </a>
            )}
            {user?.role === 'admin' && (
              <Link href="/admin">
                <button className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary/90 transition-colors">
                  Admin
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            <i className={`text-2xl ${isMenuOpen ? "ri-close-line" : "ri-menu-line"}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                  <span className="text-sm font-medium text-primary">Admin Panel</span>
                </Link>
              )}
            </nav>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t">
              {settings?.social_instagram && (
                <a 
                  href={settings.social_instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <i className="ri-instagram-line text-xl"></i>
                </a>
              )}
              {settings?.social_youtube && (
                <a 
                  href={settings.social_youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <i className="ri-youtube-line text-xl"></i>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
