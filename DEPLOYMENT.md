# Deployment Guide

## Vercel Deployment

1.  **Push to GitHub**:
    *   Initialize a git repository: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "Initial commit"`
    *   Create a repository on GitHub and push your code.

2.  **Connect to Vercel**:
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.

3.  **Configure Environment Variables**:
    *   In the Vercel project settings, go to "Environment Variables".
    *   Add all variables from your `.env.example` file (but with real values):
        *   `VITE_FIREBASE_API_KEY`
        *   `VITE_FIREBASE_AUTH_DOMAIN`
        *   `VITE_FIREBASE_PROJECT_ID`
        *   `VITE_FIREBASE_STORAGE_BUCKET`
        *   `VITE_FIREBASE_MESSAGING_SENDER_ID`
        *   `VITE_FIREBASE_APP_ID`
        *   `VITE_EMAILJS_SERVICE_ID`
        *   `VITE_EMAILJS_TEMPLATE_ID`
        *   `VITE_EMAILJS_PUBLIC_KEY`

4.  **Deploy**:
    *   Click "Deploy". Vercel will automatically detect Vite and build your project.

## Custom Domain Connection

1.  **Buy a Domain**: Purchase a domain from a registrar (Namecheap, GoDaddy, Google Domains, etc.).

2.  **Vercel Settings**:
    *   Go to your Vercel Project -> Settings -> Domains.
    *   Enter your custom domain (e.g., `renovatepro.com`).

3.  **DNS Configuration**:
    *   Vercel will provide DNS records (A Record or CNAME).
    *   Log in to your domain registrar's dashboard.
    *   Add the records provided by Vercel.
    *   Wait for propagation (usually minutes, up to 24h).

4.  **SSL**: Vercel automatically provisions an SSL certificate for your domain.

## Firebase Configuration

1.  **Create Project**: Go to [Firebase Console](https://console.firebase.google.com/).
2.  **Enable Auth**: Go to Authentication -> Sign-in method -> Enable Email/Password.
3.  **Create Database**: Go to Firestore Database -> Create Database.
4.  **Storage**: Go to Storage -> Get Started.
5.  **Security Rules**: Copy the rules from `firestore.rules` and `storage.rules` (if provided) to your Firebase console.

## EmailJS Configuration

1.  **Create Account**: Go to [EmailJS](https://www.emailjs.com/).
2.  **Add Service**: Add Gmail or your preferred email service.
3.  **Create Template**: Create an email template with variables `{{name}}`, `{{email}}`, `{{phone}}`, `{{service}}`, `{{message}}`.
4.  **Get Keys**: Copy Service ID, Template ID, and Public Key to your environment variables.
