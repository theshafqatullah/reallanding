"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/store/auth";
import { analyticsService, type UserAnalyticsOverview, type PropertyAnalytics } from "@/services/analytics";
import { toast } from "sonner";
import {
  Eye,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Heart,
  Phone,
  Building2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Target,
  Percent,
  Activity,
  MousePointerClick,
  Share2,
  Download,
  ChevronRight,
  Info,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconColor,
  description,
}: {
  title: string;
  value: number | string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  description?: string;
}) {
  const isPositive = trend ? trend >= 0 : true;

  return (
    <Card className="p-6 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-[200px]">{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-4">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {Math.abs(trend)}%
          </span>
          <span className="text-sm text-muted-foreground">vs last period</span>
        </div>
      )}
      <div className={`absolute inset-0 ${iconColor} opacity-0 group-hover:opacity-5 transition-opacity`} />
    </Card>
  );
}

// Mini chart bar component for trends
function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-t ${color}`}
          style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? "4px" : "2px" }}
        />
      ))}
    </div>
  );
}

// Conversion funnel component
function ConversionFunnel({
  views,
  inquiries,
  saves,
  calls,
}: {
  views: number;
  inquiries: number;
  saves: number;
  calls: number;
}) {
  const viewsToInquiries = views > 0 ? ((inquiries / views) * 100).toFixed(1) : "0";
  const viewsToSaves = views > 0 ? ((saves / views) * 100).toFixed(1) : "0";
  const viewsToCalls = views > 0 ? ((calls / views) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">Views</span>
        </div>
        <span className="font-semibold">{views.toLocaleString()}</span>
      </div>

      <div className="relative pl-2 ml-1.5 border-l-2 border-dashed border-muted space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 -ml-[13px]" />
            <MessageSquare className="h-4 w-4 text-green-600" />
            <span className="text-sm">Inquiries</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{viewsToInquiries}%</Badge>
            <span className="font-medium">{inquiries}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 -ml-[13px]" />
            <Heart className="h-4 w-4 text-red-600" />
            <span className="text-sm">Saves</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{viewsToSaves}%</Badge>
            <span className="font-medium">{saves}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 -ml-[13px]" />
            <Phone className="h-4 w-4 text-purple-600" />
            <span className="text-sm">Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{viewsToCalls}%</Badge>
            <span className="font-medium">{calls}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30days");
  const [chartType, setChartType] = useState<"views" | "inquiries" | "both">("both");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState<UserAnalyticsOverview | null>(null);
  const [topProperties, setTopProperties] = useState<PropertyAnalytics[]>([]);
  const [dailyData, setDailyData] = useState<{ date: string; views: number; inquiries: number }[]>([]);

  // Get days count from selection
  const getDaysCount = useCallback(() => {
    switch (timeRange) {
      case "7days":
        return 7;
      case "30days":
        return 30;
      case "90days":
        return 90;
      case "year":
        return 365;
      default:
        return 30;
    }
  }, [timeRange]);

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    if (!overview || !dailyData.length) return null;

    const totalViews = overview.totalViews || 0;
    const totalInquiries = overview.totalInquiries || 0;
    const totalSaves = overview.totalSaves || 0;
    const totalCalls = overview.totalCalls || 0;

    const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(2) : "0";
    const engagementRate = totalViews > 0 ? (((totalSaves + totalInquiries + totalCalls) / totalViews) * 100).toFixed(2) : "0";

    // Calculate average daily views
    const avgDailyViews = dailyData.length > 0
      ? Math.round(dailyData.reduce((sum, d) => sum + d.views, 0) / dailyData.length)
      : 0;

    // Find best performing day
    const bestDay = dailyData.reduce((best, current) =>
      current.views > best.views ? current : best,
      dailyData[0] || { date: "", views: 0, inquiries: 0 }
    );

    // Weekly trends (last 7 entries)
    const last7Days = dailyData.slice(-7);
    const weeklyViewsTrend = last7Days.map(d => d.views);
    const weeklyInquiriesTrend = last7Days.map(d => d.inquiries);

    return {
      conversionRate,
      engagementRate,
      avgDailyViews,
      bestDay,
      weeklyViewsTrend,
      weeklyInquiriesTrend,
    };
  }, [overview, dailyData]);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (!user?.$id) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const days = getDaysCount();

      const [overviewData, topPropertiesData, dailyStats] = await Promise.all([
        analyticsService.getUserAnalyticsOverview(user.$id),
        analyticsService.getTopPerformingProperties(user.$id, "views", 5),
        analyticsService.getDailyAnalytics(user.$id, days),
      ]);

      setOverview(overviewData);
      setTopProperties(topPropertiesData);
      setDailyData(
        dailyStats.map((d) => ({
          date: d.date,
          views: d.views,
          inquiries: d.inquiries,
        }))
      );

      if (isRefresh) {
        toast.success("Analytics data refreshed");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.$id, getDaysCount]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Handle refresh
  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  // Handle export
  const handleExport = () => {
    const data = {
      overview,
      topProperties,
      dailyData,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Analytics data exported");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track the performance of your listings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick Insights */}
      {derivedMetrics && (
        <Card className="p-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Quick Insights</p>
              <p className="text-xs text-muted-foreground">
                Your best performing day was <span className="font-medium text-foreground">{derivedMetrics.bestDay.date}</span> with{" "}
                <span className="font-medium text-foreground">{derivedMetrics.bestDay.views} views</span>.{" "}
                Average daily views: <span className="font-medium text-foreground">{derivedMetrics.avgDailyViews}</span>.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Weekly Views</p>
                <MiniBarChart data={derivedMetrics.weeklyViewsTrend} color="bg-blue-500" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Weekly Inquiries</p>
                <MiniBarChart data={derivedMetrics.weeklyInquiriesTrend} color="bg-green-500" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={(overview?.totalViews || 0).toLocaleString()}
          trend={overview?.viewsTrend}
          icon={Eye}
          iconColor="bg-blue-100 text-blue-600"
          description="Total number of times your listings were viewed"
        />
        <StatCard
          title="Inquiries"
          value={overview?.totalInquiries || 0}
          trend={overview?.inquiriesTrend}
          icon={MessageSquare}
          iconColor="bg-green-100 text-green-600"
          description="Direct messages and contact requests received"
        />
        <StatCard
          title="Saves"
          value={overview?.totalSaves || 0}
          trend={overview?.savesTrend}
          icon={Heart}
          iconColor="bg-red-100 text-red-600"
          description="Number of users who saved your listings"
        />
        <StatCard
          title="Calls"
          value={overview?.totalCalls || 0}
          trend={overview?.callsTrend}
          icon={Phone}
          iconColor="bg-purple-100 text-purple-600"
          description="Phone calls initiated from your listings"
        />
      </div>

      {/* Conversion & Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">{derivedMetrics?.conversionRate || 0}%</p>
            </div>
          </div>
          <Progress value={parseFloat(derivedMetrics?.conversionRate || "0")} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Views to inquiries</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <Activity className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Engagement Rate</p>
              <p className="text-2xl font-bold">{derivedMetrics?.engagementRate || 0}%</p>
            </div>
          </div>
          <Progress value={Math.min(parseFloat(derivedMetrics?.engagementRate || "0"), 100)} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Total interactions / views</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Daily Views</p>
              <p className="text-2xl font-bold">{derivedMetrics?.avgDailyViews || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Based on selected time range</span>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Conversion Funnel</h2>
            <Badge variant="secondary">
              <Percent className="h-3 w-3 mr-1" />
              Funnel Analysis
            </Badge>
          </div>
          <ConversionFunnel
            views={overview?.totalViews || 0}
            inquiries={overview?.totalInquiries || 0}
            saves={overview?.totalSaves || 0}
            calls={overview?.totalCalls || 0}
          />
        </Card>

        {/* Performance Score */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Performance Score</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-[200px]">
                    Score based on views, engagement, and conversion rates
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {(() => {
            const score = Math.min(
              Math.round(
                (parseFloat(derivedMetrics?.conversionRate || "0") * 10) +
                (parseFloat(derivedMetrics?.engagementRate || "0") * 5) +
                Math.min((overview?.totalViews || 0) / 100, 50)
              ),
              100
            );
            const getScoreColor = (s: number) => {
              if (s >= 80) return "text-green-600";
              if (s >= 60) return "text-blue-600";
              if (s >= 40) return "text-yellow-600";
              return "text-red-600";
            };
            const getScoreLabel = (s: number) => {
              if (s >= 80) return "Excellent";
              if (s >= 60) return "Good";
              if (s >= 40) return "Average";
              return "Needs Improvement";
            };

            return (
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      className="text-muted/20"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${score * 3.52} 352`}
                      className={getScoreColor(score)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <Badge variant="secondary" className={getScoreColor(score)}>
                  {getScoreLabel(score)}
                </Badge>
              </div>
            );
          })()}
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Views & Inquiries Trend</h2>
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as typeof chartType)}>
            <TabsList className="h-8">
              <TabsTrigger value="both" className="text-xs">Both</TabsTrigger>
              <TabsTrigger value="views" className="text-xs">Views</TabsTrigger>
              <TabsTrigger value="inquiries" className="text-xs">Inquiries</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {dailyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <>
            <div className="h-64 flex items-end justify-between gap-1">
              {dailyData.slice(-14).map((data, index) => {
                const maxViews = Math.max(...dailyData.map((d) => d.views), 1);
                const maxInquiries = Math.max(...dailyData.map((d) => d.inquiries), 1);
                const showViews = chartType === "both" || chartType === "views";
                const showInquiries = chartType === "both" || chartType === "inquiries";

                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex-1 flex flex-col items-center gap-1 cursor-pointer group">
                          <div className="w-full flex flex-col items-center gap-0.5 min-h-[150px] justify-end">
                            {showViews && (
                              <div
                                className="w-full bg-blue-500/80 rounded-t transition-all group-hover:bg-blue-600"
                                style={{ height: `${(data.views / maxViews) * 150}px`, minHeight: data.views > 0 ? "4px" : "2px" }}
                              />
                            )}
                            {showInquiries && (
                              <div
                                className="w-3/4 bg-green-500 rounded-t transition-all group-hover:bg-green-600"
                                style={{ height: `${(data.inquiries / maxInquiries) * 80}px`, minHeight: data.inquiries > 0 ? "4px" : "2px" }}
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {data.date.split("-").slice(1).join("/")}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-medium">{data.date}</p>
                          {showViews && <p>Views: {data.views}</p>}
                          {showInquiries && <p>Inquiries: {data.inquiries}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              {(chartType === "both" || chartType === "views") && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span className="text-sm text-muted-foreground">Views</span>
                </div>
              )}
              {(chartType === "both" || chartType === "inquiries") && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <span className="text-sm text-muted-foreground">Inquiries</span>
                </div>
              )}
            </div>
          </>
        )}
      </Card>

      {/* Property Performance */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Top Performing Properties</h2>
          <Badge variant="outline">
            <BarChart3 className="h-3 w-3 mr-1" />
            Top 5
          </Badge>
        </div>
        {topProperties.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No property data available yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="pb-3 font-medium">Property</th>
                  <th className="pb-3 font-medium text-center">Views</th>
                  <th className="pb-3 font-medium text-center">Inquiries</th>
                  <th className="pb-3 font-medium text-center">Saves</th>
                  <th className="pb-3 font-medium text-center">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {topProperties.map((property, index) => {
                  const convRate = property.views > 0
                    ? ((property.inquiries / property.views) * 100).toFixed(1)
                    : "0";
                  return (
                    <tr key={property.propertyId} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                            {index === 0 ? (
                              <Badge className="h-6 w-6 p-0 flex items-center justify-center bg-yellow-500">1</Badge>
                            ) : (
                              <Building2 className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium line-clamp-1">
                            {property.propertyTitle || "Untitled Property"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-semibold">{property.views.toLocaleString()}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-semibold">{property.inquiries}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-semibold">{property.saves}</span>
                      </td>
                      <td className="py-4 text-center">
                        <Badge variant={parseFloat(convRate) >= 5 ? "default" : "secondary"}>
                          {convRate}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-lg shrink-0">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Tips to Improve Performance</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Add high-quality photos to increase views by up to 50%</li>
              <li>• Update your listing description with relevant keywords</li>
              <li>• Respond to inquiries within 24 hours for better conversion</li>
              <li>• Consider promoting your listing for more visibility</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
