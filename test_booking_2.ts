import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exfrgqafwkgjswenalys.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZnJncWFmd2tnanN3ZW5hbHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MjU0NDIsImV4cCI6MjA4NjMwMTQ0Mn0.8ITBUgfsEcwc8jARsht5qlG898Sa_CqhDvjOzk9F9QI';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testBookingFull() {
  const tenant_id = '9f29904e-4490-4a37-b58f-2752ca528114';
  const customerId = '14f0cd5a-ccc9-4046-9dd4-ab5848f2cb1f';
  
  // Create an appointment
  console.log('3. Trying to insert appointment...');
  const { data: newAppointment, error: apptError } = await supabase.from('appointments').insert([{
    tenant_id,
    customer_id: customerId,
    staff_id: 'f5b018a0-82ac-448a-8426-acac6363325d',
    service_id: '50e20601-cb8c-4a3c-b034-e40df5f09624',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    status: 'pending',
    final_price: 100,
    is_express: false
  }]);
  
  console.log('Insert appointment:', newAppointment, apptError);
}

testBookingFull();
