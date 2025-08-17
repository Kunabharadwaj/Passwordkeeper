# Password Keeper

A secure, full-stack password manager built with Next.js, MongoDB, and NextAuth.js.

## Features

- 🔐 **Secure Authentication** - Email/password authentication with NextAuth.js
- 🔒 **Encrypted Storage** - Passwords encrypted with AES encryption before storage
- 🎲 **Password Generator** - Customizable password generation with various options
- 📱 **Mobile Responsive** - Works perfectly on desktop, tablet, and mobile devices
- 👁️ **Password Visibility Toggle** - Show/hide passwords for easy entry
- 📋 **Copy to Clipboard** - One-click password copying
- 🗂️ **User Isolation** - Each user only sees their own passwords

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js with Credentials Provider
- **Encryption**: crypto-js for password encryption
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Environment variables configured

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd passwordkeeper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key

   # MongoDB Atlas
   MONGODB_URI=your-mongodb-connection-string

   # Encryption Key for password storage
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This app is designed to be easily deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy!

## Security Features

- Passwords are encrypted using AES encryption before database storage
- User passwords are hashed with bcryptjs
- JWT-based session management
- User data isolation - users can only access their own passwords
- Secure environment variable handling

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your app's URL (for production: https://your-app.vercel.app) |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js JWT encryption |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ENCRYPTION_KEY` | 32-character key for password encryption |

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is for personal use and learning purposes.
