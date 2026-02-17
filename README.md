# Daily Goal Tracker

A modern, AI-powered goal tracking application built with Next.js 14, featuring intelligent task generation, progress analytics, and a beautiful user interface.

##  Features

###  Smart Goal Management
- **AI-Powered Goal Creation**: Generate detailed roadmaps with actionable steps
- **Progress Tracking**: Visual progress indicators and completion analytics
- **Goal Categories**: Organize goals by type (Personal, Professional, Health, etc.)
- **Target Dates**: Set and track deadlines with calendar integration

###  AI-Powered Features
- **Daily Task Generation**: AI creates personalized daily tasks based on your goals
- **Goal Coach**: Interactive AI assistant for motivation and guidance
- **Smart Insights**: AI-powered analytics and recommendations
- **Multiple AI Providers**: Support for OpenAI, Google Gemini, and Anthropic Claude

###  Modern User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching with system preference
- **Progressive Web App**: Install as a native app on any device
- **Offline Support**: Continue working even without internet connection

###  Analytics & Insights
- **Progress Visualization**: Beautiful charts and graphs
- **Completion Rates**: Track your success patterns
- **Time Analytics**: Understand your productivity patterns
- **Goal Insights**: AI-powered recommendations for improvement

###  Note-Taking System
- **Rich Text Editor**: Full-featured note editing with formatting
- **Goal Integration**: Link notes directly to specific goals
- **Search & Filter**: Quickly find any note or goal
- **Export Options**: Export your data in multiple formats

##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/daily-goal-tracker.git
   cd daily-goal-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### AI Configuration

The app supports multiple AI providers. Configure your preferred provider in the Settings:

1. **Google Gemini (Recommended - Free)**
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Free tier includes generous usage limits

2. **OpenAI GPT**
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Requires paid account for API access

3. **Anthropic Claude**
   - Get your API key from [Anthropic Console](https://console.anthropic.com/settings/keys)
   - Requires paid account for API access

##  Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Framer Motion** - Smooth animations and transitions

### AI Integration
- **Multiple Providers** - OpenAI, Google Gemini, Anthropic Claude
- **Streaming Responses** - Real-time AI interactions
- **Context Awareness** - AI understands your goals and progress

### Data & Storage
- **Local Storage** - Client-side data persistence
- **Export/Import** - JSON and CSV data portability
- **Progressive Enhancement** - Works without JavaScript

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Tailwind CSS** - Utility-first styling

##  Project Structure

\`\`\`
daily-goal-tracker/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard page
│   ├── daily-tasks/       # Daily tasks management
│   ├── analytics/         # Progress analytics
│   ├── notes/            # Note-taking system
│   └── settings/         # App configuration
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions and services
│   ├── ai-utils.ts       # AI integration utilities
│   ├── storage.ts        # Data persistence
│   └── ...               # Other utilities
├── types/                # TypeScript type definitions
└── public/               # Static assets
\`\`\`

##  Customization

### Themes
The app supports both light and dark themes with automatic system detection. You can customize the color scheme by modifying the CSS variables in `app/globals.css`.

### AI Providers
Add support for additional AI providers by extending the AI utility functions in `lib/ai-utils.ts`.

### Components
All UI components are built with shadcn/ui and can be customized by modifying the component files in `components/ui/`.

##  Progressive Web App

The app is configured as a PWA and can be installed on any device:

1. **Desktop**: Click the install button in your browser's address bar
2. **Mobile**: Use "Add to Home Screen" from your browser menu
3. **Offline**: Continue using core features without internet connection

##  Privacy & Security

- **Local Data**: All your data stays on your device
- **API Keys**: Stored securely in browser local storage
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: Full transparency with open source code

##  Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Support

- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/yourusername/daily-goal-tracker/issues)
- **Email**: Contact us at [kachiluiz@gmail.com](mailto:kachiluiz@gmail.com)
- **Documentation**: Check our [Wiki](https://github.com/yourusername/daily-goal-tracker/wiki) for detailed guides

##  Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful, customizable icons
- [Vercel](https://vercel.com/) - Deployment and hosting platform

---


*Transform your goals into achievements with AI-powered guidance and beautiful, intuitive design.*
<img width="1117" height="582" alt="image" src="https://github.com/user-attachments/assets/9c453851-03e1-4170-93bd-cd6a4dc66099" />
<img width="1166" height="595" alt="image" src="https://github.com/user-attachments/assets/568cef6e-13ee-4e6a-98ff-417b45ca56cc" />


