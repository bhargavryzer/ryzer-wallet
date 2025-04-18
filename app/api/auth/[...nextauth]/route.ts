import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// This would typically connect to your database
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123", // In production, this would be hashed
    image: "/placeholder-user.jpg",
  },
];

// For Ryzer Guard verification (simulated)
const validGuardCodes = ["123456"];

// For passkey verification (simulated)
const validPasskeys = ["user@example.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "email-login",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = users.find((user) => user.email === credentials.email);
        
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
        
        return null;
      },
    }),
    CredentialsProvider({
      id: "ryzer-guard",
      name: "Ryzer Guard",
      credentials: {
        code: { label: "Guard Code", type: "text" },
      },
      async authorize(credentials: Record<"code", string> | undefined) {
        if (!credentials?.code) return null;

        // Verify the Ryzer Guard code
        if (validGuardCodes.includes(credentials.code)) {
          // In a real implementation, you would associate this with a user
          return {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
            image: "/placeholder-user.jpg",
          };
        }
        
        return null;
      },
    }),
    CredentialsProvider({
      id: "passkey",
      name: "Passkey",
      credentials: {
        passkey: { label: "Passkey", type: "text" },
      },
      async authorize(credentials: Record<"passkey", string> | undefined) {
        // In a real implementation, this would verify the WebAuthn assertion
        // For demo purposes, we're just simulating success
        return {
          id: "1",
          name: "Demo User",
          email: "user@example.com",
          image: "/placeholder-user.jpg",
        };
      },
    }),
    CredentialsProvider({
      id: "web3",
      name: "Web3",
      credentials: {
        address: { label: "Wallet Address", type: "text" },
      },
      async authorize(credentials: Record<"address", string> | undefined) {
        if (!credentials?.address) return null;
        
        // In a real implementation, you would verify the signature
        // For demo purposes, we're just simulating success with any address
        return {
          id: "1",
          name: "Web3 User",
          email: credentials.address.slice(0, 8) + "..." + credentials.address.slice(-6),
          image: "/placeholder-user.jpg",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-development-only",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };