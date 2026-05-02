import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfrgqafwkgjswenalys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnJncWFmd2tnanN3ZW5hbHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU0NDIsImV4cCI6MjA4NjMwMTQ0Mn0.8ITBUgfsEcwc8jARsht5qlG898Sa_CqhDvjOzk9F9QI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const tenant_id = '9f29904e-4490-4a37-b58f-2752ca528114';
  const { data, error } = await supabase.from('user_profiles')
    .select('id, is_active_page')
    .eq('tenant_id', tenant_id);
    
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
