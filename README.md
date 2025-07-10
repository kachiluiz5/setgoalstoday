# Daily Goal Tracker - Open Source Goal Achievement Platform

<div align="center">
  <img src="public/placeholder-logo.png" alt="Daily Goal Tracker Logo" width="120" height="120">
  
  <h3>Transform your dreams into achievable milestones with AI-powered goal tracking</h3>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)
</div>

## 🌟 Overview

Daily Goal Tracker is a comprehensive, open-source goal management platform that combines the power of artificial intelligence with intuitive design to help users achieve their personal and professional objectives. Built with modern web technologies, it offers a seamless experience for setting, tracking, and accomplishing goals.

## 🛠️ Complete Technology Stack

### Core Framework & Runtime
- **Next.js 15.1.0** - React framework with App Router for server-side rendering and routing
- **React 19.0.0** - Modern React with latest features including Server Components
- **TypeScript 5.7.2** - Type-safe JavaScript for better development experience
- **Node.js 18+** - JavaScript runtime environment

### Styling & UI Components
- **Tailwind CSS 3.4.17** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, accessible React components built on Radix UI
- **Radix UI Primitives** - Unstyled, accessible components for complex UI patterns:
  - `@radix-ui/react-dialog` - Modal dialogs and overlays
  - `@radix-ui/react-dropdown-menu` - Dropdown menus and context menus
  - `@radix-ui/react-tabs` - Tab navigation components
  - `@radix-ui/react-progress` - Progress bars and indicators
  - `@radix-ui/react-toast` - Toast notifications
  - `@radix-ui/react-accordion` - Collapsible content sections
  - `@radix-ui/react-popover` - Floating content containers
- **Tailwind CSS Animate** - Animation utilities for smooth transitions
- **Class Variance Authority (CVA)** - Component variant management
- **clsx & tailwind-merge** - Conditional CSS class utilities

### AI Integration & APIs
- **Multiple AI Providers Support**:
  - **Google Gemini API** - Primary AI provider for goal generation and coaching
  - **OpenAI GPT-4** - Secondary AI provider with fallback support
  - **Anthropic Claude** - Tertiary AI provider for enhanced reliability
- **Custom AI Engine** (`lib/ai-utils.ts`) - Intelligent routing between AI providers
- **Smart Retry Logic** - Exponential backoff for API failures
- **Context-Aware AI Coaching** - Personalized responses based on user data

### Icons & Visual Elements
- **Lucide React 0.460.0** - Beautiful, customizable SVG icons
- **Custom Logo & Branding** - Placeholder assets ready for customization
- **Responsive Images** - Optimized image handling with Next.js Image component

### Data Management & Storage
- **Browser Local Storage** - Client-side data persistence without external dependencies
- **Custom Storage Layer** (`lib/storage.ts`) - Abstracted storage operations:
  - Goal management (CRUD operations)
  - Notes storage and retrieval
  - Daily tasks persistence
  - API settings management
  - Notification preferences
- **TypeScript Interfaces** - Type-safe data structures for all entities
- **JSON Serialization** - Efficient data storage and retrieval
- **Error Handling** - Graceful fallbacks for storage failures

### State Management & Hooks
- **React Hooks** - Modern state management with useState, useEffect, useCallback
- **Custom Hooks** - Reusable logic for common operations
- **Context API** - Theme management and global state
- **Local State** - Component-level state management

### Form Handling & Validation
- **React Hook Form 7.54.0** - Performant forms with minimal re-renders
- **Zod 3.24.1** - TypeScript-first schema validation
- **@hookform/resolvers** - Integration between React Hook Form and Zod
- **Input Validation** - Real-time form validation with error messages

### Date & Time Management
- **date-fns 4.1.0** - Modern JavaScript date utility library
- **React Day Picker 9.4.2** - Flexible date picker component
- **Custom Date Utils** (`lib/date-utils.ts`) - Application-specific date operations

### Charts & Analytics
- **Recharts 2.13.3** - Composable charting library built on React components
- **Progress Visualization** - Custom progress bars and completion indicators
- **Goal Analytics** - Visual representation of achievement patterns

### Animations & Interactions
- **Framer Motion 11.11.17** - Production-ready motion library for React
- **Smooth Transitions** - Page transitions and component animations
- **Interactive Elements** - Hover effects and micro-interactions
- **Loading States** - Skeleton loaders and progress indicators

### Development Tools & Build Process
- **ESLint 9.17.0** - Code linting and quality enforcement
- **PostCSS 8.5.1** - CSS processing and optimization
- **TypeScript Compiler** - Type checking and compilation
- **Next.js Build System** - Optimized production builds

### Accessibility & User Experience
- **ARIA Labels** - Screen reader compatibility
- **Keyboard Navigation** - Full keyboard accessibility
- **Focus Management** - Proper focus handling in modals and forms
- **Color Contrast** - WCAG compliant color schemes
- **Responsive Design** - Mobile-first approach with breakpoint management

### Notifications & User Engagement
- **Sonner 1.7.1** - Beautiful toast notifications
- **Browser Notifications API** - Native browser notifications (optional)
- **Custom Notification Service** (`lib/notification-service.ts`) - Centralized notification management

### Export & Import Capabilities
- **PDF Generation** - Export goals and progress as PDF documents
- **JSON Export** - Backup and restore functionality
- **Text Export** - Plain text format for universal compatibility
- **Custom Export Utils** (`lib/export-utils.ts`) - Flexible export system

### Theme & Customization
- **next-themes 0.4.4** - Dark/light mode with system preference detection
- **CSS Custom Properties** - Dynamic theming support
- **Theme Provider** - Centralized theme management
- **Persistent Theme Selection** - User preference storage

### Performance Optimizations
- **Next.js App Router** - Optimized routing with automatic code splitting
- **Server Components** - Reduced client-side JavaScript bundle
- **Image Optimization** - Automatic image optimization and lazy loading
- **Bundle Analysis** - Code splitting and tree shaking

### Security & Privacy
- **Client-Side Only** - No server-side data storage
- **Local Storage Encryption** - Optional data encryption (can be added)
- **No External Dependencies** - Core functionality works offline
- **Privacy-First Design** - User data never leaves their device

## 📊 Data Architecture

### Storage Structure
\`\`\`typescript
// Goals Storage
interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetDate: string
  progress: number
  roadmap: RoadmapStep[]
  createdAt: string
  updatedAt: string
}

// Notes Storage
interface Note {
  id: string
  goalId?: string
  stepId?: string
  content: string
  createdAt: string
  updatedAt: string
}

// Daily Tasks Storage
interface DailyTask {
  id: string
  title: string
  description: string
  date: string
  completed: boolean
  goalId?: string
}
\`\`\`

### Local Storage Keys
- `daily-goals` - All user goals
- `daily-notes` - User notes and reflections
- `daily-tasks` - Daily task management
- `api-settings` - AI provider configurations
- `notification-settings` - User notification preferences
- `theme` - Dark/light mode preference

## ✨ Key Features

### 🤖 AI-Powered Goal Planning
- **Smart Roadmap Generation**: AI creates personalized step-by-step action plans
- **Intelligent Task Suggestions**: Daily tasks aligned with your goals
- **Advanced Goal Coach**: Interactive AI assistant with context awareness
- **Multi-Provider AI Support**: Fallback between Gemini, OpenAI, and Claude

### 📊 Comprehensive Tracking
- **Visual Progress Monitoring**: Beautiful charts and progress bars using Recharts
- **Monthly Goal Organization**: Organize goals by month and year
- **Step-by-Step Roadmaps**: Break down complex goals into manageable steps
- **Completion Analytics**: Track your success patterns over time

### 📝 Rich Note-Taking
- **Step-Level Notes**: Add personal insights for each roadmap step
- **Collapsible Interface**: Toggle notes visibility with smooth animations
- **Auto-Save Functionality**: Notes are automatically saved to local storage
- **Export Capabilities**: Download notes and goals in various formats

### 🎯 Daily Task Management
- **AI Task Generation**: Automatically generate relevant daily tasks
- **Custom Task Creation**: Add your own tasks for any day
- **Progress Tracking**: Monitor daily completion rates
- **Goal Integration**: Link tasks to specific goals

### 🎨 Modern User Experience
- **Responsive Design**: Works perfectly on desktop and mobile
- **Dark/Light Mode**: Automatic system preference detection
- **Smooth Animations**: Framer Motion powered transitions
- **Accessibility**: WCAG compliant with full keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, or pnpm package manager

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
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Add your AI API keys to `.env.local`:
   \`\`\`env
   # Optional: Add your preferred AI API key
   OPENAI_API_KEY=your_openai_key_here
   ANTHROPIC_API_KEY=your_anthropic_key_here
   GEMINI_API_KEY=your_gemini_key_here
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
daily-goal-tracker/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── goals/            # Goal management pages
│   ├── daily-tasks/      # Daily task management
│   ├── notes/            # Note-taking interface
│   ├── settings/         # Application settings
│   ├── analytics/        # Goal analytics and insights
│   ├── layout.tsx        # Root layout with providers
│   └── globals.css       # Global styles and CSS variables
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   ├── goal-*.tsx        # Goal-related components
│   ├── *-modal.tsx       # Modal components
│   └── theme-provider.tsx # Theme management
├── lib/                  # Utility functions and services
│   ├── storage.ts        # Local storage management
│   ├── ai-utils.ts       # AI integration utilities
│   ├── date-utils.ts     # Date manipulation helpers
│   ├── export-utils.ts   # Export functionality
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
│   ├── goal.ts           # Goal-related types
│   ├── note.ts           # Note types
│   └── daily-task.ts     # Task types
├── hooks/                # Custom React hooks
├── public/               # Static assets
│   ├── images/           # Application images
│   └── placeholder.*     # Placeholder assets
└── styles/               # Additional styles
\`\`\`

## 🎯 Usage Guide

### Creating Your First Goal

1. **Navigate to Dashboard**: Click "Create New Goal" button
2. **Fill Goal Details**: 
   - Title: What you want to achieve
   - Description: Why this goal matters to you
   - Category: Personal, Professional, Health, etc.
   - Timeframe: When you want to complete it
3. **Generate AI Roadmap**: Let AI create a step-by-step plan
4. **Customize Steps**: Edit, add, or remove steps as needed
5. **Start Tracking**: Begin working through your roadmap

### Using the AI Coach

1. **Open Goal Details**: Click on any goal from your dashboard
2. **Start Chat**: Click the floating chat button
3. **Ask Questions**: Get advice, motivation, or guidance
4. **Receive Insights**: AI provides personalized recommendations

### Managing Daily Tasks

1. **Visit Daily Tasks**: Navigate to the daily tasks page
2. **Generate AI Tasks**: Click "Generate AI Tasks" for suggestions
3. **Add Custom Tasks**: Use the input field to add personal tasks
4. **Track Progress**: Check off completed tasks throughout the day

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Bug Reports**: Found a bug? Open an issue
- 💡 **Feature Requests**: Have an idea? We'd love to hear it
- 🔧 **Code Contributions**: Submit pull requests
- 📖 **Documentation**: Help improve our docs
- 🎨 **Design**: Contribute to UI/UX improvements

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add comments for complex logic
- Ensure responsive design
- Test on multiple browsers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability accepted

## 🙏 Acknowledgments

- **shadcn/ui** - For the beautiful UI components
- **Vercel** - For the amazing deployment platform
- **OpenAI, Google, Anthropic** - For AI capabilities
- **Next.js Team** - For the incredible React framework
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support & Community

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/daily-goal-tracker/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/daily-goal-tracker/discussions)
- 📧 **Email**: support@dailygoaltracker.com
- 🐦 **Twitter**: [@DailyGoalTracker](https://twitter.com/DailyGoalTracker)

## 🗺️ Roadmap

### Version 2.0 (Coming Soon)
- [ ] Team collaboration features
- [ ] Goal templates marketplace
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with calendar apps
- [ ] Habit tracking features

### Version 2.1
- [ ] Social sharing features
- [ ] Goal achievement badges
- [ ] Community challenges
- [ ] Advanced AI coaching
- [ ] Multi-language support

## 📊 Stats

- ⭐ **Stars**: Help us reach 1,000 stars!
- 🍴 **Forks**: Join our growing community
- 🐛 **Issues**: Help us improve
- 👥 **Contributors**: Be part of the team

---

<div align="center">
  <p>Made with ❤️ by kachiluiz@gmail.com</p>
  <p>
    <a href="https://github.com/yourusername/daily-goal-tracker">⭐ Star us on GitHub</a> •
    <a href="https://github.com/yourusername/daily-goal-tracker/issues">🐛 Report Bug</a> •
    <a href="https://github.com/yourusername/daily-goal-tracker/discussions">💬 Request Feature</a>
  </p>
</div>
