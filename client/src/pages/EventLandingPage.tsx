import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Share2, MapPin, Calendar, Copy, Check } from "lucide-react";
import ProgressBar from "@/components/ProgressBar";
import ContributionForm from "@/components/ContributionForm";
import ContributionList from "@/components/ContributionList";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Event } from "@shared/schema";
import eventImage1 from '@assets/stock_images/community_charity_ev_97ad4e3e.jpg';
import eventImage2 from '@assets/stock_images/medical_fundraising__0361a3be.jpg';
import eventImage3 from '@assets/stock_images/environmental_conser_a6d5db4e.jpg';
import eventImage4 from '@assets/stock_images/disaster_relief_emer_a62b03c5.jpg';

export default function EventLandingPage() {
  const [, params] = useRoute("/event/:id");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  //todo: remove mock functionality - This simulates fetching all events (including private)
  const MOCK_EVENTS: Event[] = [
    {
      id: '1',
      title: 'Support Local School Library',
      description: 'Help us build a modern library for our community school to give children access to books and digital resources. Our school serves over 500 students, many from underprivileged backgrounds. A well-stocked library with modern resources can transform their educational experience and open doors to endless opportunities.\n\nYour contribution will help us:\n• Purchase new books and digital resources\n• Set up computer workstations\n• Create comfortable reading spaces\n• Organize literacy programs',
      goalAmount: 10000,
      currentAmount: 6500,
      coverImage: eventImage1,
      location: 'Springfield Elementary School, 123 Main St',
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
      description: 'Our local clinic needs updated medical equipment to serve the community better. Every donation helps save lives and improve healthcare access for everyone in our community.\n\nFunds will be used for:\n• Modern diagnostic equipment\n• Patient monitoring systems\n• Emergency response tools\n• Staff training programs',
      goalAmount: 25000,
      currentAmount: 18750,
      coverImage: eventImage2,
      location: 'Community Health Center, Downtown',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isPublic: true,
      organizerName: 'Dr. Michael Chen',
      organizerEmail: 'michael@example.com',
      status: 'active',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      title: 'Private Family Fundraiser',
      description: 'This is a private fundraising campaign for our family. Thank you to everyone who has been invited to contribute.\n\nYour support during this difficult time means everything to us. We are grateful for the love and generosity of our community.',
      goalAmount: 5000,
      currentAmount: 2800,
      coverImage: eventImage3,
      location: null,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      isPublic: false,
      organizerName: 'The Smith Family',
      organizerEmail: 'smithfamily@example.com',
      status: 'active',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const eventId = params?.id;
  const mockEvent = MOCK_EVENTS.find(e => e.id === eventId);

  if (!mockEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const mockContributions = [
    {
      id: '1',
      eventId: mockEvent.id,
      donorName: 'John Smith',
      donorEmail: 'john@example.com',
      amount: 100,
      isAnonymous: false,
      isPledge: false,
      message: 'Happy to support this wonderful cause!',
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      eventId: mockEvent.id,
      donorName: 'Anonymous',
      donorEmail: 'anon@example.com',
      amount: 250,
      isAnonymous: true,
      isPledge: false,
      message: null,
      status: 'completed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share this link with potential contributors",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContribution = (data: any) => {
    toast({
      title: "Thank you for your contribution!",
      description: "Your support means the world to us.",
    });
  };

  const daysRemaining = mockEvent.deadline 
    ? Math.ceil((mockEvent.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={mockEvent.coverImage || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"}
          alt={mockEvent.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute top-6 right-6">
          <Button
            variant="outline"
            className="bg-background/80 backdrop-blur-sm"
            onClick={handleShare}
            data-testid="button-share"
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
            {copied ? 'Copied!' : 'Share'}
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">Active Campaign</Badge>
              {!mockEvent.isPublic && (
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-blue/50 text-blue">
                  Private Event
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{mockEvent.title}</h1>
            <div className="flex items-center gap-4 text-white/90">
              {mockEvent.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{mockEvent.location}</span>
                </div>
              )}
              {daysRemaining && daysRemaining > 0 && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{daysRemaining} days left</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <ProgressBar current={mockEvent.currentAmount} goal={mockEvent.goalAmount} className="mb-8" />
              
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">About This Campaign</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {mockEvent.description}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Event Location</h3>
                <div className="bg-muted/50 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Map integration placeholder</p>
                    <p className="text-sm font-medium">{mockEvent.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ContributionList contributions={mockContributions} />

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Organizer</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg">
                      {mockEvent.organizerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{mockEvent.organizerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {formatDistanceToNow(mockEvent.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <ContributionForm eventId={mockEvent.id} onSubmit={handleContribution} sticky />
          </div>
        </div>
      </div>
    </div>
  );
}
