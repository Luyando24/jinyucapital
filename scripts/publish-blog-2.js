const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function publishBlog2() {
  console.log('Publishing second blog post to database...');

  const blogPost = {
    title: 'Selecting the Right Color Temperature (CCT) for Industrial Workspaces',
    slug: 'selecting-color-temperature-industrial-workspaces',
    excerpt: 'How Correlated Color Temperature (CCT) affects safety, precision, and worker alertness in manufacturing plants and warehouses.',
    content: `# Selecting the Right Color Temperature (CCT) for Industrial Workspaces

In industrial environments such as manufacturing plants, chemical processing workshops, and warehouses, lighting is a key driver of operational efficiency, workplace safety, and employee well-being. 

Among the various technical specifications of industrial LED fixtures, **Correlated Color Temperature (CCT)** is one of the most critical. CCT, measured in Kelvin (K), defines the color appearance of light. Selecting the right CCT can improve task visibility, reduce human error, and regulate circadian rhythm.

---

## 1. Understanding CCT Ranges

Light color is generally grouped into three main categories:
*   **Warm Light (2700K - 3000K):** Soft, yellow-toned light. Primarily used in residential spaces and hotels to create a relaxed atmosphere.
*   **Neutral Light (3500K - 4500K):** Clean, white-toned light. Commonly used in offices, retail, and general workspaces.
*   **Cool Light (5000K - 6500K):** Crisp, blue-toned white light. Simulates natural daylight and is ideal for industrial environments.

---

## 2. Why Cool White Light (5000K - 6500K) Dominates Heavy Industry

Most manufacturing and warehouse projects specify LED fixtures in the **5000K to 5700K** range. Here is why:

### A. Maximizes Worker Alertness
Cool white light suppresses the production of melatonin (the sleep hormone) and promotes the release of cortisol. This keeps workers alert and focused, which is crucial for reducing accident rates on night shifts.

### B. Enhances Visual Contrast
Cool light provides higher contrast, making it easier for workers to distinguish fine details, read labels, and inspect products for quality control defects.

### C. Increases Safety on the Shop Floor
High-contrast visibility allows operators of heavy machinery to quickly spot moving parts, hazard markers, and pedestrian pathways.

---

## 3. High Color Rendering Index (CRI)

While CCT defines the color of the light itself, the **Color Rendering Index (CRI)** measures how accurately the light renders the true colors of objects. In industrial environments:
*   A CRI of **80 or higher** is recommended.
*   High CRI combined with 5000K CCT is critical for tasks like wiring electrical control panels, identifying color-coded cables, and conducting final paint or finish inspections.

---

## 4. Jinyu Capital Industrial Solutions

Jinyu Capital designs high-performance explosion-proof and industrial LED lights with customizable CCT options (ranging from 3000K to 6500K) to meet the precise requirements of your facility. Our default configuration of 5000K provides the perfect balance of brightness, safety compliance, and visual acuity.`,
    category: 'Industrial Equipment',
    author: 'Jinyu Engineering Team',
    featured_image_url: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(blogPost)
      .select();

    if (error) {
      throw error;
    }

    console.log('Second blog post published successfully!');
    console.log('ID:', data[0].id);
    console.log('Slug:', data[0].slug);
  } catch (err) {
    console.error('Failed to publish blog post:', err.message);
  }
}

publishBlog2();
