import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfrgqafwkgjswenalys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnJncWFmd2tnanN3ZW5hbHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU0NDIsImV4cCI6MjA4NjMwMTQ0Mn0.8ITBUgfsEcwc8jARsht5qlG898Sa_CqhDvjOzk9F9QI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCustomers() {
  const { data, error } = await supabase.from('customers').select('*');
  console.log('Customers:', data, error);
}

checkCustomers();
