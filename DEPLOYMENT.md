# 🚀 GameArena Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed
- Git repository
- PostgreSQL database (use Heroku Postgres addon)

## Quick Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create Heroku App
```bash
heroku create your-app-name
```

### 3. Add PostgreSQL Database
```bash
heroku addons:create heroku-postgresql:essential-0
```

### 4. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET="your-super-secret-session-key-here"
```

### 5. Deploy
```bash
git add .
git commit -m "Ready for deployment"
git push heroku main
```

### 6. Run Database Migration
```bash
heroku run npm run db:push
```

## Environment Variables Needed

- `DATABASE_URL` - Automatically set by Heroku Postgres
- `SESSION_SECRET` - Set a strong random string
- `NODE_ENV` - Set to "production"
- `PORT` - Automatically set by Heroku

## Post-Deployment

1. Visit your app: `https://your-app-name.herokuapp.com`
2. Test admin login with code: **GAMEARENA2025**
3. Create your first tournament!

## Troubleshooting

### View Logs
```bash
heroku logs --tail
```

### Check Database
```bash
heroku pg:info
```

### Restart App
```bash
heroku restart
```

Your GameArena tournament platform is now live! 🎮