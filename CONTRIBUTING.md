# Contributing to Daily Goal Tracker

Thank you for your interest in contributing to Daily Goal Tracker! We welcome contributions from developers of all skill levels.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

### Setting Up Your Development Environment

1. **Fork the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/daily-goal-tracker.git
   cd daily-goal-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development Guidelines

### Code Style

We use ESLint and Prettier to maintain consistent code style:

\`\`\`bash
# Check for linting errors
npm run lint

# Fix auto-fixable linting errors
npm run lint:fix

# Format code with Prettier
npm run format
\`\`\`

### TypeScript

This project uses TypeScript for type safety. Please ensure:

- All new code includes proper type annotations
- No `any` types unless absolutely necessary
- Interface definitions are placed in the appropriate `types/` files

### Component Guidelines

- Use functional components with hooks
- Follow the existing component structure in `components/`
- Use shadcn/ui components when possible
- Ensure components are responsive and accessible

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure dark mode compatibility
- Test on mobile devices

## 📝 Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-goal-templates`
- `fix/mobile-navigation-bug`
- `docs/update-readme`

### Commit Messages

Follow conventional commit format:
- `feat: add goal template functionality`
- `fix: resolve mobile navigation issue`
- `docs: update installation instructions`
- `style: improve button hover states`

### Pull Request Process

1. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests if applicable
   - Update documentation as needed

3. **Test your changes**
   \`\`\`bash
   npm run build
   npm run lint
   \`\`\`

4. **Commit your changes**
   \`\`\`bash
   git add .
   git commit -m "feat: add your feature description"
   \`\`\`

5. **Push to your fork**
   \`\`\`bash
   git push origin feature/your-feature-name
   \`\`\`

6. **Create a Pull Request**
   - Use a clear, descriptive title
   - Provide a detailed description of changes
   - Link any related issues
   - Add screenshots for UI changes

## 🐛 Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Browser, OS, device type
- **Screenshots**: If applicable

### Feature Requests

For feature requests, please include:

- **Problem**: What problem does this solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Any alternative solutions considered
- **Additional Context**: Screenshots, mockups, etc.

## 🧪 Testing

### Manual Testing

Please test your changes across:

- Different browsers (Chrome, Firefox, Safari, Edge)
- Different screen sizes (mobile, tablet, desktop)
- Both light and dark themes
- With and without JavaScript enabled

### Automated Testing

We encourage adding tests for new features:

\`\`\`bash
# Run tests (when available)
npm run test

# Run tests in watch mode
npm run test:watch
\`\`\`

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Include inline comments for complex logic
- Update type definitions when needed

### User Documentation

- Update README.md for new features
- Add examples for new functionality
- Update installation instructions if needed

## 🎨 Design Guidelines

### UI/UX Principles

- **Simplicity**: Keep interfaces clean and intuitive
- **Consistency**: Follow existing design patterns
- **Accessibility**: Ensure features work for all users
- **Performance**: Optimize for speed and efficiency

### Design Resources

- Use [Lucide Icons](https://lucide.dev/) for icons
- Follow the existing color scheme
- Maintain consistent spacing and typography
- Test with screen readers when possible

## 🤝 Community Guidelines

### Communication

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Share knowledge and resources

### Code Reviews

When reviewing code:

- Focus on the code, not the person
- Provide specific, actionable feedback
- Acknowledge good practices
- Suggest improvements kindly

## 📞 Getting Help

### Questions and Support

- **GitHub Discussions**: For general questions and ideas
- **GitHub Issues**: For bug reports and feature requests
- **Email**: [kachiluiz@gmail.com](mailto:kachiluiz@gmail.com) for direct contact

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special thanks in project documentation

## 📄 License

By contributing to Daily Goal Tracker, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Daily Goal Tracker! Your efforts help make this project better for everyone. 🙏

**Questions?** Feel free to reach out at [kachiluiz@gmail.com](mailto:kachiluiz@gmail.com)
