"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
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

// Mock analytics data
const MOCK_STATS = {
  totalViews: 1245,
  viewsTrend: 12.5,
  totalInquiries: 48,
  inquiriesTrend: -5.2,
  totalSaved: 87,
  savedTrend: 23.1,
  totalCalls: 15,
  callsTrend: 8.3,
};

const MOCK_PROPERTY_STATS = [
  {
    id: "1",
    title: "Modern 3 Bedroom Apartment in DHA Phase 6",
    views: 245,
    inquiries: 12,
    saves: 34,
    calls: 5,
  },
  {
    id: "2",
    title: "Luxury Villa with Pool in Bahria Town",
    views: 567,
    inquiries: 24,
    saves: 45,
    calls: 8,
  },
  {
    id: "3",
    title: "Commercial Plaza in Gulberg",
    views: 433,
    inquiries: 12,
    saves: 8,
    calls: 2,
  },
];

const MOCK_CHART_DATA = [
  { date: "Jan 1", views: 45, inquiries: 3 },
  { date: "Jan 2", views: 52, inquiries: 5 },
  { date: "Jan 3", views: 38, inquiries: 2 },
  { date: "Jan 4", views: 65, inquiries: 8 },
  { date: "Jan 5", views: 78, inquiries: 6 },
  { date: "Jan 6", views: 92, inquiries: 4 },
  { date: "Jan 7", views: 88, inquiries: 7 },
];

function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  iconColor,
}: {
  title: string;
  value: number | string;
  trend: number;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) {
  const isPositive = trend >= 0;

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
    </Card>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30days");

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
          value={MOCK_STATS.totalViews.toLocaleString()}
          trend={MOCK_STATS.viewsTrend}
          icon={Eye}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Inquiries"
          value={MOCK_STATS.totalInquiries}
          trend={MOCK_STATS.inquiriesTrend}
          icon={MessageSquare}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Saves"
          value={MOCK_STATS.totalSaved}
          trend={MOCK_STATS.savedTrend}
          icon={Heart}
          iconColor="bg-red-100 text-red-600"
        />
        <StatCard
          title="Phone Calls"
          value={MOCK_STATS.totalCalls}
          trend={MOCK_STATS.callsTrend}
          icon={Phone}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Chart Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Views & Inquiries Trend</h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {MOCK_CHART_DATA.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/20 rounded-t"
                  style={{ height: `${(data.views / 100) * 150}px` }}
                />
                <div
                  className="w-3/4 bg-primary rounded-t"
                  style={{ height: `${data.inquiries * 15}px` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{data.date}</span>
            </div>
          ))}
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
      </Card>

      {/* Property Performance */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Property Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-muted-foreground border-b">
                <th className="pb-3 font-medium">Property</th>
                <th className="pb-3 font-medium text-center">Views</th>
                <th className="pb-3 font-medium text-center">Inquiries</th>
                <th className="pb-3 font-medium text-center">Saves</th>
                <th className="pb-3 font-medium text-center">Calls</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROPERTY_STATS.map((property) => (
                <tr key={property.id} className="border-b last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-medium line-clamp-1">
                        {property.title}
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
                  <td className="py-4 text-center">
                    <span className="font-semibold">{property.calls}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
