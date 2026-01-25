"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Check,
    CheckCheck,
    MoreVertical,
    Pencil,
    Reply,
    Trash2,
    Copy,
    ExternalLink,
    Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type MessageUI, type ConversationUI } from "./types";
import { formatMessageTime, formatDateHeader, getInitials } from "./utils";

export interface MessageThreadProps {
    messages: MessageUI[];
    conversation: ConversationUI | null;
    loading?: boolean;
    currentUserId: string;
    onEditMessage?: (messageId: string, content: string) => void;
    onDeleteMessage?: (messageId: string) => void;
    onReplyMessage?: (messageId: string) => void;
    onCopyMessage?: (content: string) => void;
    className?: string;
    emptyMessage?: string;
}

export function MessageThread({
    messages,
    conversation,
    loading = false,
    currentUserId,
    onEditMessage,
    onDeleteMessage,
    onReplyMessage,
    onCopyMessage,
    className,
    emptyMessage = "No messages yet. Start the conversation!",
}: MessageThreadProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Group messages by date
    const groupedMessages = groupMessagesByDate(messages);

    if (loading) {
        return (
            <div className={cn("flex items-center justify-center h-full", className)}>
                <Spinner className="h-6 w-6" />
            </div>
        );
    }

    if (!conversation) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center h-full text-center p-8",
                    className
                )}
            >
                <div className="p-4 rounded-full bg-muted mb-4">
                    <svg
                        className="h-8 w-8 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
                <p className="text-muted-foreground max-w-sm">
                    Choose a conversation from the list to view messages
                </p>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col h-full", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participant.avatar || undefined} />
                        <AvatarFallback>
                            {getInitials(conversation.participant.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{conversation.participant.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                                {conversation.participant.role}
                            </Badge>
                        </div>
                        {conversation.property && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                {conversation.property}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <p className="text-muted-foreground">{emptyMessage}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {groupedMessages.map(({ date, messages: dateMessages }) => (
                            <div key={date}>
                                {/* Date Header */}
                                <div className="flex items-center justify-center mb-4">
                                    <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                        {formatDateHeader(date)}
                                    </span>
                                </div>

                                {/* Messages for this date */}
                                <div className="space-y-3">
                                    {dateMessages.map((message, index) => (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            isOwnMessage={message.sender === "me"}
                                            showAvatar={
                                                message.sender === "them" &&
                                                (index === 0 ||
                                                    dateMessages[index - 1]?.sender !== "them")
                                            }
                                            participant={conversation.participant}
                                            onEdit={
                                                onEditMessage
                                                    ? () => onEditMessage(message.id, message.content)
                                                    : undefined
                                            }
                                            onDelete={
                                                onDeleteMessage
                                                    ? () => onDeleteMessage(message.id)
                                                    : undefined
                                            }
                                            onReply={
                                                onReplyMessage
                                                    ? () => onReplyMessage(message.id)
                                                    : undefined
                                            }
                                            onCopy={
                                                onCopyMessage
                                                    ? () => onCopyMessage(message.content)
                                                    : undefined
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

interface MessageBubbleProps {
    message: MessageUI;
    isOwnMessage: boolean;
    showAvatar: boolean;
    participant: ConversationUI["participant"];
    onEdit?: () => void;
    onDelete?: () => void;
    onReply?: () => void;
    onCopy?: () => void;
}

function MessageBubble({
    message,
    isOwnMessage,
    showAvatar,
    participant,
    onEdit,
    onDelete,
    onReply,
    onCopy,
}: MessageBubbleProps) {
    return (
        <div
            className={cn(
                "flex gap-2",
                isOwnMessage ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar (only for received messages) */}
            {!isOwnMessage && (
                <div className="w-8 shrink-0">
                    {showAvatar && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar || undefined} />
                            <AvatarFallback className="text-xs">
                                {getInitials(participant.name)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </div>
            )}

            {/* Message Content */}
            <div
                className={cn(
                    "group flex flex-col max-w-[70%]",
                    isOwnMessage ? "items-end" : "items-start"
                )}
            >
                {/* Reply preview */}
                {message.replyTo && (
                    <div
                        className={cn(
                            "text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-t-lg border-l-2",
                            isOwnMessage ? "border-primary" : "border-muted-foreground"
                        )}
                    >
                        <span className="font-medium">Reply:</span> {message.replyTo.preview}
                    </div>
                )}

                {/* Property Info Card */}
                {message.propertyInfo && (
                    <Link
                        href={`/p/${message.propertyInfo.id}`}
                        className={cn(
                            "flex items-center gap-2 p-2 rounded-lg border bg-muted/50 mb-1 hover:bg-muted transition-colors",
                            isOwnMessage ? "rounded-br-none" : "rounded-bl-none"
                        )}
                    >
                        {message.propertyInfo.image && (
                            <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                                <Image
                                    src={message.propertyInfo.image}
                                    alt={message.propertyInfo.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                                {message.propertyInfo.title}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                View property
                            </p>
                        </div>
                    </Link>
                )}

                {/* Message bubble */}
                <div
                    className={cn(
                        "relative px-4 py-2 rounded-2xl",
                        isOwnMessage
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted rounded-bl-md",
                        message.replyTo && "rounded-t-none"
                    )}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                    </p>

                    {/* Actions (show on hover) */}
                    <div
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity",
                            isOwnMessage ? "-left-8" : "-right-8"
                        )}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full bg-background shadow-sm"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isOwnMessage ? "start" : "end"}>
                                {onReply && (
                                    <DropdownMenuItem onClick={onReply}>
                                        <Reply className="h-4 w-4 mr-2" />
                                        Reply
                                    </DropdownMenuItem>
                                )}
                                {onCopy && (
                                    <DropdownMenuItem onClick={onCopy}>
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy
                                    </DropdownMenuItem>
                                )}
                                {isOwnMessage && onEdit && (
                                    <DropdownMenuItem onClick={onEdit}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </DropdownMenuItem>
                                )}
                                {isOwnMessage && onDelete && (
                                    <DropdownMenuItem onClick={onDelete} className="text-red-600">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Timestamp and status */}
                <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                        {formatMessageTime(message.timestamp)}
                    </span>
                    {message.isEdited && (
                        <span className="text-[10px] text-muted-foreground">(edited)</span>
                    )}
                    {isOwnMessage && (
                        <span className="text-muted-foreground">
                            {message.status === "read" ? (
                                <CheckCheck className="h-3 w-3 text-primary" />
                            ) : message.status === "delivered" ? (
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
}

// Helper function to group messages by date
function groupMessagesByDate(
    messages: MessageUI[]
): { date: string; messages: MessageUI[] }[] {
    const groups: Map<string, MessageUI[]> = new Map();

    messages.forEach((message) => {
        const date = new Date(message.timestamp).toDateString();
        if (!groups.has(date)) {
            groups.set(date, []);
        }
        groups.get(date)!.push(message);
    });

    return Array.from(groups.entries()).map(([date, msgs]) => ({
        date,
        messages: msgs,
    }));
}
