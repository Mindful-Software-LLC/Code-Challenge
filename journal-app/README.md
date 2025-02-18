# Journal App

A React Native mobile application that helps users maintain a digital journal with AI-powered mood analysis. Built with Expo, Supabase, and Google's Gemini AI.

## Features

- 📝 Create, edit, and delete journal entries
- 🧠 AI-powered mood analysis using Google's Gemini
- 🎨 Visual mood indicators and filtering
- 🔒 Secure authentication with Supabase
- 📊 Mood statistics and filtering
- 🎯 Intuitive UI with mood-based color coding

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase for backend and authentication
- Google Gemini AI for mood analysis
- Expo Router for navigation

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- Google AI Studio account (for Gemini API key)

### Environment Setup

1. Clone the repository
```bash
git clone <repository-url>
cd journal-app
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your credentials sent via email:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### Database Setup (already implemented -- just in case it will be needed in the future for a new DB instance)

Run the following SQL in your Supabase SQL editor:

```sql
-- Create entries table
create table entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  mood text not null,
  mood_score jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table entries enable row level security;

-- Create policies
create policy "Users can view their own entries"
  on entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own entries"
  on entries for delete
  using (auth.uid() = user_id);
```

### Running the App

```bash
npm start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Or scan the QR code with Expo Go app on your physical device

## Project Structure

```
journal-app/
├── app/                    # Main application screens
│   ├── (auth)/            # Authentication-related screens
│   │   ├── _layout.tsx    # Auth navigation layout
│   │   ├── sign-in.tsx    # Sign in screen
│   │   └── sign-up.tsx    # Sign up screen
│   ├── (tabs)/            # Main app tabs
│   │   ├── _layout.tsx    # Tab navigation layout
│   │   ├── index.tsx      # Home screen (journal entries list)
│   │   ├── new.tsx        # New entry screen
│   │   └── settings.tsx   # Settings screen
│   ├── entry/             # Entry-related screens
│   │   └── [id].tsx       # Individual entry view/edit screen
│   └── _layout.tsx        # Root navigation layout
├── components/            # Reusable components
│   ├── AuthForm.tsx      # Authentication form component
│   ├── JournalEntry.tsx  # Journal entry card component
│   ├── LoadingIndicator.tsx # Loading spinner component
│   ├── MoodFilter.tsx    # Mood filtering component
│   └── StyledText.tsx    # Styled text components
├── constants/            # App constants
│   ├── Colors.ts        # Color definitions
│   └── Styles.ts        # Global styles
├── context/             # React Context providers
│   └── AuthContext.tsx  # Authentication context
├── lib/                 # Utility functions and API clients
│   ├── gemini.js       # Gemini AI integration
│   └── supabase.js     # Supabase client setup
└── types/              # TypeScript type definitions
    ├── Entry.ts        # Journal entry types
    └── env.d.ts        # Environment variable types
```

## Features Breakdown

### Authentication
- Email/password authentication using Supabase
- Protected routes and authenticated API calls
- Persistent sessions

### Journal Entries
- Create new entries with AI-powered mood analysis
- View, edit, and delete existing entries
- Automatic mood detection and scoring
- Visual mood indicators

### Mood Analysis
- Integration with Google's Gemini AI
- Mood detection from journal content
- Mood scoring across multiple emotions
- Color-coded mood visualization

### UI/UX
- Intuitive tab-based navigation
- Pull-to-refresh functionality
- Loading states and error handling
- Mood-based color coding
- Filter entries by mood