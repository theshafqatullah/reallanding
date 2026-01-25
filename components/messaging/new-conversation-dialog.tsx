"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, User, Building2, Home, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { usersService } from "@/services/users";
import { propertiesService } from "@/services/properties";
import { type Users, type Properties, UserType } from "@/types/appwrite";
import { getInitials } from "./utils";

export interface NewConversationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStartConversation: (data: {
        recipientId: string;
        recipientName: string;
        recipientRole: "user" | "agent" | "agency";
        message: string;
        propertyId?: string;
        propertyTitle?: string;
        subject?: string;
        type: "inquiry" | "general";
    }) => Promise<void>;
    currentUserId: string;
    currentUserRole: "user" | "agent" | "agency" | "admin";
    preselectedRecipient?: {
        id: string;
        name: string;
        role: "user" | "agent" | "agency";
        avatar?: string | null;
    } | null;
    preselectedProperty?: {
        id: string;
        title: string;
    } | null;
}

export function NewConversationDialog({
    open,
    onOpenChange,
    onStartConversation,
    currentUserId,
    currentUserRole,
    preselectedRecipient = null,
    preselectedProperty = null,
}: NewConversationDialogProps) {
    const [step, setStep] = useState<"recipient" | "message">("recipient");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Users[]>([]);
    const [selectedRecipient, setSelectedRecipient] = useState<{
        id: string;
        name: string;
        role: "user" | "agent" | "agency";
        avatar?: string | null;
    } | null>(preselectedRecipient);
    const [selectedProperty, setSelectedProperty] = useState<{
        id: string;
        title: string;
    } | null>(preselectedProperty);
    const [properties, setProperties] = useState<Properties[]>([]);
    const [loadingProperties, setLoadingProperties] = useState(false);
    const [message, setMessage] = useState("");
    const [subject, setSubject] = useState("");
    const [conversationType, setConversationType] = useState<"inquiry" | "general">(
        preselectedProperty ? "inquiry" : "general"
    );

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (open) {
            if (preselectedRecipient) {
                setSelectedRecipient(preselectedRecipient);
                setStep("message");
            } else {
                setStep("recipient");
                setSelectedRecipient(null);
            }
            if (preselectedProperty) {
                setSelectedProperty(preselectedProperty);
                setConversationType("inquiry");
            } else {
                setSelectedProperty(null);
            }
            setMessage("");
            setSubject("");
            setSearchQuery("");
            setSearchResults([]);
        }
    }, [open, preselectedRecipient, preselectedProperty]);

    // Search for recipients
    const searchRecipients = useCallback(async (query: string) => {
        if (!query.trim() || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            // Search for agents/agencies if user, or users if agent/agency
            const searchType =
                currentUserRole === "user"
                    ? undefined // Search all agents and agencies
                    : UserType.USER; // Search regular users

            const result = await usersService.getAgents({
                search: query,
                limit: 10,
                userType: searchType as UserType.AGENT | UserType.AGENCY | undefined,
            });

            // Filter out current user
            setSearchResults(result.agents.filter((u) => u.user_id !== currentUserId));
        } catch (error) {
            console.error("Error searching recipients:", error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    }, [currentUserId, currentUserRole]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                searchRecipients(searchQuery);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchRecipients]);

    // Fetch properties when needed
    const fetchProperties = useCallback(async () => {
        if (!selectedRecipient) return;

        setLoadingProperties(true);
        try {
            // Fetch properties owned by the selected recipient (agent/agency)
            const result = await propertiesService.getByOwnerId(selectedRecipient.id, {
                limit: 20,
            });
            setProperties(result.properties);
        } catch (error) {
            console.error("Error fetching properties:", error);
            setProperties([]);
        } finally {
            setLoadingProperties(false);
        }
    }, [selectedRecipient]);

    useEffect(() => {
        if (step === "message" && selectedRecipient && conversationType === "inquiry") {
            fetchProperties();
        }
    }, [step, selectedRecipient, conversationType, fetchProperties]);

    const handleSelectRecipient = (user: Users) => {
        const role =
            user.user_type === UserType.AGENT
                ? "agent"
                : user.user_type === UserType.AGENCY
                    ? "agency"
                    : "user";

        setSelectedRecipient({
            id: user.user_id,
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.username || user.email,
            role,
            avatar: user.profile_image_url,
        });
        setStep("message");
    };

    const handleStartConversation = async () => {
        if (!selectedRecipient || !message.trim()) return;

        setSending(true);
        try {
            await onStartConversation({
                recipientId: selectedRecipient.id,
                recipientName: selectedRecipient.name,
                recipientRole: selectedRecipient.role,
                message: message.trim(),
                propertyId: selectedProperty?.id,
                propertyTitle: selectedProperty?.title,
                subject: subject.trim() || undefined,
                type: conversationType,
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error starting conversation:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {step === "recipient" ? "New Conversation" : "Send Message"}
                    </DialogTitle>
                    <DialogDescription>
                        {step === "recipient"
                            ? "Search for an agent, agency, or user to start a conversation."
                            : `Send a message to ${selectedRecipient?.name}`}
                    </DialogDescription>
                </DialogHeader>

                {step === "recipient" ? (
                    <div className="space-y-4">
                        {/* Search input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Search results */}
                        <ScrollArea className="h-[300px] border rounded-lg">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Spinner className="h-6 w-6" />
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                                    <User className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        {searchQuery
                                            ? "No users found. Try a different search."
                                            : "Start typing to search for users"}
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {searchResults.map((user) => (
                                        <button
                                            key={user.$id}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                                            onClick={() => handleSelectRecipient(user)}
                                        >
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.profile_image_url || undefined} />
                                                <AvatarFallback>
                                                    {getInitials(
                                                        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                                                        user.username ||
                                                        user.email
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {`${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                                                        user.username ||
                                                        user.email}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {user.user_type === UserType.AGENT
                                                            ? "Agent"
                                                            : user.user_type === UserType.AGENCY
                                                                ? "Agency"
                                                                : "User"}
                                                    </Badge>
                                                    {user.company_name && (
                                                        <span className="text-xs text-muted-foreground truncate">
                                                            {user.company_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Selected recipient */}
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedRecipient?.avatar || undefined} />
                                <AvatarFallback>
                                    {selectedRecipient ? getInitials(selectedRecipient.name) : "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{selectedRecipient?.name}</p>
                                <Badge variant="secondary" className="text-xs capitalize">
                                    {selectedRecipient?.role}
                                </Badge>
                            </div>
                            {!preselectedRecipient && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setSelectedRecipient(null);
                                        setStep("recipient");
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        {/* Conversation type */}
                        <div className="space-y-2">
                            <Label>Conversation Type</Label>
                            <Select
                                value={conversationType}
                                onValueChange={(v) => setConversationType(v as "inquiry" | "general")}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4" />
                                            General Message
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inquiry">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4" />
                                            Property Inquiry
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Property selection (for inquiries) */}
                        {conversationType === "inquiry" && (
                            <div className="space-y-2">
                                <Label>Property (Optional)</Label>
                                {loadingProperties ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Spinner className="h-5 w-5" />
                                    </div>
                                ) : (
                                    <Select
                                        value={selectedProperty?.id || ""}
                                        onValueChange={(v) => {
                                            const prop = properties.find((p) => p.$id === v);
                                            if (prop) {
                                                setSelectedProperty({ id: prop.$id, title: prop.title });
                                            } else {
                                                setSelectedProperty(null);
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a property" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {properties.map((prop) => (
                                                <SelectItem key={prop.$id} value={prop.$id}>
                                                    {prop.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        )}

                        {/* Subject */}
                        <div className="space-y-2">
                            <Label>Subject (Optional)</Label>
                            <Input
                                placeholder="Enter a subject..."
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                maxLength={100}
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label>Message</Label>
                            <Textarea
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                maxLength={2000}
                            />
                            <p className="text-xs text-muted-foreground text-right">
                                {message.length}/2000
                            </p>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === "message" && !preselectedRecipient && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSelectedRecipient(null);
                                setStep("recipient");
                            }}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={step === "recipient" ? () => onOpenChange(false) : handleStartConversation}
                        disabled={step === "message" && (!message.trim() || sending)}
                    >
                        {step === "recipient" ? (
                            "Cancel"
                        ) : sending ? (
                            <>
                                <Spinner className="h-4 w-4 mr-2" />
                                Sending...
                            </>
                        ) : (
                            "Send Message"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
