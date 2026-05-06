// Supabase browser config for the HCT EHR simulation.
// 1. Create a Supabase project.
// 2. Run supabase-schema.sql in the Supabase SQL editor.
// 3. Replace the placeholders below with Project Settings > API values.
// The anon key is safe to publish in a browser app when Row Level Security is enabled.
window.HCT_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT-REF.supabase.co",
  anonKey: "YOUR_PUBLIC_ANON_KEY"
};
