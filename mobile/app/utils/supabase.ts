import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvxzbbbbypgtfsnfrpkf.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2eHpiYmJieXBndGZzbmZycGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMwMDI2NTEsImV4cCI6MjAyODU3ODY1MX0.cGAmPa7KCwuQOKUvkEo1ZcizfFZxCrn0Et8jDNdDcc8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
