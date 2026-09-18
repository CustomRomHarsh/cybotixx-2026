'use client';
import { useState, Suspense } from "react";
import { useQueryState } from "nuqs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Terminal, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { getEvents, getRegistrations } from "@/app/actions/events";
import { Event, Registration, TeamMember } from "@/types";
import Link from "next/link";

const PAGE_SIZE = 10;

const RegistrationsContent = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [eventFilter, setEventFilter] = useQueryState("eventId", { defaultValue: "all" });
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [eventsData, registrationsData] = await Promise.all([
        getEvents(),
        getRegistrations(eventFilter)
      ]);
      setEvents(eventsData);
      setRegistrations(registrationsData);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [eventFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRegistrations = registrations.filter((reg: Registration) => {
    const participantName = reg.participant?.fullName || "";
    const participantEmail = reg.participant?.email || "";
    const teamName = reg.teamName || "";

    const matchesSearch = !search.trim() ||
      participantName.toLowerCase().includes(search.toLowerCase()) ||
      participantEmail.toLowerCase().includes(search.toLowerCase()) ||
      teamName.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const data = {
    rows: filteredRegistrations.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    total: filteredRegistrations.length
  };

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-cyan-400 transition-colors mb-6">
              <ArrowLeft size={14} /> BACK_TO_HOME
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-3">
              <Terminal size={12} />
              <span>// DIRECTORY_INDEX</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase mb-2">
              Participant <span className="text-cyan-400">Directory</span>
            </h1>
            <p className="text-muted-foreground text-sm font-sans">
              Search and filter confirmed registrations for Cybotixx 2026 events.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-card/60 border border-border/80 p-4 rounded-2xl backdrop-blur-md">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Search by participant name, email..."
                className="pl-10 h-11 bg-secondary/50 border-border/80 text-sm font-sans"
              />
            </div>
            <Select value={eventFilter} onValueChange={(v) => { setEventFilter(v); setPage(0); }}>
              <SelectTrigger className="w-full sm:w-60 h-11 bg-secondary/50 border-border/80 font-mono text-xs">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events?.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/80 backdrop-blur-md shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-secondary/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left p-4">Participant</th>
                    <th className="text-left p-4 hidden sm:table-cell">Event Track</th>
                    <th className="text-left p-4 hidden md:table-cell">Type</th>
                    <th className="text-left p-4">Team / Members</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={4} className="p-4"><div className="h-5 bg-secondary/60 rounded animate-pulse w-3/4" /></td>
                      </tr>
                    ))
                  ) : data?.rows && data.rows.length > 0 ? (
                    data.rows.map((r: Registration) => (
                      <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-foreground font-sans">{r.participant?.fullName}</div>
                          <div className="text-xs text-muted-foreground font-mono mt-0.5">{r.participant?.email}</div>
                          <div className="text-xs text-cyan-400 sm:hidden font-mono mt-1">{r.event?.name}</div>
                        </td>
                        <td className="p-4 hidden sm:table-cell font-mono text-xs text-muted-foreground">
                          {r.event?.name}
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-secondary">
                            {r.event?.eventType}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs font-mono">
                          {r.teamMembers && r.teamMembers.length > 0
                            ? r.teamMembers.map((m: TeamMember) => m.name).join(", ")
                            : "—"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-muted-foreground font-mono text-xs">
                        [ NO REGISTRATIONS FOUND MATCHING QUERY ]
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border/80 bg-secondary/20 font-mono text-xs text-muted-foreground">
                <span>Page {page + 1} of {totalPages} ({data?.total} total records)</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="h-8">
                    <ChevronLeft size={14} />
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="h-8">
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

const Registrations = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs text-cyan-400">LOADING_DIRECTORY...</div>}>
      <RegistrationsContent />
    </Suspense>
  );
};

export default Registrations;
