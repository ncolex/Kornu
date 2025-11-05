# Database Seeding Instructions

To populate your database with test data, follow these steps:

1. Make sure your Supabase environment variables are set in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

2. Install dependencies if you haven't:
   ```bash
   npm install
   npm install -D ts-node
   ```

3. Run the seed script:
   ```bash
   npm run seed
   ```

This will add:
- 5 negative profiles (high risk) with associated reviews
- 5 positive profiles (trustworthy) with associated reviews
- Each profile has multiple reviews across different categories