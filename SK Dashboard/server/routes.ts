import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssignmentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Assignment routes
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const validatedData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create assignment" });
      }
    }
  });

  app.patch("/api/assignments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertAssignmentSchema.partial().parse(req.body);
      const assignment = await storage.updateAssignment(id, validatedData);
      res.json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("not found")) {
        res.status(404).json({ message: "Assignment not found" });
      } else {
        res.status(500).json({ message: "Failed to update assignment" });
      }
    }
  });

  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAssignment(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete assignment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
