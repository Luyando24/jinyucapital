const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const [email] = process.argv.slice(2);
const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !url || !serviceRoleKey) {
  console.error("Usage: SUPABASE_SERVICE_ROLE_KEY=... node scripts/promote-admin-user.js admin@example.com");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function promoteAdmin() {
  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;

  const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error("No user found with that email address.");

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, usertype: "admin" },
  });
  if (updateError) throw updateError;

  console.log(`Promoted ${email} to administrator.`);
}

promoteAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
