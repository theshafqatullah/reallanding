"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/store/auth";
import { inquiriesService } from "@/services/inquiries";
import { propertiesService } from "@/services/properties";
import { type PropertyInquiries, type Properties } from "@/types/appwrite";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Building2,
  CheckCircle,
  AlertCircle,
  Send,
  Search,
  Filter,
} from "lucide-react";

// Extended inquiry type with property details
interface InquiryWithProperty extends PropertyInquiries {
  propertyTitle?: string;
}

function getStatusBadge(status: string, isRead: boolean) {
  if (!isRead) {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        <AlertCircle className="h-3 w-3 mr-1" />
        New
      </Badge>
    );
  }

  switch (status) {
    case "pending":
    case "read":
      return (
        <Badge variant="secondary">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case "replied":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="h-3 w-3 mr-1" />
          Replied
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

export default function InquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryWithProperty | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    replied: 0,
  });

  // Fetch inquiries
  const fetchInquiries = useCallback(async () => {
    if (!user?.$id) return;

    try {
      setLoading(true);
      const { inquiries: fetchedInquiries, total } = await inquiriesService.getReceivedInquiries(
        user.$id,
        { limit: 50 }
      );

      // Fetch property titles for each inquiry
      const inquiriesWithProperty = await Promise.all(
        fetchedInquiries.map(async (inquiry) => {
          try {
            const property = await propertiesService.getById(inquiry.property_id);
            return {
              ...inquiry,
              propertyTitle: property?.title || "Unknown Property",
            };
          } catch {
            return {
              ...inquiry,
              propertyTitle: "Unknown Property",
            };
          }
        })
      );

      setInquiries(inquiriesWithProperty);

      // Calculate stats
      const newStats = {
        total,
        unread: fetchedInquiries.filter((i) => !i.is_read).length,
        replied: fetchedInquiries.filter((i) => i.status === "replied").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [user?.$id]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !inquiry.is_read) ||
      (activeTab === "replied" && inquiry.status === "replied");

    const matchesSearch =
      !searchQuery ||
      (inquiry.inquirer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.propertyTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Handle reply
  const handleReply = async () => {
    if (!selectedInquiry || !replyMessage || !user?.$id) return;

    try {
      setReplying(true);
      await inquiriesService.reply(selectedInquiry.$id, replyMessage, user.$id);
      toast.success("Reply sent successfully");
      setReplyMessage("");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (inquiryId: string) => {
    try {
      await inquiriesService.markAsRead(inquiryId);
      fetchInquiries();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
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
      <div>
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground">
          Manage messages and inquiries from potential buyers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Inquiries</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Unread</p>
          <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Replied</p>
          <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({stats.unread})</TabsTrigger>
          <TabsTrigger value="replied">Replied ({stats.replied})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredInquiries.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No inquiries found</h3>
              <p className="text-muted-foreground">
                {activeTab === "all"
                  ? "You haven't received any inquiries yet."
                  : `No ${activeTab} inquiries.`}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <Card
                  key={inquiry.$id}
                  className={`p-4 cursor-pointer transition-colors ${!inquiry.is_read ? "border-primary/50 bg-primary/5" : ""}`}
                  onClick={() => !inquiry.is_read && handleMarkAsRead(inquiry.$id)}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback>
                        {(inquiry.inquirer_name || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {inquiry.inquirer_name || "Unknown User"}
                            </h3>
                            {getStatusBadge(inquiry.status, inquiry.is_read)}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {inquiry.propertyTitle}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTimeAgo(inquiry.$createdAt)}
                        </span>
                      </div>

                      <p className="text-sm mt-2 line-clamp-2">
                        {inquiry.message}
                      </p>

                      {/* Contact Info & Actions */}
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        {inquiry.inquirer_email && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {inquiry.inquirer_email}
                          </span>
                        )}
                        {inquiry.inquirer_phone && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {inquiry.inquirer_phone}
                          </span>
                        )}

                        <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedInquiry(inquiry)}
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Reply to {inquiry.inquirer_name || "User"}
                                </DialogTitle>
                                <DialogDescription>
                                  Regarding: {inquiry.propertyTitle}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 mt-4">
                                <div className="p-3 bg-muted rounded-lg">
                                  <p className="text-sm">{inquiry.message}</p>
                                </div>
                                <Textarea
                                  placeholder="Type your reply..."
                                  value={replyMessage}
                                  onChange={(e) =>
                                    setReplyMessage(e.target.value)
                                  }
                                  rows={4}
                                />
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedInquiry(null)}
                                    disabled={replying}
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleReply} disabled={replying || !replyMessage}>
                                    {replying ? (
                                      <Spinner className="h-4 w-4 mr-2" />
                                    ) : (
                                      <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {inquiry.inquirer_phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${inquiry.inquirer_phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
