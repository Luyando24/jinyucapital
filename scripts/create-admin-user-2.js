const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mbntpoimbzrczsqfsgvg.supabase.co';
const supabaseKey = 'sb_publishable_KXBk6Qwf68Lbm9R_wHVesQ_zGKR2Jlf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('Creating second admin user...');
  
  const adminEmail = 'admin2@jinyucapital.com';
  const adminPassword = 'Admin2@2024!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          usertype: 'admin',
          name: 'Admin User 2'
        }
      }
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('User already exists.');
        return;
      }
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', data.user?.id);
    console.log('User Type: admin');
    console.log('\nNOTE: Confirm email in Supabase Dashboard if needed');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
