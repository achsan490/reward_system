import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Login attempt for:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                try {
                    const emailInput = (credentials.email as string).trim().toLowerCase();
                    const passwordInput = credentials.password as string;

                    const admin = await prisma.admin.findFirst({
                        where: {
                            email: {
                                equals: emailInput,
                                mode: "insensitive",
                            },
                        },
                    });

                    if (!admin) {
                        console.log("Admin account not found for email:", emailInput);
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        passwordInput,
                        admin.password
                    );

                    if (!passwordMatch) {
                        console.log("Password mismatch for admin:", emailInput);
                        return null;
                    }

                    return {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name,
                    };
                } catch (error) {
                    console.error("Login authorization error:", error);
                    return null;
                }
            },
        }),
    ],
});
