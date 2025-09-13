import { users } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import NextAuth, {
  Account,
  getServerSession,
  NextAuthOptions,
  Profile,
  User,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.debug("NextAuth Debug:", code, metadata);
    },
  },
  // cookies: {
  //   sessionToken: {
  //     name: "s3c_tkn_a9f4",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //       maxAge: 1 * 24 * 60 * 60
  //     },
  //   },
  //   csrfToken: {
  //     name: "c5r_tkn_d7b2",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "strict",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   callbackUrl: {
  //     name: "cb_url_f8k1",
  //     options: {
  //       httpOnly: false,
  //       sameSite: "strict",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: { params: { scope: "identify email" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await db.query.users.findFirst({
            columns: { id: true, Name: true, Hash: true, Email: true, Access: true, DiscordID: true, DiscordAvatar: true },
            where: eq(users.Name, credentials?.username ?? ""),
          });

          if (!user) {
            throw new Error("No user found with this username");
          }

          const isValidPassword = await compare(
            credentials?.password ?? "",
            user.Hash
          );
          if (!isValidPassword) throw new Error("Invalid password");

          return {
            id: String(user.id),
            Name: user.Name,
            Email: user.Email,
            Access: user.Access,
            Avatar: `${user.DiscordID != null ? `https://cdn.discordapp.com/avatars/${user.DiscordID}/${user.DiscordAvatar}.png` : "/assets/images/default-avatar.jpg"}`,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account?: Account | null;
      profile?: Profile | undefined;
    }) {
      if (account?.provider === "discord") {
        const session = await getServerSession(authOptions);

        if (session) {
          const user = await db.query.users.findFirst({
            where: eq(users.id, Number(session.user.id) || -1),
          });

          if (!user) {
            return "/account?error=User not found. Please connect your Discord account.";
          }

          if (user.DiscordID != null) {
            return "/account?error=You already have a Discord account linked.";
          }

          await db
            .transaction(async (tx) => {
              await tx
                .update(users)
                .set({
                  DiscordID: BigInt(profile?.id ?? -1),
                  DiscordAvatar: profile?.avatar ?? null,
                })
                .where(eq(users.id, user.id));
            })
            .catch((err) => {
              return "/account?error=Error connecting Discord account";
            });
        } else {
          const user = await db.query.users.findFirst({
            where: eq(users.DiscordID, BigInt(profile?.id ?? 0)),
          });

          if (!user) {
            return "/login?error=User not found. Please connect your Discord account.";
          }
        }
      }

      return true;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: JWT;
      user: User | undefined;
      account: Account | null;
      profile?: Profile | undefined;
    }) {
      // console.log(`JWT CALLBACK`);
      // console.log(`TOKEN: ${JSON.stringify(token)}`);
      // console.log(`USER: ${JSON.stringify(user)}`);
      // console.log(`ACCOUNT: ${JSON.stringify(account)}`);
      // console.log(`PROFILE: ${JSON.stringify(profile)}`);

      const fetchUser = async (where: any) => {
        return await db.query.users.findFirst({
          columns: { id: true, Name: true, Email: true, Access: true, DiscordID: true, DiscordAvatar: true },
          where,
        });
      };

      let dbUser: any;

      if (account?.provider === "credentials") {
        dbUser = await fetchUser(eq(users.id, Number(user?.id || -1)));
      } else if (account?.provider === "discord") {
        dbUser = await fetchUser(eq(users.DiscordID, BigInt(profile?.id ?? 0)));
      } else {
        dbUser = await fetchUser(
          eq(users.id, Number((token.user as { id: string }).id))
        );
      }

      if (dbUser) {
        token.user = {
          id: String(dbUser.id),
          Name: dbUser.Name,
          Email: dbUser.Email,
          Access: dbUser.Access,
          Avatar: `${dbUser.DiscordID != null ? `https://cdn.discordapp.com/avatars/${dbUser.DiscordID}/${dbUser.DiscordAvatar}.png` : "/assets/images/default-avatar.jpg"}`,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      return session;
    },
  },
  // cookies: {
  //   sessionToken: {
  //     name:
  //       process.env.NODE_ENV === "production"
  //         ? "__Secure-s3c_tkn_a9f4" // prefix required by browsers if `secure: true`
  //         : "s3c_tkn_a9f4",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   csrfToken: {
  //     name: "c5r_tkn_d7b2",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "strict",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   callbackUrl: {
  //     name: "cb_url_f8k1",
  //     options: {
  //       httpOnly: false,
  //       sameSite: "strict",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  // },
};
