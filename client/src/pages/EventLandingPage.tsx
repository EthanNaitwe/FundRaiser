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
import eventImage from '@assets/stock_images/community_charity_ev_97ad4e3e.jpg';

export default function EventLandingPage() {
  const [, params] = useRoute("/event/:id");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  //todo: remove mock functionality
  const mockEvent = {
    id: params?.id || '1',
    title: 'Support Local School Library',
    description: 'Help us build a modern library for our community school to give children access to books and digital resources. Our school serves over 500 students, many from underprivileged backgrounds. A well-stocked library with modern resources can transform their educational experience and open doors to endless opportunities.\n\nYour contribution will help us:\n• Purchase new books and digital resources\n• Set up computer workstations\n• Create comfortable reading spaces\n• Organize literacy programs',
    goalAmount: 10000,
    currentAmount: 6500,
    coverImage: eventImage,
    location: 'Springfield Elementary School, 123 Main St',
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    isPublic: true,
    organizerName: 'Sarah Johnson',
    organizerEmail: 'sarah@example.com',
    status: 'active',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  };

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

  const daysRemaining = Math.ceil((mockEvent.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={mockEvent.coverImage}
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
            <Badge className="mb-4 bg-primary text-primary-foreground">Active Campaign</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{mockEvent.title}</h1>
            <div className="flex items-center gap-4 text-white/90">
              {mockEvent.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{mockEvent.location}</span>
                </div>
              )}
              {daysRemaining > 0 && (
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
