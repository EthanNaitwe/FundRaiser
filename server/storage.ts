import { type Event, type InsertEvent, type Contribution, type InsertContribution } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getEvent(id: string): Promise<Event | undefined>;
  getAllEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<Event>): Promise<Event | undefined>;
  
  getContribution(id: string): Promise<Contribution | undefined>;
  getContributionsByEvent(eventId: string): Promise<Contribution[]>;
  createContribution(contribution: InsertContribution): Promise<Contribution>;
}

export class MemStorage implements IStorage {
  private events: Map<string, Event>;
  private contributions: Map<string, Contribution>;

  constructor() {
    this.events = new Map();
    this.contributions = new Map();
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = {
      id,
      title: insertEvent.title,
      description: insertEvent.description,
      goalAmount: insertEvent.goalAmount,
      currentAmount: 0,
      coverImage: insertEvent.coverImage || null,
      location: insertEvent.location || null,
      deadline: insertEvent.deadline || null,
      isPublic: insertEvent.isPublic ?? true,
      organizerName: insertEvent.organizerName,
      organizerEmail: insertEvent.organizerEmail,
      status: insertEvent.status || 'active',
      createdAt: new Date(),
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updates: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updated = { ...event, ...updates };
    this.events.set(id, updated);
    return updated;
  }

  async getContribution(id: string): Promise<Contribution | undefined> {
    return this.contributions.get(id);
  }

  async getContributionsByEvent(eventId: string): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(
      (contribution) => contribution.eventId === eventId,
    );
  }

  async createContribution(insertContribution: InsertContribution): Promise<Contribution> {
    const id = randomUUID();
    const contribution: Contribution = {
      id,
      eventId: insertContribution.eventId,
      donorName: insertContribution.donorName,
      donorEmail: insertContribution.donorEmail,
      amount: insertContribution.amount,
      isAnonymous: insertContribution.isAnonymous ?? false,
      isPledge: insertContribution.isPledge ?? false,
      message: insertContribution.message || null,
      status: insertContribution.status || 'completed',
      createdAt: new Date(),
    };
    this.contributions.set(id, contribution);
    
    const event = this.events.get(insertContribution.eventId);
    if (event) {
      event.currentAmount += insertContribution.amount;
      this.events.set(event.id, event);
    }
    
    return contribution;
  }
}

export const storage = new MemStorage();
