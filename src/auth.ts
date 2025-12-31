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
                    const admin = await prisma.admin.findUnique({
                        where: {
                            email: credentials.email as string,
                        },
                    });

                    if (!admin) {
                        console.log("Admin not found:", credentials.email);
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials.password as string,
                        admin.password
                    );

                    if (!passwordMatch) {
                        console.log("Password mismatch for:", credentials.email);
                        return null;
                    }

                    console.log("Login successful for:", admin.email);
                    return {
                        id: admin.id,
                        email: admin.email,
                        name: admin.name,
                    };
                } catch (error) {
                    console.error("Database error during authorization:", error);
                    // Critical for Vercel: Rethrow or return null based on how you want to handle it
                    // Returning null is safer for production to not reveal DB info, 
                    // but logging the error locally/on Vercel is key.
                    return null;
                }
            },
        }),
    ],
});
