import { type User, type InsertUser, type ChatMessage, type InsertChatMessage, type Contact, type InsertContact, type PressArticle, type InsertPressArticle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Chat
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Contact
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;

  // Press
  getPressArticles(): Promise<PressArticle[]>;
  addPressArticle(article: InsertPressArticle): Promise<PressArticle>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatMessages: ChatMessage[];
  private contacts: Contact[];
  private pressArticles: PressArticle[];

  constructor() {
    this.users = new Map();
    this.chatMessages = [];
    this.contacts = [];
    this.pressArticles = [];
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Chat
  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.filter(msg => msg.sessionId === sessionId);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      ...message,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.chatMessages.push(chatMessage);
    return chatMessage;
  }

  // Contact
  async createContact(contact: InsertContact): Promise<Contact> {
    const newContact: Contact = {
      ...contact,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.contacts.push(newContact);
    return newContact;
  }

  async getContacts(): Promise<Contact[]> {
    return this.contacts;
  }

  // Press
  async getPressArticles(): Promise<PressArticle[]> {
    return this.pressArticles;
  }

  async addPressArticle(article: InsertPressArticle): Promise<PressArticle> {
    const newArticle: PressArticle = {
      ...article,
      id: randomUUID(),
      createdAt: new Date(),
      featured: article.featured ?? false,
    };
    this.pressArticles.push(newArticle);
    return newArticle;
  }
}

export const storage = new MemStorage();
