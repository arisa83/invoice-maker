# Vibe App Hub

**Vibe App Hub** is a creative playground for modern web tools.
Hosted at [vibeapphub.com](https://vibeapphub.com).

## Project Structure (Monorepo)

- **Root**: Landing page (Portal)
- **`/invoice-maker`**: Invoice creation tool (React App)

## Deployment

This project is deployed on **Cloudflare Pages**.
Pushing to the `main` branch triggers a new build.

### Build Command
```bash
npm run build
```
This command builds the invoice maker and organizes the `dist` folder for Cloudflare Pages.
