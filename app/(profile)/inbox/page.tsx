"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Inbox,
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
    Star,
    Archive,
    Trash2,
    ChevronLeft,
    Check,
    CheckCheck,
    ImageIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock conversations data
const mockConversations = [
    {
        id: "1",
        participant: {
            name: "Jennifer Martinez",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
            role: "Agent",
            isOnline: true,
        },
        lastMessage: {
            content: "I'd be happy to schedule a viewing for the Modern Luxury Villa. When would work best for you?",
            timestamp: "2026-01-20T10:30:00Z",
            isRead: false,
            sender: "them",
        },
        unreadCount: 2,
        property: "Modern Luxury Villa",
    },
    {
        id: "2",
        participant: {
            name: "David Thompson",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
            role: "Agent",
            isOnline: false,
        },
        lastMessage: {
            content: "The property documents have been sent to your email.",
            timestamp: "2026-01-19T16:45:00Z",
            isRead: true,
            sender: "them",
        },
        unreadCount: 0,
        property: "Downtown Penthouse",
    },
    {
        id: "3",
        participant: {
            name: "Sarah Williams",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
            role: "Agent",
            isOnline: true,
        },
        lastMessage: {
            content: "Thank you for your interest! Let me know if you have any questions.",
            timestamp: "2026-01-18T09:15:00Z",
            isRead: true,
            sender: "them",
        },
        unreadCount: 0,
        property: "Cozy Family Home",
    },
    {
        id: "4",
        participant: {
            name: "Michael Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            role: "Buyer",
            isOnline: false,
        },
        lastMessage: {
            content: "Is the Beachfront Condo still available?",
            timestamp: "2026-01-17T14:20:00Z",
            isRead: true,
            sender: "them",
        },
        unreadCount: 0,
        property: "Beachfront Condo",
    },
    {
        id: "5",
        participant: {
            name: "Emily Rodriguez",
            avatar: null,
            role: "Buyer",
            isOnline: false,
        },
        lastMessage: {
            content: "I'll review the offer and get back to you by tomorrow.",
            timestamp: "2026-01-15T11:00:00Z",
            isRead: true,
            sender: "me",
        },
        unreadCount: 0,
        property: "Mountain Retreat",
    },
];

// Mock messages for selected conversation
const mockMessages = [
    {
        id: "m1",
        content: "Hi! I'm interested in the Modern Luxury Villa listing. Is it still available?",
        timestamp: "2026-01-20T09:00:00Z",
        sender: "me",
        status: "read",
    },
    {
        id: "m2",
        content: "Hello! Yes, the property is still available. It's a stunning 5-bedroom villa with amazing views.",
        timestamp: "2026-01-20T09:15:00Z",
        sender: "them",
        status: "read",
    },
    {
        id: "m3",
        content: "That sounds great! Can I schedule a viewing?",
        timestamp: "2026-01-20T09:30:00Z",
        sender: "me",
        status: "read",
    },
    {
        id: "m4",
        content: "Absolutely! I have availability this week. What days work best for you?",
        timestamp: "2026-01-20T09:45:00Z",
        sender: "them",
        status: "read",
    },
    {
        id: "m5",
        content: "I'm free on Thursday afternoon or Friday morning.",
        timestamp: "2026-01-20T10:00:00Z",
        sender: "me",
        status: "read",
    },
    {
        id: "m6",
        content: "I'd be happy to schedule a viewing for the Modern Luxury Villa. When would work best for you?",
        timestamp: "2026-01-20T10:30:00Z",
        sender: "them",
        status: "delivered",
    },
];

function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
}

function formatMessageTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function InboxPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState(mockConversations);
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const selectedChat = conversations.find((c) => c.id === selectedConversation);

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            conv.property.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const newMsg = {
            id: `m${messages.length + 1}`,
            content: newMessage,
            timestamp: new Date().toISOString(),
            sender: "me",
            status: "sent",
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");

        // Update conversation's last message
        setConversations(
            conversations.map((conv) =>
                conv.id === selectedConversation
                    ? {
                        ...conv,
                        lastMessage: {
                            content: newMessage,
                            timestamp: new Date().toISOString(),
                            isRead: true,
                            sender: "me",
                        },
                    }
                    : conv
            )
        );
    };

    const handleSelectConversation = (id: string) => {
        setSelectedConversation(id);
        setShowMobileChat(true);
        // Mark as read
        setConversations(
            conversations.map((conv) =>
                conv.id === id
                    ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
                    : conv
            )
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
                <p className="text-muted-foreground">
                    {totalUnread > 0
                        ? `You have ${totalUnread} unread message${totalUnread > 1 ? "s" : ""}`
                        : "All messages read"}
                </p>
            </div>

            {/* Main Content */}
            <Card className="overflow-hidden">
                <div className="flex h-[calc(100vh-16rem)] min-h-[500px]">
                    {/* Conversations List */}
                    <div
                        className={cn(
                            "w-full md:w-80 lg:w-96 border-r flex flex-col",
                            showMobileChat && "hidden md:flex"
                        )}
                    >
                        {/* Search */}
                        <div className="p-4 border-b">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        {/* Conversations */}
                        <ScrollArea className="flex-1">
                            {filteredConversations.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No conversations found</p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {filteredConversations.map((conversation) => (
                                        <button
                                            key={conversation.id}
                                            onClick={() => handleSelectConversation(conversation.id)}
                                            className={cn(
                                                "w-full p-4 text-left hover:bg-muted/50 transition-colors",
                                                selectedConversation === conversation.id && "bg-muted",
                                                conversation.unreadCount > 0 && "bg-primary/5"
                                            )}
                                        >
                                            <div className="flex gap-3">
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12">
                                                        {conversation.participant.avatar ? (
                                                            <AvatarImage src={conversation.participant.avatar} />
                                                        ) : null}
                                                        <AvatarFallback>
                                                            {conversation.participant.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {conversation.participant.isOnline && (
                                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span
                                                            className={cn(
                                                                "font-medium truncate",
                                                                conversation.unreadCount > 0 && "font-semibold"
                                                            )}
                                                        >
                                                            {conversation.participant.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatTime(conversation.lastMessage.timestamp)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            {conversation.participant.role}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground truncate">
                                                            {conversation.property}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={cn(
                                                            "text-sm truncate mt-1",
                                                            conversation.unreadCount > 0
                                                                ? "text-foreground font-medium"
                                                                : "text-muted-foreground"
                                                        )}
                                                    >
                                                        {conversation.lastMessage.sender === "me" && "You: "}
                                                        {conversation.lastMessage.content}
                                                    </p>
                                                </div>
                                                {conversation.unreadCount > 0 && (
                                                    <Badge className="shrink-0 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                                        {conversation.unreadCount}
                                                    </Badge>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Chat Area */}
                    <div
                        className={cn(
                            "flex-1 flex flex-col",
                            !showMobileChat && "hidden md:flex"
                        )}
                    >
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden"
                                        onClick={() => setShowMobileChat(false)}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            {selectedChat.participant.avatar ? (
                                                <AvatarImage src={selectedChat.participant.avatar} />
                                            ) : null}
                                            <AvatarFallback>
                                                {selectedChat.participant.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        {selectedChat.participant.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{selectedChat.participant.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedChat.participant.isOnline ? (
                                                <span className="text-green-600">Online</span>
                                            ) : (
                                                "Offline"
                                            )}{" "}
                                            • {selectedChat.property}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Video className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Star className="h-4 w-4 mr-2" />
                                                    Star conversation
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Archive className="h-4 w-4 mr-2" />
                                                    Archive
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    <div className="space-y-4">
                                        {messages.map((message, index) => {
                                            const isMe = message.sender === "me";
                                            const showAvatar =
                                                !isMe &&
                                                (index === 0 || messages[index - 1].sender !== message.sender);

                                            return (
                                                <div
                                                    key={message.id}
                                                    className={cn("flex gap-2", isMe && "justify-end")}
                                                >
                                                    {!isMe && showAvatar && (
                                                        <Avatar className="h-8 w-8 mt-1">
                                                            {selectedChat.participant.avatar ? (
                                                                <AvatarImage src={selectedChat.participant.avatar} />
                                                            ) : null}
                                                            <AvatarFallback className="text-xs">
                                                                {selectedChat.participant.name
                                                                    .split(" ")
                                                                    .map((n) => n[0])
                                                                    .join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    {!isMe && !showAvatar && <div className="w-8" />}
                                                    <div
                                                        className={cn(
                                                            "max-w-[70%] rounded-2xl px-4 py-2",
                                                            isMe
                                                                ? "bg-primary text-primary-foreground rounded-br-md"
                                                                : "bg-muted rounded-bl-md"
                                                        )}
                                                    >
                                                        <p className="text-sm">{message.content}</p>
                                                        <div
                                                            className={cn(
                                                                "flex items-center gap-1 mt-1",
                                                                isMe ? "justify-end" : ""
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    "text-[10px]",
                                                                    isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                                                                )}
                                                            >
                                                                {formatMessageTime(message.timestamp)}
                                                            </span>
                                                            {isMe && (
                                                                <span className="text-primary-foreground/70">
                                                                    {message.status === "read" ? (
                                                                        <CheckCheck className="h-3 w-3" />
                                                                    ) : (
                                                                        <Check className="h-3 w-3" />
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>

                                {/* Message Input */}
                                <div className="p-4 border-t">
                                    <div className="flex items-end gap-2">
                                        <Button variant="ghost" size="icon" className="shrink-0">
                                            <Paperclip className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="shrink-0">
                                            <ImageIcon className="h-5 w-5" />
                                        </Button>
                                        <Textarea
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className="min-h-[44px] max-h-32 resize-none"
                                            rows={1}
                                        />
                                        <Button
                                            size="icon"
                                            className="shrink-0"
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <Send className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Inbox className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
                                    <p className="text-muted-foreground text-sm max-w-sm">
                                        Choose a conversation from the list to start messaging
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}
