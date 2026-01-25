"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    Star,
    Archive,
    MoreVertical,
    Bell,
    BellOff,
    Trash2,
    Home,
    Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ConversationUI } from "./types";
import { formatRelativeTime, getInitials, truncateText } from "./utils";

export interface ConversationListProps {
    conversations: ConversationUI[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onToggleStar: (id: string, starred: boolean) => void;
    onToggleMute: (id: string, muted: boolean) => void;
    onArchive: (id: string) => void;
    loading?: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filter: "all" | "unread" | "starred";
    onFilterChange: (filter: "all" | "unread" | "starred") => void;
    className?: string;
    emptyMessage?: string;
    userRole?: "user" | "agent" | "agency" | "admin";
}

export function ConversationList({
    conversations,
    selectedId,
    onSelect,
    onToggleStar,
    onToggleMute,
    onArchive,
    loading = false,
    searchQuery,
    onSearchChange,
    filter,
    onFilterChange,
    className,
    emptyMessage = "No conversations yet",
    userRole = "user",
}: ConversationListProps) {
    // Filter conversations
    const filteredConversations = conversations.filter((conv) => {
        // Search filter
        const matchesSearch =
            conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (conv.property &&
                conv.property.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (conv.subject &&
                conv.subject.toLowerCase().includes(searchQuery.toLowerCase()));

        // Status filter
        if (filter === "unread") {
            return matchesSearch && conv.unreadCount > 0;
        } else if (filter === "starred") {
            return matchesSearch && conv.isStarred;
        }
        return matchesSearch;
    });

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Search and Filter */}
            <div className="p-4 border-b space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "unread" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange("unread")}
                    >
                        Unread
                    </Button>
                    <Button
                        variant={filter === "starred" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange("starred")}
                    >
                        <Star className="h-3 w-3 mr-1" />
                        Starred
                    </Button>
                </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner className="h-6 w-6" />
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="p-3 rounded-full bg-muted mb-3">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">
                            {searchQuery || filter !== "all"
                                ? "No matching conversations"
                                : emptyMessage}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredConversations.map((conversation) => (
                            <ConversationItem
                                key={conversation.id}
                                conversation={conversation}
                                isSelected={selectedId === conversation.id}
                                onSelect={() => onSelect(conversation.id)}
                                onToggleStar={() =>
                                    onToggleStar(conversation.id, !conversation.isStarred)
                                }
                                onToggleMute={() =>
                                    onToggleMute(conversation.id, !conversation.isMuted)
                                }
                                onArchive={() => onArchive(conversation.id)}
                                userRole={userRole}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

interface ConversationItemProps {
    conversation: ConversationUI;
    isSelected: boolean;
    onSelect: () => void;
    onToggleStar: () => void;
    onToggleMute: () => void;
    onArchive: () => void;
    userRole: "user" | "agent" | "agency" | "admin";
}

function ConversationItem({
    conversation,
    isSelected,
    onSelect,
    onToggleStar,
    onToggleMute,
    onArchive,
    userRole,
}: ConversationItemProps) {
    const { participant, lastMessage, unreadCount, property, isStarred, isMuted, type } =
        conversation;

    return (
        <div
            className={cn(
                "relative flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50",
                isSelected && "bg-muted",
                unreadCount > 0 && "bg-primary/5"
            )}
            onClick={onSelect}
        >
            {/* Avatar */}
            <div className="relative shrink-0">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={participant.avatar || undefined} />
                    <AvatarFallback>{getInitials(participant.name)}</AvatarFallback>
                </Avatar>
                {participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span
                            className={cn(
                                "font-medium truncate",
                                unreadCount > 0 && "font-semibold"
                            )}
                        >
                            {participant.name}
                        </span>
                        {isStarred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                        )}
                        {isMuted && (
                            <BellOff className="h-3 w-3 text-muted-foreground shrink-0" />
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(lastMessage.timestamp)}
                    </span>
                </div>

                {/* Role badge */}
                <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {participant.role}
                    </Badge>
                    {type === "inquiry" && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            Inquiry
                        </Badge>
                    )}
                </div>

                {/* Property info */}
                {property && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Home className="h-3 w-3" />
                        <span className="truncate">{truncateText(property, 30)}</span>
                    </div>
                )}

                {/* Last message */}
                <p
                    className={cn(
                        "text-sm truncate mt-1",
                        unreadCount > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                    )}
                >
                    {lastMessage.sender === "me" && "You: "}
                    {truncateText(lastMessage.content, 50)}
                </p>
            </div>

            {/* Unread badge & actions */}
            <div className="flex flex-col items-end gap-2 shrink-0">
                {unreadCount > 0 && (
                    <Badge className="h-5 min-w-[20px] justify-center px-1.5">
                        {unreadCount}
                    </Badge>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={onToggleStar}>
                            <Star
                                className={cn(
                                    "h-4 w-4 mr-2",
                                    isStarred && "fill-yellow-500 text-yellow-500"
                                )}
                            />
                            {isStarred ? "Remove Star" : "Add Star"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onToggleMute}>
                            {isMuted ? (
                                <>
                                    <Bell className="h-4 w-4 mr-2" />
                                    Unmute
                                </>
                            ) : (
                                <>
                                    <BellOff className="h-4 w-4 mr-2" />
                                    Mute
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onArchive}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
