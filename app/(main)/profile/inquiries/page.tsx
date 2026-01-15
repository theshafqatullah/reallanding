"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// Mock inquiries data
const MOCK_INQUIRIES = [
  {
    id: "1",
    propertyId: "prop-1",
    propertyTitle: "Modern 3 Bedroom Apartment in DHA Phase 6",
    senderName: "Ahmed Khan",
    senderEmail: "ahmed@example.com",
    senderPhone: "+92 300 1234567",
    message: "I am interested in this property. Is it still available? I would like to schedule a visit this weekend if possible.",
    status: "unread",
    createdAt: "2026-01-14T10:30:00",
    type: "inquiry",
  },
  {
    id: "2",
    propertyId: "prop-2",
    propertyTitle: "Luxury Villa with Pool in Bahria Town",
    senderName: "Fatima Ali",
    senderEmail: "fatima@example.com",
    senderPhone: "+92 321 9876543",
    message: "What is the best price you can offer? I am a serious buyer and can close within 2 weeks.",
    status: "read",
    createdAt: "2026-01-13T15:45:00",
    type: "inquiry",
  },
  {
    id: "3",
    propertyId: "prop-1",
    propertyTitle: "Modern 3 Bedroom Apartment in DHA Phase 6",
    senderName: "Usman Malik",
    senderEmail: "usman@example.com",
    senderPhone: "+92 333 5551234",
    message: "Is the property available for rent? I am looking for a 1-year lease starting from March.",
    status: "replied",
    createdAt: "2026-01-12T09:15:00",
    type: "inquiry",
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "unread":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          New
        </Badge>
      );
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
  const [inquiries, setInquiries] = useState(MOCK_INQUIRIES);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<typeof MOCK_INQUIRIES[0] | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && inquiry.status === "unread") ||
      (activeTab === "replied" && inquiry.status === "replied");

    const matchesSearch =
      !searchQuery ||
      inquiry.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const stats = {
    total: inquiries.length,
    unread: inquiries.filter((i) => i.status === "unread").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
  };

  const handleReply = () => {
    if (!selectedInquiry || !replyMessage) return;

    setInquiries((prev) =>
      prev.map((i) =>
        i.id === selectedInquiry.id ? { ...i, status: "replied" } : i
      )
    );
    setReplyMessage("");
    setSelectedInquiry(null);
  };

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
                  key={inquiry.id}
                  className={`p-4 ${inquiry.status === "unread" ? "border-primary/50 bg-primary/5" : ""}`}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback>
                        {inquiry.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {inquiry.senderName}
                            </h3>
                            {getStatusBadge(inquiry.status)}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3" />
                            {inquiry.propertyTitle}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTimeAgo(inquiry.createdAt)}
                        </span>
                      </div>

                      <p className="text-sm mt-2 line-clamp-2">
                        {inquiry.message}
                      </p>

                      {/* Contact Info & Actions */}
                      <div className="flex flex-wrap items-center gap-4 mt-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {inquiry.senderEmail}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {inquiry.senderPhone}
                        </span>

                        <div className="flex gap-2 ml-auto">
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
                                  Reply to {inquiry.senderName}
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
                                  >
                                    Cancel
                                  </Button>
                                  <Button onClick={handleReply}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${inquiry.senderPhone}`}>
                              <Phone className="h-4 w-4" />
                            </a>
                          </Button>
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
