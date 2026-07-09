const { createClient } = require('@supabase/supabase-js');

// Direct credentials
const supabaseUrl = 'https://mbntpoimbzrczsqfsgvg.supabase.co';
const supabaseKey = 'sb_publishable_KXBk6Qwf68Lbm9R_wHVesQ_zGKR2Jlf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('Creating admin user...');
  
  const adminEmail = 'admin@jinyucapital.com';
  const adminPassword = 'Admin@2024!'; // Change this after first login
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin',
          name: 'Admin User'
        },
        emailRedirectTo: undefined // Disable email confirmation
      }
    });
    
    if (error) {
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', data.user?.id);
    console.log('\nIMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
