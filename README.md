# Recipe Website

A full-stack web application that allows users to view, search, and manage recipes. Users can mark recipes as favorites, and authenticated admins can add, edit, or delete recipes.

## Features

- **Public Features**:
  - Browse all recipes.
  - Search recipes by keywords.
  
- **Authenticated Features**:
  - Mark recipes as favorites (visible only to logged-in users).
  
- **Admin Features**:
  - Add, edit, and delete recipes.
  
- **Authentication**:
  - User registration and login using Firebase Authentication.

## Technologies Used

### Frontend
- **React**: User interface and components.
- **React-Bootstrap**: Responsive design and styling.
- **Firebase Authentication**: User authentication.

### Backend
- **Firebase Firestore**: Real-time NoSQL database for storing recipes and user data.
- **Firebase Hosting**: Hosting the web app.
- **Firebase Functions**: Secure backend logic for handling sensitive operations.

### Additional Tools
- **Git**: Version control.
- **GitHub**: Code hosting and collaboration.
- **Firebase CLI**: Deployment and configuration.

## Project Structure

```
project/
|-- public/                # Static assets
|-- src/
|   |-- assets/            # Images and logos
|   |-- components/        # Reusable components (Navbar, RecipeCard, etc.)
|   |-- pages/             # Page components (HomePage, RecipePage, etc.)
|   |-- firebase/          # Firebase configuration
|   |-- App.js             # Main app entry point
|   |-- index.js           # React DOM rendering
|-- functions/             # Firebase cloud functions
|-- .env                   # Environment variables (ignored by Git)
|-- firebase.json          # Firebase configuration
|-- package.json           # Dependencies and scripts
|-- README.md              # Project documentation
```

## Setup Instructions

### Prerequisites
1. Install [Node.js](https://nodejs.org/) (LTS recommended).
2. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/recipe-website.git
   cd recipe-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Add a web app and copy the Firebase configuration.
   - Create a `.env` file in the root directory and add your Firebase configuration:
     ```env
     REACT_APP_FIREBASE_API_KEY=your-api-key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
     REACT_APP_FIREBASE_PROJECT_ID=your-project-id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     REACT_APP_FIREBASE_APP_ID=your-app-id
     ```

4. Run the app locally:
   ```bash
   npm start
   ```

### Deployment
1. Build the production-ready app:
   ```bash
   npm run build
   ```

2. Deploy to Firebase Hosting:
   ```bash
   firebase deploy
   ```

## Security

- **Environment Variables**:
  Sensitive data such as Firebase API keys are stored in `.env` files and excluded from Git using `.gitignore`.
- **Firestore Rules**:
  Custom rules ensure:
  - Recipes are readable by all users but writable only by admins.
  - Favorites are accessible only to authenticated users.

## Usage

1. Navigate to the [deployed app](https://your-app-url.web.app/).
2. Browse recipes or search for specific ones.
3. Sign in to mark recipes as favorites.
4. Admin users can manage recipes.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.
