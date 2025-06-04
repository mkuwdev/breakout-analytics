"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Users, Globe, Code, TrendingUp } from "lucide-react";

// Dynamic import for recharts with error handling
let BarChart: any, Bar: any, PieChart: any, Pie: any, Cell: any, ResponsiveContainer: any, XAxis: any, YAxis: any, CartesianGrid: any, Tooltip: any, Legend: any;

try {
  const recharts = require("recharts");
  BarChart = recharts.BarChart;
  Bar = recharts.Bar;
  PieChart = recharts.PieChart;
  Pie = recharts.Pie;
  Cell = recharts.Cell;
  ResponsiveContainer = recharts.ResponsiveContainer;
  XAxis = recharts.XAxis;
  YAxis = recharts.YAxis;
  CartesianGrid = recharts.CartesianGrid;
  Tooltip = recharts.Tooltip;
  Legend = recharts.Legend;
} catch (error) {
  console.warn("Recharts not installed. Run: npm install recharts");
}

interface AnalyticsProps {
  projects: any[];
  filteredProjects: any[];
  activeFilters: {
    tracks: string[];
    countries: string[];
    teamSizeRange: number[];
    likesRange: number[];
    universityOnly: boolean;
    hasLinks: string;
    searchTerm: string;
  };
}

// Chart colors matching the track colors
const CHART_COLORS = [
  "#a855f7", // purple-500
  "#22c55e", // green-500
  "#3b82f6", // blue-500
  "#f97316", // orange-500
  "#ef4444", // red-500
  "#eab308", // yellow-500
  "#06b6d4", // cyan-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
];

export default function Analytics({ projects, filteredProjects, activeFilters }: AnalyticsProps) {
  // Check if recharts is available
  if (!ResponsiveContainer) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-gray-950 border-gray-800">
          <CardContent className="py-8">
            <p className="text-center text-gray-400">
              Charts require the recharts library. Please run: <code className="bg-gray-800 px-2 py-1 rounded">npm install recharts</code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalParticipants = new Set(filteredProjects.flatMap((p) => p.teamMembers.map((m: any) => m.id))).size;
    const avgTeamSize = filteredProjects.length > 0 ? (filteredProjects.reduce((sum, p) => sum + p.teamMembers.length, 0) / filteredProjects.length).toFixed(1) : 0;
    const totalEngagement = filteredProjects.reduce((sum, p) => sum + (p.likes || 0) + p.comments, 0);
    const projectsWithLinks = filteredProjects.filter((p) => p.repoLink || p.presentationLink || p.technicalDemoLink).length;
    const completionRate = filteredProjects.length > 0 ? ((projectsWithLinks / filteredProjects.length) * 100).toFixed(0) : 0;

    return {
      totalProjects: filteredProjects.length,
      totalParticipants,
      avgTeamSize,
      totalEngagement,
      completionRate,
      countriesRepresented: new Set(filteredProjects.map((p) => p.country)).size,
    };
  }, [filteredProjects]);

  // Track distribution data
  const trackData = useMemo(() => {
    const trackCounts: Record<string, number> = {};
    filteredProjects.forEach((project) => {
      project.tracks.forEach((track: string) => {
        trackCounts[track] = (trackCounts[track] || 0) + 1;
      });
    });

    return Object.entries(trackCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProjects]);

  // Country distribution data (top 10)
  const countryData = useMemo(() => {
    const countryCounts: Record<string, number> = {};
    filteredProjects.forEach((project) => {
      countryCounts[project.country] = (countryCounts[project.country] || 0) + 1;
    });

    return Object.entries(countryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredProjects]);

  // Team size distribution
  const teamSizeData = useMemo(() => {
    const sizeCounts: Record<number, number> = {};
    filteredProjects.forEach((project) => {
      const size = project.teamMembers.length;
      sizeCounts[size] = (sizeCounts[size] || 0) + 1;
    });

    return Object.entries(sizeCounts)
      .map(([size, count]) => ({ size: `${size} member${size === "1" ? "" : "s"}`, count }))
      .sort((a, b) => parseInt(a.size) - parseInt(b.size));
  }, [filteredProjects]);

  // Top 10 projects by engagement with full data
  const topProjects = useMemo(() => {
    return [...filteredProjects]
      .map((p) => ({
        name: p.name,
        slug: p.slug,
        engagement: (p.likes || 0) + p.comments,
        likes: p.likes || 0,
        comments: p.comments,
      }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 10);
  }, [filteredProjects]);

  // Active filters display
  const activeFiltersList = useMemo(() => {
    const filters = [];
    if (activeFilters.tracks.length > 0) filters.push(...activeFilters.tracks);
    if (activeFilters.countries.length > 0) filters.push(...activeFilters.countries);
    if (activeFilters.teamSizeRange[0] > 1 || activeFilters.teamSizeRange[1] < 10) {
      filters.push(`${activeFilters.teamSizeRange[0]}-${activeFilters.teamSizeRange[1]} members`);
    }
    if (activeFilters.universityOnly) filters.push("University projects");
    if (activeFilters.hasLinks !== "all") filters.push(activeFilters.hasLinks === "with-links" ? "Has links" : "No links");
    if (activeFilters.searchTerm) filters.push(`"${activeFilters.searchTerm}"`);
    return filters;
  }, [activeFilters]);

  // Calculate insights comparing filtered vs all projects
  const insights = useMemo(() => {
    // Overall metrics
    const allParticipants = new Set(projects.flatMap((p) => p.teamMembers.map((m: any) => m.id))).size;
    const allAvgTeamSize = projects.length > 0 ? projects.reduce((sum, p) => sum + p.teamMembers.length, 0) / projects.length : 0;
    const allAvgEngagement = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.likes || 0) + p.comments, 0) / projects.length : 0;
    const allProjectsWithLinks = projects.filter((p) => p.repoLink || p.presentationLink || p.technicalDemoLink).length;
    const allCompletionRate = projects.length > 0 ? (allProjectsWithLinks / projects.length) * 100 : 0;

    // Filtered metrics
    const filteredAvgEngagement = filteredProjects.length > 0 ? filteredProjects.reduce((sum, p) => sum + (p.likes || 0) + p.comments, 0) / filteredProjects.length : 0;
    const filteredAvgTeamSize = filteredProjects.length > 0 ? filteredProjects.reduce((sum, p) => sum + p.teamMembers.length, 0) / filteredProjects.length : 0;

    // Track with highest average engagement
    const trackEngagement: Record<string, { total: number; count: number }> = {};
    filteredProjects.forEach((project) => {
      const engagement = (project.likes || 0) + project.comments;
      project.tracks.forEach((track: string) => {
        if (!trackEngagement[track]) trackEngagement[track] = { total: 0, count: 0 };
        trackEngagement[track].total += engagement;
        trackEngagement[track].count += 1;
      });
    });

    const topTrackByEngagement = Object.entries(trackEngagement)
      .map(([track, data]) => ({ track, avgEngagement: data.total / data.count }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)[0];

    // Country with highest average engagement
    const countryEngagement: Record<string, { total: number; count: number }> = {};
    filteredProjects.forEach((project) => {
      const engagement = (project.likes || 0) + project.comments;
      if (!countryEngagement[project.country]) countryEngagement[project.country] = { total: 0, count: 0 };
      countryEngagement[project.country].total += engagement;
      countryEngagement[project.country].count += 1;
    });

    const topCountryByEngagement = Object.entries(countryEngagement)
      .map(([country, data]) => ({ country, avgEngagement: data.total / data.count }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement)[0];

    // Most common team size
    const teamSizeCounts: Record<number, number> = {};
    filteredProjects.forEach((project) => {
      const size = project.teamMembers.length;
      teamSizeCounts[size] = (teamSizeCounts[size] || 0) + 1;
    });
    const mostCommonTeamSize = Object.entries(teamSizeCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      engagementDiff: (((filteredAvgEngagement - allAvgEngagement) / allAvgEngagement) * 100).toFixed(1),
      teamSizeDiff: (((filteredAvgTeamSize - allAvgTeamSize) / allAvgTeamSize) * 100).toFixed(1),
      completionDiff: (Number(metrics.completionRate) - allCompletionRate).toFixed(1),
      topTrack: topTrackByEngagement,
      topCountry: topCountryByEngagement,
      mostCommonTeamSize: mostCommonTeamSize ? { size: mostCommonTeamSize[0], count: mostCommonTeamSize[1] } : null,
      filteredAvgEngagement: filteredAvgEngagement.toFixed(1),
      allAvgEngagement: allAvgEngagement.toFixed(1),
    };
  }, [projects, filteredProjects, metrics.completionRate]);

  return (
    <div className="space-y-6">
      {/* Active Filters Banner */}
      {activeFiltersList.length > 0 && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400">Showing analytics for:</span>
            {activeFiltersList.map((filter, idx) => (
              <Badge key={idx} className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                {filter}
              </Badge>
            ))}
            <span className="text-sm text-gray-400 ml-2">
              ({filteredProjects.length} of {projects.length} projects)
            </span>
          </div>
        </div>
      )}

      {/* Insights Section - Only show when filters are active */}
      {activeFiltersList.length > 0 && filteredProjects.length > 0 && (
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Key Insights</CardTitle>
            <CardDescription className="text-xs text-gray-500">How filtered projects compare to all projects</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Engagement</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200">{insights.filteredAvgEngagement}</span>
                    <span className={`text-xs ${Number(insights.engagementDiff) > 0 ? "text-green-400" : Number(insights.engagementDiff) < 0 ? "text-red-400" : "text-gray-400"}`}>
                      ({Number(insights.engagementDiff) > 0 ? "+" : ""}
                      {insights.engagementDiff}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Team Size</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200">{Number(metrics.avgTeamSize).toFixed(1)}</span>
                    <span className={`text-xs ${Number(insights.teamSizeDiff) > 0 ? "text-green-400" : Number(insights.teamSizeDiff) < 0 ? "text-red-400" : "text-gray-400"}`}>
                      ({Number(insights.teamSizeDiff) > 0 ? "+" : ""}
                      {insights.teamSizeDiff}%)
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Completion Rate</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-200">{metrics.completionRate}%</span>
                    <span className={`text-xs ${Number(insights.completionDiff) > 0 ? "text-green-400" : Number(insights.completionDiff) < 0 ? "text-red-400" : "text-gray-400"}`}>
                      ({Number(insights.completionDiff) > 0 ? "+" : ""}
                      {insights.completionDiff}pp)
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {insights.topTrack && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Top Track by Engagement</span>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 text-xs">{insights.topTrack.track}</Badge>
                      <span className="text-xs text-gray-500">({insights.topTrack.avgEngagement.toFixed(1)} avg)</span>
                    </div>
                  </div>
                )}
                {insights.topCountry && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Top Country by Engagement</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200">{insights.topCountry.country}</span>
                      <span className="text-xs text-gray-500">({insights.topCountry.avgEngagement.toFixed(1)} avg)</span>
                    </div>
                  </div>
                )}
                {insights.mostCommonTeamSize && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Most Common Team Size</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-200">{insights.mostCommonTeamSize.size} members</span>
                      <span className="text-xs text-gray-500">({insights.mostCommonTeamSize.count} projects)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-gray-300">Total Projects</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-white">{metrics.totalProjects}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-gray-300">Participants</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-white">{metrics.totalParticipants}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-gray-300">Avg Team Size</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-white">{metrics.avgTeamSize}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-gray-300">Total Engagement</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-white">{metrics.totalEngagement}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-gray-300">Countries</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-white">{metrics.countriesRepresented}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs font-medium text-gray-300">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="text-xl font-bold text-white">{metrics.completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Track Distribution */}
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Track Distribution</CardTitle>
            <CardDescription className="text-xs text-gray-500">Projects with multiple tracks are counted in each track</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={trackData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }: {
                    cx: number;
                    cy: number;
                    midAngle: number;
                    innerRadius: number;
                    outerRadius: number;
                    percent: number;
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    if (percent < 0.05) return null; // Hide labels for small slices

                    return (
                      <text x={x} y={y} fill="#9ca3af" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-xs">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                  itemStyle={{ color: "#e5e7eb", fontSize: "12px" }}
                  formatter={(value: number, name: string) => [`${value} projects`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "12px",
                  }}
                  formatter={(value: string) => <span style={{ color: "#9ca3af" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Top Countries</CardTitle>
            <CardDescription className="text-xs text-gray-500">Projects by country</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                  itemStyle={{ color: "#e5e7eb", fontSize: "12px" }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Size Distribution */}
        <Card className="bg-gray-950 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-100">Team Size Distribution</CardTitle>
            <CardDescription className="text-xs text-gray-500">Number of projects by team size</CardDescription>
          </CardHeader>
          <CardContent className="pb-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="size" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    border: "1px solid #374151",
                    borderRadius: "6px",
                    padding: "8px",
                  }}
                  itemStyle={{ color: "#e5e7eb", fontSize: "12px" }}
                  labelFormatter={(value: string | number) => `Team size: ${value}`}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Projects - Full Width */}
      <Card className="bg-gray-950 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-100">Top 10 Projects by Engagement</CardTitle>
          {/* <CardDescription className="text-xs text-gray-500">Most liked and commented projects</CardDescription> */}
          <CardDescription className="text-xs text-gray-500">Most commented projects</CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First column: 1-5 */}
            <div className="space-y-2">
              {topProjects.slice(0, 5).map((project, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-900 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm text-gray-500 w-6 text-center">{index === 0 ? "👑" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}</span>
                    <a
                      href={`https://arena.colosseum.org/projects/explore/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-200 hover:text-purple-400 transition-colors truncate flex-1"
                    >
                      {project.name}
                    </a>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {/* <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-gray-400">{project.likes}</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-gray-400">{project.comments}</span>
                    </div>
                    {/* <span className="text-xs font-medium text-gray-300 w-12 text-right">{project.engagement}</span> */}
                  </div>
                </div>
              ))}
            </div>

            {/* Second column: 6-10 */}
            <div className="space-y-2">
              {topProjects.slice(5, 10).map((project, index) => (
                <div key={index + 5} className="flex items-center justify-between p-2 rounded hover:bg-gray-900 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs text-gray-500 w-6 text-center">#{index + 6}</span>
                    <a
                      href={`https://arena.colosseum.org/projects/explore/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-200 hover:text-purple-400 transition-colors truncate flex-1"
                    >
                      {project.name}
                    </a>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    {/* <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-gray-400">{project.likes}</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-gray-400">{project.comments}</span>
                    </div>
                    {/* <span className="text-xs font-medium text-gray-300 w-12 text-right">{project.engagement}</span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
