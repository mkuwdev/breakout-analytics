"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

// Easy to edit configuration
const ANNOUNCEMENT_CONFIG = {
  enabled: true, // Set to false to hide the banner
  text: "🚀 Builders: Apply to IOSG Ventures Builder Initiative - $100k investment for early-stage projects",
  buttonText: "Learn More",
  link: "https://x.com/0xKickstarter",
  dismissible: true, // Allow users to dismiss
  localStorageKey: "builder-initiative-banner-dismissed", // Change this to reset dismissals
};

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner should be shown
    if (!ANNOUNCEMENT_CONFIG.enabled) {
      return;
    }

    // Check if user has dismissed it
    if (ANNOUNCEMENT_CONFIG.dismissible) {
      const dismissed = localStorage.getItem(ANNOUNCEMENT_CONFIG.localStorageKey);
      if (dismissed === "true") {
        setIsDismissed(true);
        return;
      }
    }

    // Show banner after a brief delay for smooth animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ANNOUNCEMENT_CONFIG.dismissible) {
      localStorage.setItem(ANNOUNCEMENT_CONFIG.localStorageKey, "true");
      setIsDismissed(true);
    }
  };

  const handleBannerClick = () => {
    window.open(ANNOUNCEMENT_CONFIG.link, "_blank", "noopener,noreferrer");
  };

  if (!ANNOUNCEMENT_CONFIG.enabled || isDismissed) {
    return null;
  }

  return (
    <div
      className={`relative w-full bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-purple-900/30 border-b border-purple-800/50 transition-all duration-300 cursor-pointer hover:from-purple-900/40 hover:via-purple-800/30 hover:to-purple-900/40 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}
      onClick={handleBannerClick}
    >
      <div className="container mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <p className="text-xs sm:text-sm text-gray-200 flex-1 text-center sm:text-left">{ANNOUNCEMENT_CONFIG.text}</p>
          {ANNOUNCEMENT_CONFIG.dismissible && (
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-800/50 flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
