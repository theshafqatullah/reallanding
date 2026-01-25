"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, Video, Phone, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { appointmentsService } from "@/services/appointments";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface ScheduleViewingDialogProps {
    propertyId: string;
    propertyTitle: string;
    agentId?: string;
    trigger?: React.ReactNode;
    className?: string;
}

const appointmentTypes = [
    { value: "in-person", label: "In-Person Viewing", icon: MapPin },
    { value: "virtual", label: "Virtual Tour", icon: Video },
    { value: "phone", label: "Phone Call", icon: Phone },
];

const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
];

export function ScheduleViewingDialog({
    propertyId,
    propertyTitle,
    agentId,
    trigger,
    className,
}: ScheduleViewingDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [date, setDate] = useState<Date>();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        appointmentType: "in-person",
        timeSlot: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date || !formData.timeSlot) {
            toast.error("Please select a date and time for your viewing");
            return;
        }

        if (!formData.name || !formData.email) {
            toast.error("Please fill in your name and email");
            return;
        }

        setIsSubmitting(true);

        try {
            // Check for existing appointment
            if (user) {
                const hasExisting = await appointmentsService.hasExistingAppointment(
                    propertyId,
                    user.$id
                );
                if (hasExisting) {
                    toast.error("You already have a pending appointment for this property");
                    setIsSubmitting(false);
                    return;
                }
            }

            await appointmentsService.create({
                property_id: propertyId,
                user_id: user?.$id || "guest",
                agent_id: agentId,
                appointment_type: formData.appointmentType,
                visitor_name: formData.name,
                visitor_email: formData.email,
                visitor_phone: formData.phone || undefined,
                notes: formData.message
                    ? `Preferred Date: ${format(date, "PPP")} at ${formData.timeSlot}\n\n${formData.message}`
                    : `Preferred Date: ${format(date, "PPP")} at ${formData.timeSlot}`,
                preferred_date: date.toISOString(),
                preferred_time: formData.timeSlot,
            });

            toast.success("Viewing request submitted successfully!", {
                description: "The property agent will contact you shortly to confirm.",
            });

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                appointmentType: "in-person",
                timeSlot: "",
                message: "",
            });
            setDate(undefined);
            setOpen(false);
        } catch (error) {
            console.error("Error scheduling viewing:", error);
            toast.error("Failed to schedule viewing. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Pre-fill user data if logged in
    React.useEffect(() => {
        if (user && open) {
            setFormData((prev) => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user, open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className={cn("gap-2", className)}>
                        <CalendarIcon className="h-4 w-4" />
                        Schedule Viewing
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Schedule a Property Viewing</DialogTitle>
                    <DialogDescription>
                        Book a viewing for <span className="font-medium">{propertyTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Appointment Type */}
                    <div className="space-y-2">
                        <Label>Viewing Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {appointmentTypes.map((type) => (
                                <Button
                                    key={type.value}
                                    type="button"
                                    variant={formData.appointmentType === type.value ? "default" : "outline"}
                                    className="h-auto py-3 flex flex-col items-center gap-1"
                                    onClick={() =>
                                        setFormData({ ...formData, appointmentType: type.value })
                                    }
                                >
                                    <type.icon className="h-4 w-4" />
                                    <span className="text-xs">{type.label}</span>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="space-y-2">
                        <Label>Preferred Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : "Select a date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                    }
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Time Slot */}
                    <div className="space-y-2">
                        <Label>Preferred Time</Label>
                        <Select
                            value={formData.timeSlot}
                            onValueChange={(value) =>
                                setFormData({ ...formData, timeSlot: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a time slot">
                                    {formData.timeSlot && (
                                        <span className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {formData.timeSlot}
                                        </span>
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map((time) => (
                                    <SelectItem key={time} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Additional Message (Optional)</Label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="Any specific questions or requests..."
                            value={formData.message}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    Schedule Viewing
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
