import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EventFormProps {
  onSubmit?: (data: any) => void;
}

export default function EventForm({ onSubmit }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [isPublic, setIsPublic] = useState(true);
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description,
      goalAmount: parseInt(goalAmount),
      location,
      deadline,
      isPublic,
      organizerName,
      organizerEmail,
      coverImage,
      status: 'active',
    };
    console.log('Event created:', data);
    onSubmit?.(data);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Fundraising Event</CardTitle>
        <CardDescription>Share your cause and start raising funds</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your event a compelling title"
                required
                data-testid="input-title"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell your story and explain why this cause matters..."
                rows={6}
                required
                data-testid="input-description"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal">Fundraising Goal ($) *</Label>
                <Input
                  id="goal"
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="10000"
                  required
                  data-testid="input-goal"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Event location"
                    className="pl-9"
                    data-testid="input-location"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Campaign Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                    data-testid="button-deadline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Select deadline (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="cover-image">Cover Image URL</Label>
              <div className="space-y-2">
                <Input
                  id="cover-image"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  data-testid="input-cover-image"
                />
                {coverImage && (
                  <div className="relative h-48 rounded-md overflow-hidden">
                    <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizer-name">Your Name *</Label>
                <Input
                  id="organizer-name"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="Jane Smith"
                  required
                  data-testid="input-organizer-name"
                />
              </div>

              <div>
                <Label htmlFor="organizer-email">Your Email *</Label>
                <Input
                  id="organizer-email"
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  data-testid="input-organizer-email"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="space-y-0.5">
                <Label htmlFor="public" className="cursor-pointer">Make event public</Label>
                <p className="text-sm text-muted-foreground">
                  Public events appear in listings. Private events are only accessible via link.
                </p>
              </div>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                data-testid="switch-public"
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base" data-testid="button-submit">
            Create Event & Generate Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
