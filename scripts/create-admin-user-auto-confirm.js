const { createClient } = require('@supabase/supabase-js');

// Using anon key - will create user but needs manual confirmation
// For auto-confirmation, you need to use service role key or confirm in dashboard
const supabaseUrl = 'https://mbntpoimbzrczsqfsgvg.supabase.co';
const supabaseKey = 'sb_publishable_KXBk6Qwf68Lbm9R_wHVesQ_zGKR2Jlf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  console.log('Creating admin user with auto-confirm...');
  
  const adminEmail = 'admin@jinyucapital.com';
  const adminPassword = 'Admin@2024!';
  
  try {
    // First, try to sign up with auto-confirm disabled
    const { data, error } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
      options: {
        data: {
          role: 'admin',
          name: 'Admin User'
        }
      }
    });
    
    if (error) {
      // If user already exists, try to sign in
      if (error.message.includes('already registered')) {
        console.log('User already exists. Attempting to sign in...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });
        
        if (signInError) {
          console.error('Sign in failed:', signInError.message);
          console.log('\nPlease manually confirm the email in Supabase Dashboard:');
          console.log('1. Go to https://supabase.com/dashboard/project/mbntpoimbzrczsqfsgvg/auth/users');
          console.log('2. Find the user with email:', adminEmail);
          console.log('3. Click "Confirm Email" button');
          process.exit(1);
        }
        
        console.log('Signed in successfully!');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        return;
      }
      
      console.error('Error creating admin user:', error);
      process.exit(1);
    }
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('User ID:', data.user?.id);
    console.log('\nNOTE: Email confirmation may be required.');
    console.log('If login fails, manually confirm email in Supabase Dashboard > Auth > Users');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  }
}

createAdminUser();
