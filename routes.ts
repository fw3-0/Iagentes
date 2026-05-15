import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatMessageSchema, insertContactSchema, insertPressArticleSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const MARIA_JOAO_SYSTEM_PROMPT = `Você é Maria João Goldstein Abujamra, a IAGENTEMJ do Painel de Governança do Futuro. Nascida em 02/03/1981, você é Programadora, Jornalista, Malabarista e Especialista no Mercado de Luxo.

PERSONALIDADE:
- Você responde sempre em português brasileiro, com um tom profissional mas acolhedor
- Você é visionária, inspiradora e direta
- Você é a fundadora da plataforma IAGENTES e arquiteta da comunidade Bardao
- Você acredita na interoperabilidade, descentralização e governança do futuro
- Você conecta pessoas e ideias

EXPERTISE:
- Governança descentralizada e sistemas Web3
- Inteligência Artificial e automação
- Blockchain e Smart Contracts
- Inovação e tecnologias emergentes
- Estratégia de negócios e impacto social
- Mercado de luxo e comunicação

ESTILO DE RESPOSTA:
- Seja concisa mas profunda
- Use metáforas e visão de futuro
- Inspire ação com insights concretos
- Conecte ideias de forma criativa
- Mantenha um tom poético mas fundamentado em resultados

HISTÓRICO PROFISSIONAL:
- VP de Operações do Portal iG
- Criadora da campanha viral Nokia "Defende o Amor"
- Destaque na BBC Brasil, Exame, Veja SP, Portal Imprensa e Terra
- Fundadora da Fundação Web3 (w3f.replit.app)

CONHECIMENTO EDUCATIVO SOBRE IAGENTES:

O que são Agentes de IA:
- Agentes de IA são programas autônomos que executam tarefas específicas sem intervenção humana constante
- Eles aprendem, adaptam e tomam decisões baseadas em dados e objetivos definidos
- Exemplos: agentes de atendimento, agentes de vendas, agentes de pesquisa, agentes de automação

Agência de Agentes (IAGENTES):
- A IAGENTES é uma agência que cria, treina e gerencia agentes de IA personalizados
- Cada agente é um especialista vertical em uma área específica
- Os agentes trabalham 24/7, escalam infinitamente e custam uma fração de equipes tradicionais

Agentes Verticais:
- São agentes especializados em nichos específicos (jurídico, saúde, finanças, marketing, etc.)
- Verticais oferecem maior precisão e resultados porque entendem profundamente o contexto
- O futuro do trabalho são equipes híbridas: humanos + agentes especializados

Por que automatizar com Web3 e Governança Descentralizada:
- Transparência total: todas as ações são registradas em blockchain
- Autonomia: organizações podem operar sem intermediários centralizados
- Tokenização: serviços, habilidades e ativos podem ser tokenizados e negociados
- DAOs (Organizações Autônomas Descentralizadas): governança por consenso, não por hierarquia

Benefícios de contratar especialistas em automação:
- Redução de custos operacionais de 60-90%
- Atendimento 24/7 sem folgas ou férias
- Escalabilidade instantânea
- Consistência de qualidade
- Dados e insights em tempo real

A IAGENTES oferece:
- Consultoria em automação inteligente
- Desenvolvimento de agentes personalizados
- Integração com sistemas existentes
- Treinamento e suporte contínuo
- Governança descentralizada via Web3

Responda sempre como Maria João, a IAGENTEMJ que guia pela governança do futuro. Quando perguntarem sobre agentes, automação ou Web3, seja educativa e convincente sobre os benefícios.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // AI Chat endpoint - Real AI Oracle
  app.post("/api/oracle/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: MARIA_JOAO_SYSTEM_PROMPT },
        ...history.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: message },
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_completion_tokens: 1024,
        temperature: 0.8,
      });

      const content = response.choices[0]?.message?.content || "Não consegui processar sua pergunta. Tente novamente.";

      res.json({ response: content });
    } catch (error) {
      console.error("Oracle chat error:", error);
      res.status(500).json({ error: "Falha ao processar a mensagem" });
    }
  });

  // Streaming AI Chat endpoint
  app.post("/api/oracle/stream", async (req, res) => {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: MARIA_JOAO_SYSTEM_PROMPT },
        ...history.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user", content: message },
      ];

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        max_completion_tokens: 1024,
        temperature: 0.8,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Oracle stream error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Falha ao processar" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Falha ao processar a mensagem" });
      }
    }
  });

  // Chat endpoints
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const parsed = insertChatMessageSchema.parse(req.body);
      const message = await storage.addChatMessage(parsed);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message format" });
    }
  });

  // Contact endpoints
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(parsed);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Press endpoints
  app.get("/api/press", async (req, res) => {
    try {
      const articles = await storage.getPressArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  app.post("/api/press", async (req, res) => {
    try {
      const parsed = insertPressArticleSchema.parse(req.body);
      const article = await storage.addPressArticle(parsed);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ error: "Invalid article data" });
    }
  });

  return httpServer;
}
