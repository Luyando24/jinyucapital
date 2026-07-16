const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function publishBlog3() {
  console.log('Publishing third blog post to database...');

  const blogPost = {
    title: 'Smart Street Lighting: The Backbone of Future Smart Cities',
    slug: 'smart-street-lighting-backbone-smart-cities',
    excerpt: 'Explore how IoT-enabled LED street lamps are driving urban energy efficiency, traffic coordination, and environmental monitoring.',
    content: `# Smart Street Lighting: The Backbone of Future Smart Cities

As cities around the world grow larger and more dense, local governments are turning to smart technology to optimize public services, reduce carbon emissions, and enhance urban safety. 

One of the most cost-effective and immediate entry points to smart city infrastructure is **Smart Street Lighting**. By converting traditional sodium vapor street lamps into intelligent, connected LED nodes, cities can save massive amounts of energy and build a backbone for the Internet of Things (IoT).

---

## 1. Beyond Illumination: The Smart Light Pole

A modern street lamp post is no longer just a support for a light fixture. Located at regular intervals along public roadways and equipped with power access, street poles are prime real estate for hosting a wide array of sensors and systems:

*   **Environmental Sensors:** Continuous air quality tracking (measuring particulate matter, CO2, and humidity).
*   **Traffic and Pedestrian Counting:** Optical cameras that help municipal software analyze traffic flow and detect gridlock or pedestrian density.
*   **Public Safety Systems:** Wi-Fi hotspots, emergency call buttons, and speakers for community announcements.
*   **EV Charging Stations:** Integrated street-side charging points for electric vehicles in neighborhoods where off-street parking is scarce.

---

## 2. Dynamic Scheduling & Dimming

Traditional streetlights run on basic photocells or rigid timers. They remain on at 100% brightness all night, wasting substantial electricity during low-traffic periods.

Smart streetlights utilize central control systems to dynamically adjust brightness based on:
1.  **Astronomical Clocks:** Tracking exact sunrise and sunset times to adjust ON/OFF schedules.
2.  **Traffic Detection:** Raising light output when a vehicle approaches and dimming down when the street is empty.
3.  **Weather Conditions:** Increasing light intensity during heavy fog, storms, or snow for optimal driver visibility.

These adaptive control strategies can yield up to **40% additional energy savings** beyond the initial savings of converting to LED fixtures.

---

## 3. The Role of OEM/ODM Manufacturing

Deploying smart lighting requires customized hardware designs to integrate diverse IoT controllers (such as NEMA or Zhaga sockets) and internal power supplies.

Jinyu Capital acts as a premier **OEM/ODM manufacturing partner** for smart city contractors and global lighting brands. We offer:
*   **Zhaga and NEMA Controller Compatibility:** Seamless integration of smart city communication nodes.
*   **Precision Aluminum Die-Casting:** Highly durable, IP66-rated enclosures that withstand extreme weather.
*   **Custom Optics and Photometrics:** Tailored light distribution patterns (Type I, II, III, IV, or V) to maximize driver safety.

---

## 4. Building the Future of Urban Living

Smart street lighting is more than a cost-saving measure—it is a foundation for cleaner, safer, and more connected cities. As IoT systems continue to evolve, Jinyu Capital remains at the forefront of manufacturing the core lighting technologies that make urban development sustainable.`,
    category: 'OEM/ODM Solutions',
    author: 'Jinyu Engineering Team',
    featured_image_url: 'https://images.unsplash.com/photo-1474112704763-f1119d8a6b3d?auto=format&fit=crop&q=80',
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

    console.log('Third blog post published successfully!');
    console.log('ID:', data[0].id);
    console.log('Slug:', data[0].slug);
  } catch (err) {
    console.error('Failed to publish blog post:', err.message);
  }
}

publishBlog3();
