"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { usersService } from "@/services/users";
import { messagingService } from "@/services/messaging";
import { type Conversations, type Messages, type Users, UserType } from "@/types/appwrite";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
    Inbox,
    RefreshCw,
    Plus,
    ArrowLeft,
    MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    ConversationList,
    MessageThread,
    MessageInput,
    NewConversationDialog,
    transformConversation,
    transformMessage,
    type ConversationUI,
    type MessageUI,
} from "@/components/messaging";

export default function InboxClient() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    // User profile state
    const [userProfile, setUserProfile] = useState<Users | null>(null);
    const [userRole, setUserRole] = useState<"user" | "agent" | "agency" | "admin">("user");

    // Loading states
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Conversation state
    const [conversations, setConversations] = useState<ConversationUI[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageUI[]>([]);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

    // New conversation dialog
    const [newConversationOpen, setNewConversationOpen] = useState(false);

    // Reply state
    const [replyTo, setReplyTo] = useState<{
        id: string;
        content: string;
        senderName: string;
    } | null>(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/signin?redirect=/inbox");
        }
    }, [user, authLoading, router]);

    // Fetch user profile to determine role
    useEffect(() => {
        async function fetchProfile() {
            if (!user?.$id) return;

            try {
                const profile = await usersService.getByUserId(user.$id);
                setUserProfile(profile);

                if (profile) {
                    const role =
                        profile.user_type === UserType.AGENT
                            ? "agent"
                            : profile.user_type === UserType.AGENCY
                                ? "agency"
                                : "user";
                    setUserRole(role);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }

        fetchProfile();
    }, [user?.$id]);

    // Fetch conversations
    const fetchConversations = useCallback(async () => {
        if (!user?.$id) return;

        try {
            const response = await messagingService.getConversations(user.$id, {
                limit: 50,
            });

            if (response.conversations.length > 0) {
                setConversations(
                    response.conversations.map((c) => transformConversation(c, user.$id))
                );
            } else {
                setConversations([]);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setConversations([]);
        } finally {
            setLoading(false);
        }
    }, [user?.$id]);

    // Fetch messages for selected conversation
    const fetchMessages = useCallback(
        async (conversationId: string) => {
            if (!user?.$id) return;

            setLoadingMessages(true);
            try {
                const response = await messagingService.getMessages(conversationId, {
                    limit: 100,
                });

                setMessages(response.messages.map((m) => transformMessage(m, user.$id)));

                // Mark messages as read
                await messagingService.markAsRead(conversationId, user.$id);

                // Update conversation unread count locally
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === conversationId
                            ? { ...c, unreadCount: 0, lastMessage: { ...c.lastMessage, isRead: true } }
                            : c
                    )
                );
            } catch (error) {
                console.error("Error fetching messages:", error);
                setMessages([]);
            } finally {
                setLoadingMessages(false);
            }
        },
        [user?.$id]
    );

    // Initial load
    useEffect(() => {
        if (user?.$id) {
            fetchConversations();
        }
    }, [user?.$id, fetchConversations]);

    // Handle refresh
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchConversations();
        if (selectedConversationId) {
            await fetchMessages(selectedConversationId);
        }
        setRefreshing(false);
        toast.success("Inbox refreshed");
    };

    // Handle select conversation
    const handleSelectConversation = async (id: string) => {
        setSelectedConversationId(id);
        setShowMobileChat(true);
        setReplyTo(null);
        await fetchMessages(id);
    };

    // Handle send message
    const handleSendMessage = async (content: string) => {
        if (!selectedConversationId || !user?.$id || !content.trim()) return;

        setSendingMessage(true);

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: MessageUI = {
            id: tempId,
            content: content.trim(),
            timestamp: new Date().toISOString(),
            sender: "me",
            status: "sent",
            senderName: user.name || user.email?.split("@")[0] || "You",
            replyTo: replyTo
                ? { id: replyTo.id, preview: replyTo.content.substring(0, 50) }
                : undefined,
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setReplyTo(null);

        // Update conversation last message
        setConversations((prev) =>
            prev.map((c) =>
                c.id === selectedConversationId
                    ? {
                        ...c,
                        lastMessage: {
                            content: content.trim(),
                            timestamp: new Date().toISOString(),
                            isRead: true,
                            sender: "me" as const,
                        },
                    }
                    : c
            )
        );

        try {
            const userName =
                userProfile?.first_name && userProfile?.last_name
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : user.name || user.email?.split("@")[0] || "User";

            await messagingService.sendMessage({
                conversation_id: selectedConversationId,
                sender_id: user.$id,
                sender_name: userName,
                sender_role: userRole,
                sender_avatar_url: userProfile?.profile_image_url || undefined,
                content: content.trim(),
                reply_to_id: replyTo?.id,
                reply_to_preview: replyTo?.content.substring(0, 100),
            });

            // Fetch updated messages
            await fetchMessages(selectedConversationId);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            // Remove optimistic message on error
            setMessages((prev) => prev.filter((m) => m.id !== tempId));
        } finally {
            setSendingMessage(false);
        }
    };

    // Handle start new conversation
    const handleStartConversation = async (data: {
        recipientId: string;
        recipientName: string;
        recipientRole: "user" | "agent" | "agency";
        message: string;
        propertyId?: string;
        propertyTitle?: string;
        subject?: string;
        type: "inquiry" | "general";
    }) => {
        if (!user?.$id) return;

        try {
            const userName =
                userProfile?.first_name && userProfile?.last_name
                    ? `${userProfile.first_name} ${userProfile.last_name}`
                    : user.name || user.email?.split("@")[0] || "User";

            // Create or get existing conversation
            const conversation = await messagingService.getOrCreateConversation(
                user.$id,
                userName,
                userRole,
                data.recipientId,
                data.recipientName,
                data.propertyId,
                data.propertyTitle
            );

            // Send the first message
            await messagingService.sendMessage({
                conversation_id: conversation.$id,
                sender_id: user.$id,
                sender_name: userName,
                sender_role: userRole,
                sender_avatar_url: userProfile?.profile_image_url || undefined,
                content: data.message,
                property_id: data.propertyId,
                property_title: data.propertyTitle,
            });

            // Refresh conversations and select the new one
            await fetchConversations();
            handleSelectConversation(conversation.$id);

            toast.success("Message sent!");
        } catch (error) {
            console.error("Error starting conversation:", error);
            toast.error("Failed to start conversation");
            throw error;
        }
    };

    // Handle toggle star
    const handleToggleStar = async (id: string, starred: boolean) => {
        try {
            await messagingService.toggleStar(id, starred);
            setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isStarred: starred } : c))
            );
        } catch (error) {
            console.error("Error toggling star:", error);
            toast.error("Failed to update conversation");
        }
    };

    // Handle toggle mute
    const handleToggleMute = async (id: string, muted: boolean) => {
        try {
            await messagingService.toggleMute(id, muted);
            setConversations((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isMuted: muted } : c))
            );
        } catch (error) {
            console.error("Error toggling mute:", error);
            toast.error("Failed to update conversation");
        }
    };

    // Handle archive
    const handleArchive = async (id: string) => {
        try {
            await messagingService.archiveConversation(id);
            setConversations((prev) => prev.filter((c) => c.id !== id));
            if (selectedConversationId === id) {
                setSelectedConversationId(null);
                setMessages([]);
            }
            toast.success("Conversation archived");
        } catch (error) {
            console.error("Error archiving conversation:", error);
            toast.error("Failed to archive conversation");
        }
    };

    // Handle copy message
    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success("Message copied to clipboard");
    };

    // Handle reply
    const handleReplyMessage = (messageId: string) => {
        const message = messages.find((m) => m.id === messageId);
        if (message) {
            setReplyTo({
                id: message.id,
                content: message.content,
                senderName: message.sender === "me" ? "You" : message.senderName || "Them",
            });
        }
    };

    // Get selected conversation
    const selectedConversation =
        conversations.find((c) => c.id === selectedConversationId) || null;

    // Loading state
    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="h-[calc(100vh-12rem)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {showMobileChat && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setShowMobileChat(false)}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Inbox className="h-6 w-6" />
                            Inbox
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage your conversations and inquiries
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button size="sm" onClick={() => setNewConversationOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Message
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <Card className="h-full overflow-hidden">
                <div className="flex h-full">
                    {/* Conversation List */}
                    <div
                        className={cn(
                            "w-full lg:w-80 xl:w-96 border-r shrink-0",
                            showMobileChat && "hidden lg:block"
                        )}
                    >
                        <ConversationList
                            conversations={conversations}
                            selectedId={selectedConversationId}
                            onSelect={handleSelectConversation}
                            onToggleStar={handleToggleStar}
                            onToggleMute={handleToggleMute}
                            onArchive={handleArchive}
                            loading={loading}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            filter={filter}
                            onFilterChange={setFilter}
                            userRole={userRole}
                            emptyMessage="No conversations yet. Start a new message!"
                        />
                    </div>

                    {/* Message Thread */}
                    <div
                        className={cn(
                            "flex-1 flex flex-col min-w-0",
                            !showMobileChat && "hidden lg:flex"
                        )}
                    >
                        {selectedConversation ? (
                            <>
                                <MessageThread
                                    messages={messages}
                                    conversation={selectedConversation}
                                    loading={loadingMessages}
                                    currentUserId={user.$id}
                                    onCopyMessage={handleCopyMessage}
                                    onReplyMessage={handleReplyMessage}
                                    className="flex-1"
                                />
                                <MessageInput
                                    onSend={handleSendMessage}
                                    disabled={!selectedConversationId}
                                    sending={sendingMessage}
                                    replyTo={replyTo}
                                    onCancelReply={() => setReplyTo(null)}
                                    placeholder={`Message ${selectedConversation.participant.name}...`}
                                />
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="p-4 rounded-full bg-muted mb-4">
                                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
                                <p className="text-muted-foreground max-w-sm mb-4">
                                    Choose a conversation from the list or start a new one to begin messaging.
                                </p>
                                <Button onClick={() => setNewConversationOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Start New Conversation
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* New Conversation Dialog */}
            <NewConversationDialog
                open={newConversationOpen}
                onOpenChange={setNewConversationOpen}
                onStartConversation={handleStartConversation}
                currentUserId={user.$id}
                currentUserRole={userRole}
            />
        </div>
    );
}
