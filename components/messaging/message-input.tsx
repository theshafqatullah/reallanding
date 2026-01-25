"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Send, Paperclip, Smile, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MessageInputProps {
    onSend: (content: string, attachments?: File[]) => void;
    placeholder?: string;
    disabled?: boolean;
    sending?: boolean;
    replyTo?: {
        id: string;
        content: string;
        senderName: string;
    } | null;
    onCancelReply?: () => void;
    className?: string;
    maxLength?: number;
}

export function MessageInput({
    onSend,
    placeholder = "Type a message...",
    disabled = false,
    sending = false,
    replyTo = null,
    onCancelReply,
    className,
    maxLength = 5000,
}: MessageInputProps) {
    const [message, setMessage] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (!message.trim() && attachments.length === 0) return;
        if (disabled || sending) return;

        onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
        setMessage("");
        setAttachments([]);
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setAttachments((prev) => [...prev, ...files].slice(0, 5)); // Max 5 attachments
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const canSend = (message.trim().length > 0 || attachments.length > 0) && !disabled;

    return (
        <div className={cn("border-t bg-background", className)}>
            {/* Reply preview */}
            {replyTo && (
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1 h-8 bg-primary rounded-full shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-primary">
                                Replying to {replyTo.senderName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {replyTo.content}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={onCancelReply}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Attachments preview */}
            {attachments.length > 0 && (
                <div className="flex gap-2 p-2 overflow-x-auto">
                    {attachments.map((file, index) => (
                        <div
                            key={index}
                            className="relative group shrink-0 w-20 h-20 rounded-lg border bg-muted overflow-hidden"
                        >
                            {file.type.startsWith("image/") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground text-center px-1 truncate">
                                        {file.name}
                                    </span>
                                </div>
                            )}
                            <button
                                className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeAttachment(index)}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Input area */}
            <div className="flex items-end gap-2 p-4">
                {/* Attachment button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || attachments.length >= 5}
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                {/* Text input */}
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled || sending}
                        className="min-h-[44px] max-h-[200px] resize-none pr-12"
                        rows={1}
                    />
                    {message.length > maxLength * 0.9 && (
                        <span className="absolute bottom-1 right-1 text-xs text-muted-foreground">
                            {message.length}/{maxLength}
                        </span>
                    )}
                </div>

                {/* Send button */}
                <Button
                    size="icon"
                    className="shrink-0"
                    onClick={handleSend}
                    disabled={!canSend || sending}
                >
                    {sending ? (
                        <Spinner className="h-4 w-4" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
