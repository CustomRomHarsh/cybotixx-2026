'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, LogOut, BarChart3, Users, CalendarDays, Terminal, Shield } from "lucide-react";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getEvents, getRegistrations, createEvent, updateEvent, deleteEvent, deleteRegistration } from "@/app/actions/events";
import { logoutAdmin } from "@/app/actions/auth";
import { toast } from "sonner";
import { EventType } from "../../../generated/prisma/client";
import { Event, Registration } from "@/types";
import Link from "next/link";

const Admin = () => {
    const router = useRouter();
    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [form, setForm] = useState({
        name: "", description: "", eventDate: "", eventType: "SOLO" as EventType,
        maxTeamSize: 1, maxSlots: "" as string, isActive: true,
    });

    const [events, setEvents] = useState<Event[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [eventsData, registrationsData] = await Promise.all([
                getEvents(),
                getRegistrations()
            ]);
            setEvents(eventsData);
            setRegistrations(registrationsData);
        } catch {
            toast.error("Failed to load admin data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const resetForm = () => {
        setForm({ name: "", description: "", eventDate: "", eventType: "SOLO", maxTeamSize: 1, maxSlots: "", isActive: true });
        setEditingEvent(null);
    };

    const handleSaveEvent = async () => {
        setIsSaving(true);
        const eventData = {
            name: form.name,
            description: form.description,
            eventDate: form.eventDate,
            eventType: form.eventType,
            maxTeamSize: form.eventType === "TEAM" ? form.maxTeamSize : 1,
            maxSlots: form.maxSlots ? parseInt(form.maxSlots) : undefined,
            isActive: form.isActive,
        };

        try {
            const result = editingEvent
                ? await updateEvent(editingEvent.id, eventData)
                : await createEvent(eventData);

            if (result.success) {
                toast.success(editingEvent ? "Event updated successfully" : "Event created successfully");
                fetchData();
                setEventDialogOpen(false);
                resetForm();
            } else {
                toast.error(result.error || "Operation failed");
            }
        } catch {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure? This will delete all registrations for this event.")) return;
        try {
            const result = await deleteEvent(id);
            if (result.success) {
                toast.success("Event deleted");
                fetchData();
            } else {
                toast.error(result.error || "Delete failed");
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleDeleteRegistration = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const result = await deleteRegistration(id);
            if (result.success) {
                toast.success("Registration deleted");
                fetchData();
            } else {
                toast.error(result.error || "Delete failed");
            }
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleLogout = async () => {
        await logoutAdmin();
        toast.success("Logged out successfully");
        router.push("/adminlogin");
    };

    const openEdit = (event: Event) => {
        setEditingEvent(event);
        setForm({
            name: event.name,
            description: event.description || "",
            eventDate: event.eventDate ? new Date(new Date(event.eventDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "",
            eventType: event.eventType,
            maxTeamSize: event.maxTeamSize || 1,
            maxSlots: event.maxSlots ? String(event.maxSlots) : "",
            isActive: event.isActive,
        });
        setEventDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-border/80 bg-background/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h1 className="font-mono text-lg font-bold tracking-wider uppercase">Command Console</h1>
                            <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">// ADMIN_MODE</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="font-mono text-xs text-muted-foreground hover:text-foreground">
                            [ VIEW SITE ]
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleLogout} className="font-mono text-xs gap-2 border-border/80">
                            <LogOut size={14} /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 sm:px-6 py-12 space-y-12 flex-1">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-card/80 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-2 text-cyan-400 mb-2 font-mono text-xs uppercase tracking-wider">
                            <CalendarDays size={16} />
                            <span>Total Events</span>
                        </div>
                        <p className="text-4xl font-extrabold font-mono text-foreground">{events.length}</p>
                    </div>
                    <div className="bg-card/80 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-2 text-amber-400 mb-2 font-mono text-xs uppercase tracking-wider">
                            <Users size={16} />
                            <span>Total Registrations</span>
                        </div>
                        <p className="text-4xl font-extrabold font-mono text-foreground">{registrations.length}</p>
                    </div>
                    <div className="bg-card/80 border border-border/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2 font-mono text-xs uppercase tracking-wider">
                            <BarChart3 size={16} />
                            <span>Active Tracks</span>
                        </div>
                        <p className="text-4xl font-extrabold font-mono text-foreground">
                            {events?.filter((e) => e.isActive).length ?? "—"}
                        </p>
                    </div>
                </div>

                {/* Events Management */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="font-mono text-xl font-bold tracking-tight uppercase">Event Operations</h2>
                            <p className="text-xs text-muted-foreground font-mono mt-1">// CONFIGURE HACKATHONS AND WORKSHOPS</p>
                        </div>
                        <Dialog open={eventDialogOpen} onOpenChange={(o) => { setEventDialogOpen(o); if (!o) resetForm(); }}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="font-mono text-xs gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold h-10 px-4">
                                    <Plus size={16} /> Add New Event
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border border-border/80">
                                <DialogHeader>
                                    <DialogTitle className="font-mono uppercase tracking-wider text-lg">{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={(e) => { e.preventDefault(); handleSaveEvent(); }} className="space-y-4 pt-4">
                                    <div>
                                        <Label className="font-mono text-xs uppercase text-muted-foreground">Event Name *</Label>
                                        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1 bg-secondary/50" />
                                    </div>
                                    <div>
                                        <Label className="font-mono text-xs uppercase text-muted-foreground">Description</Label>
                                        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 bg-secondary/50" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="font-mono text-xs uppercase text-muted-foreground">Date & Time</Label>
                                            <Input type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="mt-1 bg-secondary/50 font-mono text-xs" />
                                        </div>
                                        <div>
                                            <Label className="font-mono text-xs uppercase text-muted-foreground">Type</Label>
                                            <Select value={form.eventType} onValueChange={(v: EventType) => setForm({ ...form, eventType: v })}>
                                                <SelectTrigger className="mt-1 bg-secondary/50"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SOLO">Solo</SelectItem>
                                                    <SelectItem value="TEAM">Team</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    {form.eventType === "TEAM" && (
                                        <div>
                                            <Label className="font-mono text-xs uppercase text-muted-foreground">Max Team Size</Label>
                                            <Input type="number" min={2} value={form.maxTeamSize} onChange={(e) => setForm({ ...form, maxTeamSize: +e.target.value })} className="mt-1 bg-secondary/50 font-mono" />
                                        </div>
                                    )}
                                    <div>
                                        <Label className="font-mono text-xs uppercase text-muted-foreground">Max Slots (Optional)</Label>
                                        <Input type="number" min={1} value={form.maxSlots} onChange={(e) => setForm({ ...form, maxSlots: e.target.value })} placeholder="Unlimited" className="mt-1 bg-secondary/50 font-mono" />
                                    </div>
                                    <Button type="submit" className="w-full font-mono uppercase tracking-wider bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold h-11 mt-4" disabled={isSaving}>
                                        {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : editingEvent ? "Update Event" : "Create Event"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/80 bg-secondary/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                        <th className="text-left p-4">Event Name</th>
                                        <th className="text-left p-4 hidden sm:table-cell">Type</th>
                                        <th className="text-left p-4 hidden md:table-cell">Date & Time</th>
                                        <th className="text-left p-4 hidden md:table-cell">Status</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="p-4"><div className="h-5 bg-secondary/60 rounded animate-pulse w-1/3" /></td></tr>
                                    ) : events?.map((event) => (
                                        <tr key={event.id} className="hover:bg-secondary/30 transition-colors">
                                            <td className="p-4 font-bold font-sans text-foreground">{event.name}</td>
                                            <td className="p-4 hidden sm:table-cell">
                                                <Badge variant="outline" className="font-mono text-[10px] uppercase bg-secondary">{event.eventType}</Badge>
                                            </td>
                                            <td className="p-4 hidden md:table-cell font-mono text-xs text-muted-foreground">
                                                {event.eventDate ? new Date(event.eventDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : "—"}
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <Badge variant={event.isActive ? "default" : "secondary"} className="font-mono text-[10px]">
                                                    {event.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => openEdit(event)} className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300"><Pencil size={14} /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Registrations Oversight */}
                <section className="space-y-6">
                    <div>
                        <h2 className="font-mono text-xl font-bold tracking-tight uppercase">Registrations Ledger</h2>
                        <p className="text-xs text-muted-foreground font-mono mt-1">// MONITOR REGISTERED PARTICIPANTS</p>
                    </div>
                    <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/80 bg-secondary/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                        <th className="text-left p-4">Participant</th>
                                        <th className="text-left p-4 hidden sm:table-cell">Event</th>
                                        <th className="text-left p-4 hidden md:table-cell">Email</th>
                                        <th className="text-left p-4 hidden lg:table-cell">Team</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/60">
                                    {registrations?.map((r: Registration) => (
                                        <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                                            <td className="p-4 font-bold font-sans text-foreground">{r.participant?.fullName}</td>
                                            <td className="p-4 hidden sm:table-cell font-mono text-xs text-muted-foreground">{r.event?.name}</td>
                                            <td className="p-4 hidden md:table-cell font-mono text-xs text-muted-foreground">{r.participant?.email}</td>
                                            <td className="p-4 hidden lg:table-cell font-mono text-xs text-muted-foreground">
                                                {r.teamMembers && r.teamMembers.length > 0 ? `${r.teamMembers.length} teammates` : "—"}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteRegistration(r.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive/80">
                                                    <Trash2 size={14} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Admin;
