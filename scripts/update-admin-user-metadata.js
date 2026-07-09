const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mbntpoimbzrczsqfsgvg.supabase.co';
const supabaseKey = 'sb_publishable_KXBk6Qwf68Lbm9R_wHVesQ_zGKR2Jlf';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdminUserMetadata() {
  console.log('Updating first admin user metadata...');
  
  const adminEmail = 'admin@jinyucapital.com';
  
  try {
    // First, sign in to get the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'Admin@2024!',
    });
    
    if (signInError) {
      console.error('Sign in failed:', signInError.message);
      console.log('Please confirm email in Supabase Dashboard first');
      process.exit(1);
    }
    
    // Update user metadata
    const { data, error } = await supabase.auth.updateUser({
      data: {
        usertype: 'admin',
        name: 'Admin User'
      }
    });
    
    if (error) {
      console.error('Error updating user metadata:', error);
      process.exit(1);
    }
    
    console.log('User metadata updated successfully!');
    console.log('User ID:', data.user?.id);
    console.log('User Type:', data.user?.user_metadata?.usertype);
    
    // Sign out
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Failed to update user metadata:', error);
    process.exit(1);
  }
}

updateAdminUserMetadata();
