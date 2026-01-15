
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ujthgpnhcbupxyhweixh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqdGhncG5oY2J1cHh5aHdlaXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDg3NTYsImV4cCI6MjA4NDA4NDc1Nn0.qLT5EOIEAV1mi0keqYkAPMicdb2-4SzAEyUI1K9CqXg'

export const supabase = createClient(supabaseUrl, supabaseKey)
