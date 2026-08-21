import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  RegisterRequest,
  LoginRequest,
  User,
  AuthResponse,
  JwtPayload,
  ForgotPasswordRequest,
  ResetPasswordRequest,
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

  public async forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<{ message: string; resetToken?: string }> {
    const normalizedEmail = request.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Don't reveal whether an email exists
    if (!user) {
      return {
        message:
          "If an account with that email exists, a password reset link has been generated.",
      };
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Remove any previous reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    console.log("🔐 Password reset token:", resetToken);

    return {
      message:
        "If an account with that email exists, a password reset link has been generated.",
      resetToken,
    };
  }

  public async resetPassword(
    request: ResetPasswordRequest,
  ): Promise<{ message: string }> {
    const { token, password } = request;

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetToken) {
      throw new Error("Invalid or expired password reset token.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Token can only be used once
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });

    return {
      message: "Password reset successfully.",
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
