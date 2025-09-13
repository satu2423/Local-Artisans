# Local Artisans Place

A modern marketplace platform connecting local artisans with customers who appreciate handcrafted goods.

## Features

- **Marketplace**: Browse and discover unique handcrafted items
- **Product Details**: Detailed product pages with artisan information
- **Upload Products**: Artisans can list their creations
- **AI Assistant**: Get help finding the perfect items
- **User Authentication**: Secure login and registration
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/ui/     # Reusable UI components
├── entities/          # Data models and API logic
├── lib/              # Utility functions
├── utils/            # Helper functions
└── main.jsx          # Application entry point

Pages/
├── Home.jsx          # Landing page
├── Marketplace.jsx   # Product listing
├── Product.jsx       # Product details
├── Upload.jsx        # Product upload form
├── Assistant.jsx     # AI assistant chat
└── Login.jsx         # User authentication

Layout.js             # Main app layout and routing
```

## Features Overview

### Marketplace
- Browse products by category
- Search and filter functionality
- Responsive grid layout
- Product cards with hover effects

### Product Details
- High-quality image gallery
- Detailed product information
- Artisan profile
- Add to cart functionality

### Upload System
- Multi-image upload
- Product categorization
- Pricing and description
- Technical specifications

### AI Assistant
- Interactive chat interface
- Product recommendations
- Quick question buttons
- Real-time responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
