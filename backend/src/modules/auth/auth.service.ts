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
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/index.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
export class AuthService {
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

    const user: User = {
      id: created.id,
      name: created.name,
      email: created.email,
      password: created.password,
    };

    return user;
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "development-secret", {
      expiresIn: "7d",
    });
  }

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

export const authService = new AuthService();
