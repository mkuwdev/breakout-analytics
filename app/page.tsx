"use client";

import { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ExternalLink,
  Github,
  Twitter,
  Users,
  MapPin,
  Heart,
  MessageCircle,
  Search,
  Filter,
  Presentation,
  Video,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart3,
  TableIcon,
  Sparkles,
  Shuffle,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
// import hackathonData from "@/data/hackathon-data.json";
import Image from "next/image";
import Analytics from "./analytics";

// TypeScript interfaces
interface TeamMember {
  id: number;
  username: string;
  aboutYou: string;
  displayName: string;
  avatarUrl: string;
  isEditor: boolean;
}

interface ProjectImage {
  id: number;
  name: string;
  url: string;
  mimetype: string;
  size: number;
  uid: string;
}

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  repoLink: string | null;
  country: string;
  presentationLink: string | null;
  technicalDemoLink: string | null;
  twitterHandle: string | null;
  additionalInfo: string | null;
  ownerId: number;
  submittedAt: string;
  hackathonId: number;
  isUniversityProject: boolean;
  universityName: string | null;
  likes: number;
  comments: number;
  image: ProjectImage;
  tracks: string[];
  teamMembers: TeamMember[];
  prize: any;
  randomOrder: string;
}

interface HackathonData {
  projects: Project[];
  hackathon: any;
  offset: number;
  hasMore: boolean;
  seed: any;
}

const trackColors = {
  AI: "bg-purple-500/10 text-purple-400 border-purple-500/50",
  DeFi: "bg-green-500/10 text-green-400 border-green-500/50",
  Gaming: "bg-blue-500/10 text-blue-400 border-blue-500/50",
  Consumer: "bg-orange-500/10 text-orange-400 border-orange-500/50",
  Infrastructure: "bg-red-500/10 text-red-400 border-red-500/50",
  Stablecoins: "bg-yellow-500/10 text-yellow-400 border-yellow-500/50",
};

// Helper function to map track names
const mapTrackName = (track: string) => {
  if (track === "Consumer Apps") return "Consumer";
  return track;
};

// Helper function to generate avatar background gradient
const getAvatarGradient = (name: string) => {
  const colors = [
    "from-purple-600 to-blue-600",
    "from-green-600 to-teal-600",
    "from-red-600 to-pink-600",
    "from-yellow-600 to-orange-600",
    "from-indigo-600 to-purple-600",
    "from-blue-600 to-cyan-600",
  ];

  // Generate a consistent index based on the name
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

// Helper function to create loading skeleton
const LoadingSkeleton = () => (
  <div className="container mx-auto px-6 py-4">
    <div className="space-y-4">
      {/* Filter skeleton */}
      <div className="flex gap-3 items-center">
        <Skeleton className="h-9 w-24 bg-gray-900" />
        <Skeleton className="h-9 flex-1 bg-gray-900" />
        <Skeleton className="h-9 w-[180px] bg-gray-900" />
      </div>

      {/* Table skeleton */}
      <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
        {/* Results count skeleton */}
        <div className="px-4 py-3 border-b border-gray-800">
          <Skeleton className="h-4 w-64 bg-gray-900" />
        </div>

        {/* Table structure */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-950">
                <th className="text-left px-6 py-3 w-[250px]">
                  <Skeleton className="h-4 w-16 bg-gray-900" />
                </th>
                <th className="text-left px-6 py-3 w-[400px]">
                  <Skeleton className="h-4 w-20 bg-gray-900" />
                </th>
                <th className="text-left px-6 py-3 w-[180px]">
                  <Skeleton className="h-4 w-16 bg-gray-900" />
                </th>
                <th className="text-left px-6 py-3 w-[120px]">
                  <Skeleton className="h-4 w-12 bg-gray-900" />
                </th>
                <th className="text-left px-6 py-3 w-[120px]">
                  <Skeleton className="h-4 w-16 bg-gray-900" />
                </th>
                <th className="text-center px-6 py-3 w-[120px]">
                  <Skeleton className="h-4 w-20 bg-gray-900 mx-auto" />
                </th>
                <th className="text-center px-6 py-3 w-[140px]">
                  <Skeleton className="h-4 w-12 bg-gray-900 mx-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className={`border-b border-gray-800 ${i % 2 === 0 ? "bg-gray-950/50" : ""}`}>
                  <td className="px-6 py-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-md bg-gray-900" />
                      <Skeleton className="h-4 w-32 bg-gray-900" />
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <Skeleton className="h-4 w-full max-w-[350px] bg-gray-900" />
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-16 rounded bg-gray-900" />
                      <Skeleton className="h-5 w-16 rounded bg-gray-900" />
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex -space-x-1">
                      <Skeleton className="h-6 w-6 rounded-full bg-gray-900" />
                      <Skeleton className="h-6 w-6 rounded-full bg-gray-900" />
                      <Skeleton className="h-6 w-6 rounded-full bg-gray-900" />
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <Skeleton className="h-4 w-20 bg-gray-900" />
                  </td>
                  <td className="px-6 py-2 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Skeleton className="h-4 w-8 bg-gray-900" />
                      <Skeleton className="h-4 w-8 bg-gray-900" />
                    </div>
                  </td>
                  <td className="px-6 py-2">
                    <div className="flex items-center justify-start gap-1">
                      <Skeleton className="h-6 w-6 rounded bg-gray-900" />
                      <Skeleton className="h-6 w-6 rounded bg-gray-900" />
                      <Skeleton className="h-6 w-6 rounded bg-gray-900" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

// Project Spotlight Component
interface ProjectSpotlightProps {
  projects: Project[];
  isOpen: boolean;
  onClose: () => void;
}

const ProjectSpotlight = ({ projects, isOpen, onClose }: ProjectSpotlightProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset to a random project when opened
  useEffect(() => {
    if (isOpen && projects.length > 0) {
      setCurrentIndex(Math.floor(Math.random() * projects.length));
    }
  }, [isOpen, projects.length]);

  const currentProject = projects[currentIndex];

  const handleNext = () => {
    setShowConfetti(true);
    const newIndex = Math.floor(Math.random() * projects.length);
    setCurrentIndex(newIndex);

    // Reset confetti after animation
    setTimeout(() => setShowConfetti(false), 1000);
  };

  if (!currentProject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] sm:w-full bg-gray-950 border-gray-800 text-gray-100 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Confetti Animation */}
        <AnimatePresence>
          {showConfetti && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-50">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-br from-purple-400 to-blue-400"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: -10,
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    x: (Math.random() - 0.5) * 200,
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentProject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6"
          >
            {/* Header with project logo and name */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
              <motion.div
                className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 mx-auto sm:mx-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {currentProject.image?.url ? (
                  <Image src={currentProject.image.url} alt={`${currentProject.name} logo`} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold text-white">{currentProject.name?.charAt(0)?.toUpperCase() || "?"}</span>
                  </div>
                )}
              </motion.div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{currentProject.name}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {currentProject.country}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-400" />
                    {currentProject.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-blue-400" />
                    {currentProject.comments}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracks */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentProject.tracks.map((track) => (
                <Badge key={track} variant="outline" className={`${trackColors[track as keyof typeof trackColors] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                  {track}
                </Badge>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">About</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{currentProject.description}</p>
            </div>

            {/* Team Members */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Team ({currentProject.teamMembers.length} members)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                {currentProject.teamMembers.map((member, idx) => (
                  <motion.a
                    key={idx}
                    href={`https://arena.colosseum.org/profiles/${member.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                      {member.avatarUrl && member.avatarUrl.trim() !== "" && <AvatarImage src={member.avatarUrl} alt={member.displayName} />}
                      <AvatarFallback className={`bg-gradient-to-r ${getAvatarGradient(member.displayName)} text-white text-xs font-semibold`}>
                        {member.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200 truncate">{member.displayName}</p>
                      <p className="text-[10px] text-gray-500 truncate">@{member.username}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                {currentProject.repoLink && (
                  <a href={currentProject.repoLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <Button size="sm" variant="outline" className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-xs h-8 px-2 sm:px-3">
                      <Github className="h-4 w-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">GitHub</span>
                    </Button>
                  </a>
                )}
                {currentProject.presentationLink && (
                  <a href={currentProject.presentationLink} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <Button size="sm" variant="outline" className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-xs h-8 px-2 sm:px-3">
                      <Presentation className="h-4 w-4 sm:mr-1.5" />
                      <span className="hidden sm:inline">Demo</span>
                    </Button>
                  </a>
                )}
                <a href={`https://arena.colosseum.org/projects/explore/${currentProject.slug}`} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                  <Button size="sm" variant="outline" className="bg-gray-900 border-gray-800 hover:bg-gray-800 text-xs h-8 px-2 sm:px-3">
                    <ExternalLink className="h-4 w-4 sm:mr-1.5" />
                    <span className="hidden sm:inline">View</span>
                    <span className="sm:hidden">View</span>
                  </Button>
                </a>
              </div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto text-sm" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Next Random Project
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default function SolanaHackathonDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("random");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [teamSizeRange, setTeamSizeRange] = useState([1, 10]);
  const [likesRange, setLikesRange] = useState([0, 100]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hackathonData, setHackathonData] = useState<HackathonData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageInput, setPageInput] = useState("1");
  const [showUniversityOnly, setShowUniversityOnly] = useState(false);
  const [hasLinks, setHasLinks] = useState<string>("all"); // all, with-links, without-links
  const [activeTab, setActiveTab] = useState("projects");
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [shuffledProjects, setShuffledProjects] = useState<Project[]>([]);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to explicitly shuffle projects
  const handleShuffle = () => {
    if (mappedProjects.length > 0) {
      setShuffledProjects(shuffleArray(mappedProjects));
      setCurrentPage(1);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setHackathonData(data);

        // Update the initial ranges based on fetched data
        if (data.projects.length > 0) {
          const maxTeam = Math.max(...data.projects.map((p: Project) => p.teamMembers.length));
          const maxLike = Math.max(...data.projects.map((p: Project) => p.likes));
          setTeamSizeRange([1, maxTeam]);
          setLikesRange([0, maxLike]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sync page input with current page
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Map tracks for consistency
  const mappedProjects = useMemo(() => {
    if (!hackathonData) return [];
    return hackathonData.projects.map((project) => ({
      ...project,
      tracks: project.tracks.map(mapTrackName),
    }));
  }, [hackathonData]);

  // Initialize shuffled projects when mapped projects are ready
  useEffect(() => {
    if (mappedProjects.length > 0 && shuffledProjects.length === 0) {
      setShuffledProjects(shuffleArray(mappedProjects));
    }
  }, [mappedProjects, shuffledProjects.length]);

  const allTracks = Array.from(new Set(mappedProjects.flatMap((p) => p.tracks)));
  const allCountries = Array.from(new Set(mappedProjects.map((p) => p.country)));
  const maxTeamSize = Math.max(...mappedProjects.map((p) => p.teamMembers.length), 10);
  const maxLikes = Math.max(...mappedProjects.map((p) => p.likes), 100);

  const filteredAndSortedProjects = useMemo(() => {
    // Use shuffled projects for random sort, otherwise use original mapped projects
    const sourceProjects = sortBy === "random" ? shuffledProjects : mappedProjects;

    const filtered = sourceProjects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTrack = selectedTracks.length === 0 || project.tracks.some((track) => selectedTracks.includes(track));
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(project.country);
      const matchesTeamSize = project.teamMembers.length >= teamSizeRange[0] && project.teamMembers.length <= teamSizeRange[1];
      const matchesLikes = project.likes >= likesRange[0] && project.likes <= likesRange[1];
      const matchesUniversity = !showUniversityOnly || project.isUniversityProject;

      let matchesLinks = true;
      if (hasLinks === "with-links") {
        matchesLinks = !!(project.repoLink || project.presentationLink || project.technicalDemoLink);
      } else if (hasLinks === "without-links") {
        matchesLinks = !(project.repoLink || project.presentationLink || project.technicalDemoLink);
      }

      return matchesSearch && matchesTrack && matchesCountry && matchesTeamSize && matchesLikes && matchesUniversity && matchesLinks;
    });

    // For random sort, keep the order from shuffledProjects (no additional sorting needed)
    if (sortBy === "random") {
      return filtered;
    }

    // Apply sorting for other sort options
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "likes":
          return b.likes - a.likes;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [searchTerm, selectedTracks, selectedCountries, sortBy, mappedProjects, shuffledProjects, teamSizeRange, likesRange, showUniversityOnly, hasLinks]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredAndSortedProjects.slice(startIndex, endIndex);

  // Handle page input change
  const handlePageInputChange = (value: string) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setPageInput(value);
    }
  };

  // Handle page input submit
  const handlePageInputSubmit = () => {
    const pageNumber = parseInt(pageInput);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      // Reset to current page if invalid
      setPageInput(currentPage.toString());
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/colosseum.jpg" alt="Colosseum" width={40} height={40} className="rounded-lg" />
              <h1 className="text-2xl font-bold text-white">Colosseum Breakout Hackathon</h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/figo_saleh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Made by</span>
                <span className="hidden sm:inline font-medium">Figo</span>
              </a>
              <Avatar className="h-8 w-8 border border-gray-700">
                <AvatarImage src="/figo.jpg" alt="Figo" />
                <AvatarFallback className="bg-gray-800 text-gray-300 text-xs font-semibold">F</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Error State */}
      {error && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400">Error loading projects: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-2 bg-red-900 hover:bg-red-800 text-white">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && !error && hackathonData && (
        <>
          {/* Project Spotlight Modal */}
          <ProjectSpotlight projects={filteredAndSortedProjects} isOpen={showSpotlight} onClose={() => setShowSpotlight(false)} />

          {/* Search and Filters */}
          <div className="container mx-auto px-6 py-4">
            <div className="flex gap-3 items-center">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-9 bg-black border-gray-800 text-gray-100 hover:bg-gray-900 hover:border-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {(selectedTracks.length > 0 ||
                      selectedCountries.length > 0 ||
                      teamSizeRange[0] > 1 ||
                      teamSizeRange[1] < maxTeamSize ||
                      likesRange[0] > 0 ||
                      likesRange[1] < maxLikes ||
                      showUniversityOnly ||
                      hasLinks !== "all") && (
                      <Badge className="ml-2 bg-purple-500/20 text-purple-400 border-purple-500/50">
                        {selectedTracks.length +
                          selectedCountries.length +
                          (teamSizeRange[0] > 1 || teamSizeRange[1] < maxTeamSize ? 1 : 0) +
                          (likesRange[0] > 0 || likesRange[1] < maxLikes ? 1 : 0) +
                          (showUniversityOnly ? 1 : 0) +
                          (hasLinks !== "all" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[350px] bg-black border-gray-800 overflow-hidden flex flex-col">
                  <SheetHeader>
                    <SheetTitle className="text-white">Filter Projects</SheetTitle>
                    <SheetDescription className="text-gray-400">Refine your search with multiple criteria</SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6 overflow-y-auto flex-1 pr-4 scrollbar-hide">
                    {/* Tracks Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Tracks</h3>
                      <div className="space-y-2">
                        {allTracks.map((track) => (
                          <label key={track} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-900 p-2 rounded">
                            <Checkbox
                              checked={selectedTracks.includes(track)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTracks([...selectedTracks, track]);
                                } else {
                                  setSelectedTracks(selectedTracks.filter((t) => t !== track));
                                }
                              }}
                              className="border-gray-700"
                            />
                            <span className="text-sm text-gray-300">{track}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Countries Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Countries</h3>
                      <Command className="bg-gray-950 border border-gray-800 rounded-md">
                        <CommandInput placeholder="Search countries..." className="border-0 bg-transparent text-gray-100 placeholder-gray-500" />
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandEmpty className="text-gray-500 text-sm py-2 text-center">No country found.</CommandEmpty>
                          <CommandGroup>
                            {allCountries.map((country) => (
                              <CommandItem
                                key={country}
                                onSelect={() => {
                                  setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]));
                                }}
                                className="cursor-pointer text-gray-300 hover:bg-gray-900 hover:text-gray-100"
                              >
                                <Checkbox checked={selectedCountries.includes(country)} className="mr-2 border-gray-700" />
                                {country}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>

                    {/* Team Size Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Team Size</h3>
                      <div className="px-2">
                        <Slider value={teamSizeRange} onValueChange={setTeamSizeRange} max={maxTeamSize} min={1} step={1} className="w-full" />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">{teamSizeRange[0]} members</span>
                          <span className="text-xs text-gray-500">{teamSizeRange[1]} members</span>
                        </div>
                      </div>
                    </div>

                    {/* Likes Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Likes</h3>
                      <div className="px-2">
                        <Slider value={likesRange} onValueChange={setLikesRange} max={maxLikes} min={0} step={1} className="w-full" />
                        <div className="flex justify-between mt-2">
                          <span className="text-xs text-gray-500">{likesRange[0]} likes</span>
                          <span className="text-xs text-gray-500">{likesRange[1]} likes</span>
                        </div>
                      </div>
                    </div>

                    {/* University Project Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Project Type</h3>
                      <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-900 p-2 rounded">
                        <Checkbox
                          checked={showUniversityOnly}
                          onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                              setShowUniversityOnly(checked);
                            }
                          }}
                          className="border-gray-700"
                        />
                        <span className="text-sm text-gray-300">University Projects Only</span>
                      </label>
                    </div>

                    {/* Links Filter */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-300">Project Links</h3>
                      <Select value={hasLinks} onValueChange={setHasLinks}>
                        <SelectTrigger className="h-9 bg-black border-gray-800 text-gray-100 text-sm focus:border-gray-700">
                          <SelectValue placeholder="Filter by links" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-gray-100">
                          <SelectItem value="all" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            All Projects
                          </SelectItem>
                          <SelectItem value="with-links" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            Has GitHub/Demo Links
                          </SelectItem>
                          <SelectItem value="without-links" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            No Links Provided
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      className="w-full bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800"
                      onClick={() => {
                        setSelectedTracks([]);
                        setSelectedCountries([]);
                        setTeamSizeRange([1, maxTeamSize]);
                        setLikesRange([0, maxLikes]);
                        setShowUniversityOnly(false);
                        setHasLinks("all");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-9 bg-black border-gray-800 text-gray-100 placeholder-gray-500 text-sm focus:border-gray-700"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-[180px] bg-black border-gray-800 text-gray-100 text-sm focus:border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-black border-gray-800 text-gray-100">
                  <SelectItem value="random" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                    Default (Random)
                  </SelectItem>
                  <SelectItem value="likes" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                    Most Liked
                  </SelectItem>
                  <SelectItem value="name" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                    Name A-Z
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="container mx-auto px-6 pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <TabsList className="bg-gray-900 border border-gray-800 w-fit">
                  <TabsTrigger value="projects" className="data-[state=active]:bg-gray-800">
                    <TableIcon className="h-4 w-4 mr-2" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-800">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3 flex-wrap">
                  {activeTab === "projects" && sortBy === "random" && (
                    <Button onClick={handleShuffle} variant="outline" className="h-9 bg-black border-gray-800 text-gray-100 hover:bg-gray-900 hover:border-gray-700" size="sm">
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle
                    </Button>
                  )}

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowSpotlight(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white relative overflow-hidden"
                      size="sm"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                      <Sparkles className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">Project Spotlight</span>
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Projects Table Tab */}
              <TabsContent value="projects" className="space-y-0">
                <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
                  {/* Results Count */}
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm text-gray-400">
                      Showing{" "}
                      <span className="font-medium text-gray-200">
                        {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProjects.length)}
                      </span>{" "}
                      of <span className="font-medium text-gray-200">{filteredAndSortedProjects.length}</span> projects
                      {filteredAndSortedProjects.length !== mappedProjects.length && <span className="text-gray-500"> (filtered from {mappedProjects.length} total)</span>}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800 hover:bg-transparent bg-gray-950">
                          <TableHead className="text-gray-400 font-semibold text-xs w-[250px]">Project</TableHead>
                          <TableHead className="text-gray-400 font-semibold text-xs w-[400px]">Description</TableHead>
                          <TableHead className="text-gray-400 font-semibold text-xs w-[180px]">Tracks</TableHead>
                          <TableHead className="text-gray-400 font-semibold text-xs w-[120px]">Team</TableHead>
                          <TableHead className="text-gray-400 font-semibold text-xs w-[120px]">Location</TableHead>
                          <TableHead className="text-gray-400 font-semibold text-xs w-[120px] text-center">Engagement</TableHead>
                          <TableHead className="text-gray-400 font-semibold text-xs w-[140px] text-center">Links</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TooltipProvider>
                          {currentProjects.map((project, index) => (
                            <TableRow key={project.id} className={`border-gray-800 hover:bg-gray-900 transition-colors ${index % 2 === 0 ? "bg-gray-950/50" : ""}`}>
                              <TableCell className="py-2">
                                <div className="flex items-center gap-2">
                                  <div className="relative h-8 w-8 rounded-md overflow-hidden bg-gray-900 flex-shrink-0">
                                    {project.image?.url ? (
                                      <Image src={project.image.url} alt={`${project.name} logo`} fill className="object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                                        <span className="text-xs font-semibold text-gray-400">{project.name?.charAt(0)?.toUpperCase() || "?"}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <a
                                      href={`https://arena.colosseum.org/projects/explore/${project.slug}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-sm text-gray-100 hover:text-purple-400 transition-colors"
                                    >
                                      {project.name}
                                    </a>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="max-w-md">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="text-xs text-gray-300 line-clamp-2 cursor-help">{project.description}</p>
                                  </TooltipTrigger>
                                  {project.description.length > 150 && (
                                    <TooltipContent className="max-w-lg bg-gray-950 border-gray-800 text-gray-100 p-4">
                                      <p className="text-sm whitespace-pre-wrap">{project.description}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TableCell>

                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {project.tracks.map((track) => (
                                    <Badge
                                      key={track}
                                      variant="outline"
                                      className={`text-[11px] px-2 py-0 ${trackColors[track as keyof typeof trackColors] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}
                                    >
                                      {track}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>

                              <TableCell>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div className="flex items-center gap-1 cursor-pointer">
                                      <div className="flex -space-x-1">
                                        {project.teamMembers.slice(0, 3).map((member, idx) => (
                                          <Avatar key={idx} className="h-6 w-6 border border-gray-700 hover:z-10 transition-transform hover:scale-110">
                                            {member.avatarUrl && member.avatarUrl.trim() !== "" && <AvatarImage src={member.avatarUrl} alt={member.displayName} />}
                                            <AvatarFallback className={`bg-gradient-to-r ${getAvatarGradient(member.displayName)} text-white text-[10px] font-semibold`}>
                                              {member.displayName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                        ))}
                                      </div>
                                      {project.teamMembers.length > 3 && <span className="text-[10px] text-gray-400">+{project.teamMembers.length - 3}</span>}
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-64 bg-gray-950 border-gray-800 p-3" align="center">
                                    <div className="space-y-2">
                                      <p className="text-xs font-medium text-gray-300 mb-2">Team Members ({project.teamMembers.length})</p>
                                      {project.teamMembers.map((member, idx) => (
                                        <a
                                          key={idx}
                                          href={`https://arena.colosseum.org/profiles/${member.username}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 p-1 rounded hover:bg-gray-900 transition-colors"
                                        >
                                          <Avatar className="h-8 w-8">
                                            {member.avatarUrl && member.avatarUrl.trim() !== "" && <AvatarImage src={member.avatarUrl} alt={member.displayName} />}
                                            <AvatarFallback className={`bg-gradient-to-r ${getAvatarGradient(member.displayName)} text-white text-xs font-semibold`}>
                                              {member.displayName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-200 truncate">{member.displayName}</p>
                                            <p className="text-[10px] text-gray-500">@{member.username}</p>
                                          </div>
                                        </a>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </TableCell>

                              <TableCell>
                                <span className="text-xs text-gray-300">{project.country}</span>
                              </TableCell>

                              <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-3 w-3 text-red-400" />
                                    <span className="text-xs text-gray-300">{project.likes}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3 text-blue-400" />
                                    <span className="text-xs text-gray-300">{project.comments}</span>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell>
                                <div className="flex items-center justify-start gap-1">
                                  {project.repoLink && (
                                    <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-900" title="GitHub Repository">
                                        <Github className="h-3 w-3 text-gray-500" />
                                      </Button>
                                    </a>
                                  )}
                                  {project.twitterHandle && (
                                    <a href={`https://twitter.com/${project.twitterHandle}`} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-900" title="Twitter">
                                        <Twitter className="h-3 w-3 text-gray-500" />
                                      </Button>
                                    </a>
                                  )}
                                  {project.presentationLink && (
                                    <a href={project.presentationLink} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-900" title="Presentation">
                                        <Presentation className="h-3 w-3 text-gray-500" />
                                      </Button>
                                    </a>
                                  )}
                                  {project.technicalDemoLink && (
                                    <a href={project.technicalDemoLink} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-900" title="Technical Demo">
                                        <Video className="h-3 w-3 text-gray-500" />
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TooltipProvider>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Show</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-8 w-[70px] bg-black border-gray-800 text-gray-100 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-gray-800 text-gray-100">
                          <SelectItem value="10" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            10
                          </SelectItem>
                          <SelectItem value="20" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            20
                          </SelectItem>
                          <SelectItem value="50" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            50
                          </SelectItem>
                          <SelectItem value="100" className="text-gray-100 focus:bg-gray-900 focus:text-gray-100 text-xs">
                            100
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <span className="text-xs text-gray-400">per page</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 hover:bg-gray-900 disabled:opacity-30"
                      >
                        <ChevronsLeft className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0 hover:bg-gray-900 disabled:opacity-30"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-400" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">Page</span>
                        <Input
                          type="text"
                          value={pageInput}
                          onChange={(e) => handlePageInputChange(e.target.value)}
                          onBlur={handlePageInputSubmit}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handlePageInputSubmit();
                            }
                          }}
                          className="h-8 w-14 text-center bg-black border-gray-800 text-gray-100 text-xs focus:border-gray-700"
                        />
                        <span className="text-xs text-gray-400">of {totalPages || 1}</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 hover:bg-gray-900 disabled:opacity-30"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0 hover:bg-gray-900 disabled:opacity-30"
                      >
                        <ChevronsRight className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-0">
                <Analytics
                  projects={mappedProjects}
                  filteredProjects={filteredAndSortedProjects}
                  activeFilters={{
                    tracks: selectedTracks,
                    countries: selectedCountries,
                    teamSizeRange,
                    likesRange,
                    universityOnly: showUniversityOnly,
                    hasLinks,
                    searchTerm,
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
}
