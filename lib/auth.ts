import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db" 

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "login", // Forces GitHub to check and prompt for account authorization every time
        },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email || `${profile.login}@users.noreply.github.com`, // Fallback if GitHub email is private
          image: profile.avatar_url, // Maps GitHub's avatar_url to user.image
        }
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture, // Maps Google's picture to user.image
        }
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Dynamically update the database user record with the active provider's name and image
      if (user && account && profile) {
        let updatedName = user.name
        let updatedImage = user.image

        if (account.provider === "github") {
          updatedName = profile.name || (profile as any).login
          updatedImage = (profile as any).avatar_url
        } else if (account.provider === "google") {
          updatedName = profile.name
          updatedImage = (profile as any).picture
        }

        if (user.id) {
          await db.user.update({
            where: { id: user.id },
            data: {
              name: updatedName,
              image: updatedImage,
            },
          })
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.image = user.image // Passes the updated database image into the active session
        session.user.name = user.name  // Passes the updated database name/username into the active session
      }
      return session
    },
  },
})