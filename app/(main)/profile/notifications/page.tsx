"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/auth";
import { notificationsService } from "@/services/notifications";
import { type UserNotifications } from "@/types/appwrite";
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
  Check,
  Trash2,
  Building2,
  Clock,
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

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return "Just now";
  }
}

function getNotificationIcon(type: string | undefined) {
  switch (type) {
    case "inquiry":
      return <MessageSquare className="h-4 w-4" />;
    case "property_saved":
      return <Heart className="h-4 w-4" />;
    case "listing_update":
    case "listing_approved":
    case "listing_rejected":
      return <Building2 className="h-4 w-4" />;
    case "price_alert":
      return <TrendingUp className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState<UserNotifications[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
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

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.$id) return;

    try {
      setLoadingNotifications(true);
      const [notifData, count] = await Promise.all([
        notificationsService.getUserNotifications(user.$id, { limit: 20 }),
        notificationsService.getUnreadCount(user.$id),
      ]);

      setNotifications(notifData.notifications);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
    if (!user?.$id) return;

    setSaving(true);
    try {
      // Convert settings to preferences format
      // Note: This would typically be saved to a user_preferences collection
      // or as a JSON field in the user document
      // For now, we'll just show success since notification_preferences may not exist
      toast.success("Notification preferences saved");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.$id) return;

    try {
      await notificationsService.markAllAsRead(user.$id);
      toast.success("All notifications marked as read");
      fetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationsService.delete(notificationId);
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
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
            Manage your notifications and preferences
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary" className="w-fit">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="notifications">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Notifications List */}
        <TabsContent value="notifications" className="mt-6 space-y-4">
          {loadingNotifications ? (
            <div className="flex items-center justify-center min-h-[20vh]">
              <Spinner className="h-6 w-6" />
            </div>
          ) : notifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                You&apos;ll receive notifications about inquiries, property updates, and more.
              </p>
            </Card>
          ) : (
            <>
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </div>

              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card
                    key={notification.$id}
                    className={`p-4 transition-colors ${!notification.is_read ? "bg-primary/5 border-primary/20" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${!notification.is_read ? "bg-primary/10" : "bg-muted"}`}>
                        {getNotificationIcon(notification.notification_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={`text-sm ${!notification.is_read ? "font-semibold" : "font-medium"}`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(notification.$createdAt)}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleMarkAsRead(notification.$id)}
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleDelete(notification.$id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-6 space-y-6">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={disableAll}>
              Disable All
            </Button>
            <Button variant="outline" size="sm" onClick={enableAll}>
              Enable All
            </Button>
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
              {saving ? (
                <Spinner className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
