'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, Terminal, Clock, Users, Zap } from "lucide-react";
import { getEventStatus, getStatusVariant } from "@/lib/eventStatus";
import { Event } from "@/types";
import { getEvents } from "@/app/actions/events";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import dayjs from "dayjs";

const EventsPreviewSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <section id="events" className="py-28 border-t border-border/60 relative">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
              <span>// 02. LIVE_SESSIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
              Upcoming <span className="text-cyan-400">Events</span>
            </h2>
          </div>
          <Link href="/register">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-wider border-border/80 hover:bg-secondary gap-2">
              View All Registrations <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {activeEvents && activeEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeEvents.map((event) => {
              const status = getEventStatus(event.eventDate);
              if (status == "ended") return null;
              const slotsLeft = event.maxSlots ? event.maxSlots - (event._count?.registrations || 0) : null;
              const isFull = event.maxSlots ? (event._count?.registrations || 0) >= event.maxSlots : false;

              return (
                <div 
                  key={event.id} 
                  className="bg-card/90 border border-border/80 rounded-2xl p-7 hover:border-cyan-500/50 transition-all duration-300 group relative flex flex-col justify-between shadow-xl"
                >
                  <div>
                    {/* Top Row: Title & Badges */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="font-mono text-[11px] text-cyan-400 uppercase tracking-widest block mb-1">
                          EVENT_ID: #{event.id.slice(-6).toUpperCase()}
                        </span>
                        <h3 className="font-mono text-xl font-bold text-foreground group-hover:text-cyan-300 transition-colors">
                          {event.name}
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-secondary/80 border-border">
                          {event.eventType}
                        </Badge>
                        <Badge variant={getStatusVariant(status)} className="font-mono text-[10px] uppercase tracking-wider">
                          {status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 font-sans leading-relaxed">
                      {event.description || "No description provided for this session."}
                    </p>
                  </div>

                  <div>
                    {/* Meta info: Date & Slots */}
                    <div className="grid grid-cols-2 gap-4 py-4 mb-6 border-t border-b border-border/40 font-mono text-xs">
                      {event.eventDate && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar size={14} className="text-cyan-400" />
                          <span>{dayjs(event.eventDate).format("DD MMM YY, hh:mm A")}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <Users size={14} className="text-amber-400" />
                        <span>{slotsLeft !== null ? `${slotsLeft} slots left` : "Unlimited slots"}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {isFull ? "[ CAPACITY FULL ]" : "[ REGISTRATION OPEN ]"}
                      </span>
                      <Link href="/register">
                        <Button 
                          size="sm" 
                          disabled={isFull}
                          className="font-mono text-xs gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5"
                        >
                          Register Now <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <EventItemSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="bg-card/50 border border-border rounded-2xl p-12 text-center">
            <Terminal size={32} className="mx-auto text-muted-foreground mb-4" />
            <p className="font-mono text-sm text-muted-foreground">[ NO ACTIVE EVENTS CURRENTLY SCHEDULED ]</p>
          </div>
        )}

      </div>
    </section>
  );
};

const EventItemSkeleton = () => (
  <div className="border border-border/80 rounded-2xl p-7 bg-card">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
    <div className="space-y-2 mb-6">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
    </div>
    <div className="flex justify-between items-center pt-4 border-t border-border/40">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-28" />
    </div>
  </div>
);

export default EventsPreviewSection;
