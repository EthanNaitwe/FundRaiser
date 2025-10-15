import { useState } from "react";
import EventCard from "@/components/EventCard";
import { Event } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import eventImage1 from '@assets/stock_images/community_charity_ev_97ad4e3e.jpg';
import eventImage2 from '@assets/stock_images/medical_fundraising__0361a3be.jpg';
import eventImage3 from '@assets/stock_images/environmental_conser_a6d5db4e.jpg';
import eventImage4 from '@assets/stock_images/disaster_relief_emer_a62b03c5.jpg';

//todo: remove mock functionality
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Support Local School Library',
    description: 'Help us build a modern library for our community school to give children access to books and digital resources.',
    goalAmount: 10000,
    currentAmount: 6500,
    coverImage: eventImage1,
    location: 'Springfield Elementary',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isPublic: true,
    organizerName: 'Sarah Johnson',
    organizerEmail: 'sarah@example.com',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Medical Equipment for Community Clinic',
    description: 'Our local clinic needs updated medical equipment to serve the community better. Every donation helps save lives.',
    goalAmount: 25000,
    currentAmount: 18750,
    coverImage: eventImage2,
    location: 'Community Health Center',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isPublic: true,
    organizerName: 'Dr. Michael Chen',
    organizerEmail: 'michael@example.com',
    status: 'active',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Wildlife Conservation Project',
    description: 'Support our efforts to protect endangered species and preserve their natural habitats for future generations.',
    goalAmount: 15000,
    currentAmount: 15200,
    coverImage: eventImage3,
    location: 'National Park',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isPublic: true,
    organizerName: 'Emma Wildlife Foundation',
    organizerEmail: 'emma@example.com',
    status: 'completed',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Emergency Disaster Relief Fund',
    description: 'Provide immediate assistance to families affected by recent natural disasters. Your contribution provides shelter, food, and medical aid.',
    goalAmount: 50000,
    currentAmount: 28000,
    coverImage: eventImage4,
    location: 'Multiple Locations',
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    isPublic: true,
    organizerName: 'Disaster Relief Org',
    organizerEmail: 'relief@example.com',
    status: 'active',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  //todo: remove mock functionality - filter to show only public events
  const publicEvents = MOCK_EVENTS.filter(event => event.isPublic);
  
  const filteredEvents = publicEvents.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    setLocation(`/event/${id}`);
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/event/${id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share this link with potential contributors",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 to-background py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Make a Difference Today</h1>
            <p className="text-lg text-muted-foreground">
              Discover fundraising events and support causes that matter to you
            </p>
            <div className="relative max-w-md mx-auto mt-6">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">Public Fundraising Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={handleViewDetails}
              onShare={handleShare}
            />
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
