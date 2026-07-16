const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function publishBlog() {
  console.log('Publishing new blog post to database...');

  const blogPost = {
    title: 'Understanding ATEX and IECEx Certifications for Industrial Lighting',
    slug: 'understanding-atex-iecex-certifications',
    excerpt: 'A comprehensive guide to safety standards, hazardous area zoning, and certification requirements for industrial lighting equipment.',
    content: `# Understanding ATEX and IECEx Certifications for Industrial Lighting

Operating in hazardous environments requires equipment built to the highest safety specifications. Whether it is an oil refinery, a chemical processing plant, a grain silo, or a marine vessel, the presence of flammable gases, vapors, or combustible dust presents a persistent risk of explosion. 

Choosing the right lighting is not just a matter of performance—it is a critical safety choice. Two international standards govern the certification of equipment for these hazardous areas: **ATEX** and **IECEx**.

---

## 1. What are ATEX and IECEx?

While both certifications serve the same fundamental purpose—ensuring that electrical equipment does not trigger an explosion—they operate under different regulatory jurisdictions:

*   **ATEX (Atmosphères Explosibles):** This is a European Union directive. It is mandatory for any equipment sold or installed in explosive atmospheres within the European Economic Area (EEA).
*   **IECEx (International Electrotechnical Commission System for Certification to Standards Relating to Equipment for Use in Explosive Atmospheres):** This is an international certification scheme designed to facilitate global trade. It is accepted in many countries worldwide outside of Europe.

---

## 2. Hazardous Area Zones Explained

Hazardous locations are classified into zones based on the frequency and duration of the occurrence of an explosive atmosphere:

### For Gases, Vapors, and Mists:
*   **Zone 0:** An area where explosive atmospheres are present continuously or for long periods (e.g., inside fuel tanks).
*   **Zone 1:** An area where explosive atmospheres are likely to occur in normal operation (e.g., near filling stations).
*   **Zone 2:** An area where explosive atmospheres are not likely to occur in normal operation, and if they do, they will exist for a short time only.

### For Combustible Dusts:
*   **Zone 20:** Continuous presence of combustible dust.
*   **Zone 21:** Dust likely to occur in normal operation.
*   **Zone 22:** Dust not likely to occur in normal operation, or only for a short time.

*Jinyu Capital designs and manufactures lighting fixtures certified for use in **Zone 1, Zone 2, Zone 21, and Zone 22** environments.*

---

## 3. Key Protection Concepts for LED Lighting

To achieve certification, LED fixtures utilize several protection methods:

1.  **Flameproof Enclosure ("d"):** The enclosure is built to contain any internal explosion and cool the resulting flame before it reaches the surrounding atmosphere.
2.  **Increased Safety ("e"):** Extra measures are applied to prevent the possibility of excessive temperatures, arcs, or sparks.
3.  **Encapsulation ("m"):** Spark-producing components are sealed in resin to keep explosive gases away.

---

## 4. Why Compliance Matters

Using non-certified lighting in a hazardous area can lead to catastrophic consequences. Beyond the legal liabilities and potential regulatory fines, compliance ensures the safety of your workforce and the integrity of your facility.

When purchasing lighting for industrial projects, always verify the certification markings on the fixture's nameplate. Jinyu Capital is committed to safety compliance, supplying fully tested and globally certified explosion-proof lighting fixtures.`,
    category: 'Explosion-Proof Lighting',
    author: 'Jinyu Engineering Team',
    featured_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
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

    console.log('Blog post published successfully!');
    console.log('ID:', data[0].id);
    console.log('Slug:', data[0].slug);
  } catch (err) {
    console.error('Failed to publish blog post:', err.message);
  }
}

publishBlog();
