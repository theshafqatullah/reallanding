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
import { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: number | string;
  trend?: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) {
  const isPositive = trend ? trend >= 0 : true;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
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
          <span className="text-sm text-muted-foreground">vs last month</span>
        </div>
      )}
    </Card>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30days");
  const [loading, setLoading] = useState(true);
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

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
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
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [user?.$id, getDaysCount]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Views"
          value={(overview?.totalViews || 0).toLocaleString()}
          trend={overview?.viewsTrend}
          icon={Eye}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Inquiries"
          value={overview?.totalInquiries || 0}
          trend={overview?.inquiriesTrend}
          icon={MessageSquare}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Saves"
          value={overview?.totalSaves || 0}
          trend={overview?.savesTrend}
          icon={Heart}
          iconColor="bg-red-100 text-red-600"
        />
        <StatCard
          title="Calls"
          value={overview?.totalCalls || 0}
          trend={overview?.callsTrend}
          icon={Phone}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Views & Inquiries Trend</h2>
        {dailyData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available for the selected period
          </div>
        ) : (
          <>
            <div className="h-64 flex items-end justify-between gap-2">
              {dailyData.slice(-7).map((data, index) => {
                const maxViews = Math.max(...dailyData.map((d) => d.views), 1);
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary/20 rounded-t"
                        style={{ height: `${(data.views / maxViews) * 150}px` }}
                      />
                      <div
                        className="w-3/4 bg-primary rounded-t"
                        style={{ height: `${Math.min(data.inquiries * 15, 100)}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{data.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/20 rounded" />
                <span className="text-sm text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span className="text-sm text-muted-foreground">Inquiries</span>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Property Performance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Top Performing Properties</h2>
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
                </tr>
              </thead>
              <tbody>
                {topProperties.map((property) => (
                  <tr key={property.propertyId} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium line-clamp-1">
                          {property.propertyTitle || "Untitled Property"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-semibold">{property.views}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-semibold">{property.inquiries}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-semibold">{property.saves}</span>
                    </td>
                  </tr>
                ))}
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
