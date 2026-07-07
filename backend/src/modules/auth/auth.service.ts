import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  RegisterRequest,
  LoginRequest,
  User,
  AuthResponse,
  JwtPayload,
} from "./auth.types";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

/**
 * In-memory authentication service.
 */
export class AuthService {
  /**
   * Registers a new user.
   */
  public async register(request: RegisterRequest): Promise<User> {
    const normalizedEmail = request.email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(request.password, 10);

    const created = await prisma.user.create({
      data: {
        name: request.name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Map Prisma user to local `User` shape
    const user: User = {
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
    };

    return user;
  }

  /**
   * Generates a JWT token for a user.
   */
  private generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "development-secret", {
      expiresIn: "7d",
    });
  }

  /**
   * Authenticates an existing user.
   */
public async login(request: LoginRequest): Promise<AuthResponse> {
  console.log("Raw request:", request);

  const normalizedEmail = request.email.trim().toLowerCase();

  console.log("Normalized:", JSON.stringify(normalizedEmail));

  const users = await prisma.user.findMany();

  console.log(
    users.map((u) => ({
      email: JSON.stringify(u.email),
      equal: u.email.trim().toLowerCase() === normalizedEmail,
    })),
  );

  const user = users.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail,
  );

  console.log("Matched user:", user);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(
    request.password,
    user.password,
  );

  console.log("Password valid:", isPasswordValid);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  const token = this.generateToken(user);

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

  /**
   * Returns the authenticated user's profile.
   */
  public async getCurrentUser(userId: string): Promise<{
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  /**
   * Returns all registered users.
   * (Temporary helper until Prisma is integrated.)
   */
  public async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users.map((u: User) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      password: u.password,
    }));
  }
}

/**
 * Shared singleton instance.
 */
export const authService = new AuthService();
