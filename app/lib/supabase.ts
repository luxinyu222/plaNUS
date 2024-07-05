import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://analpmkwqopnxivggodv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFuYWxwbWt3cW9wbnhpdmdnb2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MzY4MjQsImV4cCI6MjAzNDQxMjgyNH0.a7CMgUTaKHbmYHMAiJhDqqilf5Af9Ov4eU1rtPerCUM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})