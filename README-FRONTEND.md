# NeuraNote Frontend Landing Page

This directory contains the frontend landing page for the NeuraNote study platform.

## Files Added

### Components
- `components/StudyPlatform.tsx` - Main landing page component
- `components/ui/button.tsx` - Reusable Button component

### App Structure
- `app/page.tsx` - Main page that renders the StudyPlatform component
- `app/layout.tsx` - Root layout with metadata and font configuration
- `app/globals.css` - Global styles with Tailwind CSS

### Configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `package-frontend.json` - Frontend dependencies (rename to package.json if using separately)

### Assets
- `public/hamburger.svg` - Hamburger menu icon
- `public/table.png` - Placeholder for table illustration (replace with your actual image)

## Setup Instructions

1. **Install Frontend Dependencies:**
   ```bash
   # If you want to run frontend separately, rename package-frontend.json to package.json
   npm install
   ```

2. **Replace Images:**
   - Replace `public/table.png` with your actual table illustration image
   - The hamburger.svg is already created, but you can replace it with your own design

3. **Run the Development Server:**
   ```bash
   npm run dev
   ```

4. **Access the Landing Page:**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

The landing page includes:
- **Header** with login button and hamburger menu
- **Hero Section** with NeuraNote branding and call-to-action
- **Features Section** highlighting platform benefits
- **About Section** explaining the platform's value proposition
- **CTA Section** encouraging user sign-up

## Styling

The page uses:
- Custom color palette matching the design
- Tailwind CSS for responsive design
- Custom Button component with variant support
- Responsive layout that works on mobile and desktop

## Integration with Backend

This frontend can be integrated with your existing Express.js backend by:
1. Adding API routes for authentication
2. Connecting the login button to your auth endpoints
3. Setting up proper CORS configuration
4. Adding environment variables for API endpoints

## Customization

You can customize:
- Colors by modifying the inline styles in StudyPlatform.tsx
- Content by editing the text in the component
- Layout by adjusting the Tailwind classes
- Images by replacing the files in the public directory 