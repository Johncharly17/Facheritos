import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfrgqafwkgjswenalys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnJncWFmd2tnanN3ZW5hbHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU0NDIsImV4cCI6MjA4NjMwMTQ0Mn0.8ITBUgfsEcwc8jARsht5qlG898Sa_CqhDvjOzk9F9QI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBooking() {
  const tenant_id = '9f29904e-4490-4a37-b58f-2752ca528114';
  const clientName = 'Test User';
  const clientPhone = '+525555555555';
  
  console.log('1. Trying to read customer...');
  const { data: customersData, error: custError } = await supabase.from('customers')
    .select('id')
    .eq('phone', clientPhone)
    .eq('tenant_id', tenant_id);
    
  console.log('Read customer:', customersData, custError);
  
  console.log('2. Trying to insert customer...');
  const { data: newCustomer, error: insertError } = await supabase.from('customers').insert([{
    tenant_id,
    full_name: clientName,
    phone: clientPhone
  }]).select('id').single();
  
  console.log('Insert customer:', newCustomer, insertError);
}

testBooking();
