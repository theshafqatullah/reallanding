"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Bell,
  Mail,
  MessageSquare,
  Heart,
  TrendingUp,
  AlertCircle,
  Megaphone,
  Save,
} from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

export default function NotificationsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "inquiries",
      title: "New Inquiries",
      description: "When someone sends an inquiry about your listing",
      email: true,
      push: true,
      sms: true,
      icon: MessageSquare,
    },
    {
      id: "saves",
      title: "Property Saves",
      description: "When someone saves your listing",
      email: true,
      push: false,
      sms: false,
      icon: Heart,
    },
    {
      id: "price_alerts",
      title: "Price Alerts",
      description: "When saved properties have price changes",
      email: true,
      push: true,
      sms: false,
      icon: TrendingUp,
    },
    {
      id: "listing_updates",
      title: "Listing Updates",
      description: "Important updates about your listings",
      email: true,
      push: true,
      sms: true,
      icon: AlertCircle,
    },
    {
      id: "marketing",
      title: "Marketing & Promotions",
      description: "Tips, news, and special offers",
      email: false,
      push: false,
      sms: false,
      icon: Megaphone,
    },
  ]);

  const updateSetting = (
    id: string,
    channel: "email" | "push" | "sms",
    value: boolean
  ) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [channel]: value } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success("Notification preferences saved");
  };

  const enableAll = () => {
    setSettings((prev) =>
      prev.map((s) => ({ ...s, email: true, push: true, sms: true }))
    );
  };

  const disableAll = () => {
    setSettings((prev) =>
      prev.map((s) => ({ ...s, email: false, push: false, sms: false }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Choose how you want to be notified
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={disableAll}>
            Disable All
          </Button>
          <Button variant="outline" size="sm" onClick={enableAll}>
            Enable All
          </Button>
        </div>
      </div>

      {/* Notification Channels Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Email</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Push Notifications</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">SMS</span>
          </div>
        </div>
      </Card>

      {/* Settings */}
      <Card className="divide-y">
        {settings.map((setting) => (
          <div key={setting.id} className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Info */}
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-muted rounded-lg shrink-0">
                  <setting.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{setting.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 sm:gap-8 ml-11 sm:ml-0">
                <div className="flex flex-col items-center gap-1">
                  <Switch
                    checked={setting.email}
                    onCheckedChange={(v) => updateSetting(setting.id, "email", v)}
                  />
                  <span className="text-xs text-muted-foreground sm:hidden">
                    Email
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Switch
                    checked={setting.push}
                    onCheckedChange={(v) => updateSetting(setting.id, "push", v)}
                  />
                  <span className="text-xs text-muted-foreground sm:hidden">
                    Push
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Switch
                    checked={setting.sms}
                    onCheckedChange={(v) => updateSetting(setting.id, "sms", v)}
                  />
                  <span className="text-xs text-muted-foreground sm:hidden">
                    SMS
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Email Digest */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Email Digest</h2>
            <p className="text-sm text-muted-foreground">
              Receive a summary of your activity
            </p>
          </div>
        </div>

        <div className="space-y-4 ml-11">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Digest</p>
              <p className="text-sm text-muted-foreground">
                Summary of daily activity
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Report</p>
              <p className="text-sm text-muted-foreground">
                Weekly performance summary
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Monthly Newsletter</p>
              <p className="text-sm text-muted-foreground">
                Market trends and insights
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
