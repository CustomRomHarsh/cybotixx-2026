'use client';
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, Terminal, CheckCircle2, AlertCircle, X, Users, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { getEventStatus, getStatusVariant } from "@/lib/eventStatus";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { getEvents, registerParticipant } from "@/app/actions/events";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Event } from "@/types";
import dayjs from "dayjs";
import Link from "next/link";

const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

const Register = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [teamData, setTeamData] = useState<Record<string, { members: string[] }>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog State
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: ""
  });

  const fetchEventsData = useCallback(async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  const activeEvents = events?.filter((e) => getEventStatus(e.eventDate) !== "ended") || [];

  const isEventFull = (event: Event) => {
    if (!event.maxSlots) return false;
    return (event._count?.registrations || 0) >= event.maxSlots;
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        const newTeam = { ...teamData };
        delete newTeam[eventId];
        setTeamData(newTeam);
        return prev.filter((id) => id !== eventId);
      }
      const event = events?.find((e: Event) => e.id === eventId);
      if (event?.eventType === "TEAM") {
        setTeamData((prev) => ({
          ...prev,
          [eventId]: {
            members: Array((event.maxTeamSize || 2) - 1).fill(""),
          },
        }));
      }
      return [...prev, eventId];
    });
  };

  const updateMember = (eventId: string, idx: number, name: string) => {
    setTeamData((prev) => {
      const members = [...prev[eventId].members];
      members[idx] = name;
      return { ...prev, [eventId]: { ...prev[eventId], members } };
    });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Name is required";
    if (!email.trim() || !z.string().email().safeParse(email).success) errs.email = "Valid email required";
    if (!phone.trim() || !phoneRegex.test(phone)) errs.phone = "Valid phone required";
    if (selectedEvents.length === 0) errs.events = "Select at least one event";

    for (const eventId of selectedEvents) {
      const event = events?.find((e: Event) => e.id === eventId);
      if (event?.eventType === "TEAM") {
        const td = teamData[eventId];
        td?.members.forEach((m, i) => {
          if (!m.trim()) errs[`member_${eventId}_${i}`] = "Member name required";
        });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await registerParticipant({
        fullName,
        email,
        phone,
        selectedEvents,
        teamData
      });

      if (result.success) {
        setFeedbackDialog({
          open: true,
          type: "success",
          message: "Registration successful! Confirmation dispatched to your inbox."
        });
        setFullName("");
        setEmail("");
        setPhone("");
        setSelectedEvents([]);
        setTeamData({});
        setErrors({});
      } else {
        setFeedbackDialog({
          open: true,
          type: "error",
          message: result.error || "Registration failed. Please try again."
        });
      }
    } catch {
      setFeedbackDialog({
        open: true,
        type: "error",
        message: "An unexpected error occurred. Please check your connection."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-cyan-400 transition-colors mb-6">
              <ArrowLeft size={14} /> BACK_TO_HOME
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-3">
              <Terminal size={12} />
              <span>// REGISTRATION_PROTOCOL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase mb-2">
              Secure Your <span className="text-cyan-400">Slot</span>
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Enter your credentials and select your tracks to participate in Cybotixx 2026.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-card/80 border border-border/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            
            {/* Personal Info */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 border-b border-border/60 pb-3 flex items-center gap-2">
                <span>01.</span> OPERATOR_CREDENTIALS
              </h2>
              
              <div>
                <Label htmlFor="fullName" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Full Name *</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  placeholder="John Doe" 
                  className="mt-1.5 bg-secondary/50 border-border/80 font-sans h-11" 
                />
                {errors.fullName && <p className="text-destructive font-mono text-xs mt-1.5">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="john@example.com" 
                    className="mt-1.5 bg-secondary/50 border-border/80 font-sans h-11" 
                  />
                  {errors.email && <p className="text-destructive font-mono text-xs mt-1.5">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+91 9876543210" 
                    className="mt-1.5 bg-secondary/50 border-border/80 font-sans h-11" 
                  />
                  {errors.phone && <p className="text-destructive font-mono text-xs mt-1.5">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Event Selection */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <span>02.</span> SELECT_EVENTS
                </h2>
                {errors.events && <p className="text-destructive font-mono text-xs">{errors.events}</p>}
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-border/60 rounded-xl p-4 animate-pulse bg-secondary/30">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                      <div className="h-3 bg-muted rounded w-2/3" />
                    </div>
                  ))}
                </div>
              ) : activeEvents.length > 0 ? (
                <div className="space-y-3">
                  {activeEvents.map((event) => {
                    const selected = selectedEvents.includes(event.id);
                    const status = getEventStatus(event.eventDate);
                    const full = isEventFull(event);
                    const disabled = full;
                    const spotsLeft = event.maxSlots ? event.maxSlots - (event._count?.registrations || 0) : null;
                    const formattedDate = dayjs(event.eventDate).format("DD MMM YY, hh:mm A");

                    return (
                      <div 
                        key={event.id} 
                        className={`border rounded-xl p-5 transition-all duration-200 ${
                          disabled ? "opacity-50 bg-secondary/20" : ""
                        } ${selected ? "bg-cyan-500/5 border-cyan-500/50 shadow-lg shadow-cyan-950/20" : "bg-secondary/30 border-border/80 hover:border-border"}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <Checkbox
                            id={event.id}
                            checked={selected}
                            onCheckedChange={() => toggleEvent(event.id)}
                            className="mt-1"
                            disabled={disabled}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                              <label htmlFor={event.id} className={`font-mono text-sm font-bold text-foreground ${disabled ? "" : "cursor-pointer hover:text-cyan-400"}`}>
                                {event.name}
                              </label>
                              <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-secondary">
                                {event.eventType}
                              </Badge>
                              <Badge variant={getStatusVariant(status)} className="font-mono text-[10px] uppercase tracking-wider">
                                {status}
                              </Badge>
                              {full && (
                                <Badge variant="destructive" className="font-mono text-[10px] uppercase tracking-wider">
                                  Full
                                </Badge>
                              )}
                            </div>

                            {event.description && (
                              <p className="text-xs text-muted-foreground font-sans leading-relaxed mb-3">{event.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                              {event.eventDate && (
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={12} className="text-cyan-400" />
                                  <span>{formattedDate}</span>
                                </div>
                              )}
                              {spotsLeft !== null && !full && (
                                <span className="text-emerald-400">● {spotsLeft} slots remaining</span>
                              )}
                            </div>

                            {/* Team dynamic input fields */}
                            {selected && event.eventType === "TEAM" && teamData[event.id] && (
                              <div className="mt-4 pt-4 border-t border-border/60 space-y-3">
                                <p className="font-mono text-xs text-cyan-400">
                                  // TEAM_MEMBERS (Leader: {fullName || "You"})
                                </p>
                                {teamData[event.id].members.map((m, i) => (
                                  <div key={i}>
                                    <Label className="font-mono text-[11px] text-muted-foreground">Member {i + 2} Name *</Label>
                                    <Input
                                      value={m}
                                      onChange={(e) => updateMember(event.id, i, e.target.value)}
                                      placeholder={`Teammate ${i + 2} Full Name`}
                                      className="mt-1 bg-background border-border/80 h-9 text-sm"
                                    />
                                    {errors[`member_${event.id}_${i}`] && (
                                      <p className="text-destructive font-mono text-xs mt-1">{errors[`member_${event.id}_${i}`]}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground font-mono text-xs">[ NO EVENTS AVAILABLE FOR REGISTRATION ]</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full font-mono uppercase tracking-wider h-12 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold glow-cyan transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> PROCESSING_REGISTRATION...
                </>
              ) : (
                "SUBMIT REGISTRATION"
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialog.open}
        onOpenChange={(open) => setFeedbackDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md border border-border/80 p-0 overflow-hidden bg-card">
          <div className={`h-2 w-full ${feedbackDialog.type === "success" ? "bg-cyan-400" : "bg-destructive"}`} />
          <div className="p-8 pb-10">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-3 rounded-2xl ${feedbackDialog.type === "success" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
                {feedbackDialog.type === "success" ? (
                  <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
                ) : (
                  <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
                )}
              </div>

              <div className="space-y-2">
                <DialogTitle className="font-mono text-xl font-bold tracking-tight uppercase">
                  {feedbackDialog.type === "success" ? "Registration Confirmed" : "Registration Failed"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm font-sans max-w-xs">
                  {feedbackDialog.message}
                </DialogDescription>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {feedbackDialog.type === "success" ? (
                <>
                  <Button
                    className="w-full font-mono uppercase tracking-widest text-xs h-11 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                    onClick={() => router.push("/")}
                  >
                    Return to Home
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-mono uppercase tracking-widest text-xs h-11 border-border"
                    onClick={() => {
                      const filterEvent = selectedEvents.length === 1 ? selectedEvents[0] : "all";
                      router.push(`/registrations?eventId=${filterEvent}`);
                    }}
                  >
                    View Directory
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full font-mono uppercase tracking-widest text-xs h-11 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={() => setFeedbackDialog({ ...feedbackDialog, open: false })}
                >
                  <X className="w-3 h-3 mr-2" /> Try Again
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
