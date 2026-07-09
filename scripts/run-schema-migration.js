const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSchemaMigration() {
  console.log('Running schema migration...');
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase-migration.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements (basic split by semicolon)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error in statement ${i + 1}:`, error);
          console.error('Statement:', statement.substring(0, 100) + '...');
        }
      } catch (err) {
        console.error(`Exception in statement ${i + 1}:`, err.message);
      }
    }
    
    console.log('Schema migration completed');
    console.log('Note: If you encountered errors, please run the SQL manually in Supabase Dashboard > SQL Editor');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runSchemaMigration();
