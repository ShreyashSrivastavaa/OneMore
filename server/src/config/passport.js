import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import prisma from './db.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const providerId = profile.id;
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const name = profile.displayName || profile.username || 'Google Player';
          const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

          // 1. Check existing OAuth link
          let oauthAcc = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'google',
                providerAccountId: providerId,
              },
            },
            include: { user: true },
          });

          if (oauthAcc) {
            return done(null, oauthAcc.user);
          }

          // 2. Check if user with same email exists
          let user = null;
          if (email) {
            user = await prisma.user.findUnique({ where: { email } });
          }

          // 3. Create user if not exists
          if (!user) {
            user = await prisma.user.create({
              data: {
                name,
                email,
                avatarUrl,
              },
            });
          }

          // 4. Link OAuth Account
          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: 'google',
              providerAccountId: providerId,
            },
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// Configure GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:5000/api/auth/github/callback',
        scope: ['user:email'], // Minimum scope - no repo access!
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const providerId = profile.id.toString();
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const name = profile.displayName || profile.username || 'GitHub Player';
          const avatarUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

          let oauthAcc = await prisma.oAuthAccount.findUnique({
            where: {
              provider_providerAccountId: {
                provider: 'github',
                providerAccountId: providerId,
              },
            },
            include: { user: true },
          });

          if (oauthAcc) {
            return done(null, oauthAcc.user);
          }

          let user = null;
          if (email) {
            user = await prisma.user.findUnique({ where: { email } });
          }

          if (!user) {
            user = await prisma.user.create({
              data: {
                name,
                email,
                avatarUrl,
              },
            });
          }

          await prisma.oAuthAccount.create({
            data: {
              userId: user.id,
              provider: 'github',
              providerAccountId: providerId,
            },
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

export default passport;
