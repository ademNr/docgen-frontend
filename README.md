# Gitforje

> Generate lightning-fast, beautifully designed, and AI-powered documentation for your projects.

![Status](https://img.shields.io/badge/Status-In_Development-orange) ![Framework](https://img.shields.io/badge/Framework-Next.js_14-blue) ![Language](https://img.shields.io/badge/Language-TypeScript-blue)

## 📝 Description
Transform your GitHub repositories into stunning documentation that developers love to read.

## ✨ Features
- Lightning-fast documentation generation from GitHub repositories
- Beautiful, responsive UI components for an enhanced user experience
- AI-powered content generation for smart READMEs and insights
- Secure GitHub OAuth authentication for seamless login
- Interactive preview of generated documentation (README & Best Practices)
- Ability to copy or download generated documentation in Markdown format
- Credit and subscription management for documentation generation
- Dynamic background animations and loading states for engaging UX
    
## 🛠️ Tech Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Node.js
- Express
- GitHub OAuth
    
## ⚙️ Installation
### Requirements
- Node.js 18+
- npm or yarn
    
### Steps
Clone the repository: git clone https://github.com/ademNr/docgen-frontend.git
Navigate to the project directory: cd docgen-frontend
Install dependencies: npm install (or yarn install)
Configure environment variables: Create a .env.local file with NEXT_PUBLIC_GITHUB_CLIENT_ID and NEXT_PUBLIC_BACKEND_URL
Start the development server: npm run dev (or yarn dev)
    
## 🚀 Usage
### Basic
1. Access the application in your browser.
2. Click 'Login with GitHub' to authenticate.
3. Select a repository from your list.
4. Click 'Generate Docs' to create documentation.
5. Preview the generated README and best practices.
    
### Advanced
1. After generation, switch between 'README Preview' and 'Best Practices' tabs.
2. Use the 'Copy README' button to copy the Markdown to your clipboard.
3. Use the 'Download' button to save the README.md file locally.
4. Monitor your remaining credits or consider a lifetime subscription for unlimited generations.
    
## 🌐 API Reference

### `POST /api/auth/github`
Exchanges GitHub OAuth code for an authentication token and user ID.
    
**Parameters:**
- `code` (string) [required]: Authorization code from GitHub OAuth callback.
    
**Example:**
```bash
fetch(`${backendUrl}/api/auth/github`, { method: 'POST', body: JSON.stringify({ code }) })
```


### `GET /api/repos`
Fetches a list of the authenticated user's GitHub repositories.
    
**Parameters:**
- `Authorization` (string) [required]: Bearer token.
    
**Example:**
```bash
fetch(`${backendUrl}/api/repos`, { headers: { 'Authorization': `Bearer ${token}` } })
```


### `POST /api/documentation`
Generates documentation for a specified GitHub repository.
    
**Parameters:**
- `repoFullName` (string) [required]: Full name of the repository (e.g., 'owner/repo-name').
- `Authorization` (string) [required]: Bearer token.
    
**Example:**
```bash
fetch(`${backendUrl}/api/documentation`, { method: 'POST', body: JSON.stringify({ repoFullName }) })
```

    
## 📂 File Structure
- `app/`: Next.js app router directory containing pages, layouts, and global context.
- `app/(auth)/`: Authentication-related pages like login.
- `app/context/`: React Context API providers, e.g., AuthContext.
- `components/`: Reusable UI components categorized by feature (e.g., preview, repos, credit).
- `hooks/`: Custom React hooks for data fetching and logic encapsulation.
- `types/`: TypeScript type definitions for data structures.
- `utils/`: Utility functions, such as markdown generation.
- `public/`: Static assets like images and favicons.
    
## 🤝 Contributing
### Setup
1. Fork the repository. 2. Clone your fork. 3. Install dependencies. 4. Create a new branch for your feature or bug fix.
    
### Guidelines
Follow existing code style (ESLint, Prettier). Write clear, concise commit messages. Ensure all new features have corresponding types and interfaces.
    
### Process
1. Create a pull request to the `main` branch. 2. Provide a detailed description of changes. 3. Ensure all checks pass. 4. Address review comments promptly.
    
## 📜 License
This project is licensed under the MIT License.
    
## 👤 Author
ademNr
