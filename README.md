# Vision Venture AI Academy

A modern, full-featured platform for AI education and training, built with React, TypeScript, and Supabase.

![Vision Venture AI Academy](https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80)

## Features

- 🎓 **Learning Portal**
  - Interactive course modules
  - Progress tracking
  - Downloadable resources
  - Video content integration

- 🏢 **Workshop Management**
  - B2B and B2C workshop offerings
  - Online and in-person sessions
  - Secure payment processing
  - Automated registration

- 📝 **Blog Platform**
  - Rich text editing
  - Media uploads
  - Author management
  - Content categorization

- 🔒 **Authentication**
  - Email and password authentication
  - Protected routes
  - User session management
  - Role-based access control

- 💼 **Business Features**
  - Contact form
  - Analytics integration
  - Social media integration
  - Newsletter subscription

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - React Router v6
  - Lucide React Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security
  - Real-time subscriptions

- **Authentication**
  - Supabase Auth
  - JWT tokens
  - Protected routes

- **Payment Processing**
  - Stripe integration
  - Secure checkout
  - Payment history

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vision-venture
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── types/            # TypeScript type definitions
└── main.tsx          # Application entry point
```

## Key Components

- `AuthModal`: Handles user authentication
- `LearningPortal`: Main learning interface
- `WorkshopDetails`: Workshop information and registration
- `BlogSection`: Blog listing and management
- `ContactForm`: User inquiry handling

## Database Schema

The application uses the following main tables:

- `users`: User profiles and authentication
- `courses`: Available courses and content
- `workshops`: Workshop details and scheduling
- `blog_posts`: Blog content and metadata
- `contact_messages`: User inquiries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security

- All routes requiring authentication are protected
- Database access is controlled through Row Level Security
- Secure payment processing with Stripe
- Input validation and sanitization

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@visionventure.com or join our Slack community.