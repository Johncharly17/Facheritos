import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfrgqafwkgjswenalys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnJncWFmd2tnanN3ZW5hbHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU0NDIsImV4cCI6MjA4NjMwMTQ0Mn0.8ITBUgfsEcwc8jARsht5qlG898Sa_CqhDvjOzk9F9QI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const tenant_id = '9f29904e-4490-4a37-b58f-2752ca528114';
  const { data: cData, error: cErr } = await supabase.from('customers').insert({
    tenant_id,
    full_name: 'Test Customer',
    phone: '525555555555'
  }).select('*').single();
  console.log('Customer Insert 2:', cData, cErr);
}
testInsert();
