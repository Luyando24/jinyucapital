import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Target, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen text-black">
      
      {/* Hero */}
      <section className="relative py-28 overflow-hidden bg-black text-white">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10 bg-white"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-400 mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Our Story
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-white mb-6">
            ENGINEERED FOR EXCELLENCE.
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed text-neutral-400 font-light">
            Founded with a passion for designing sleek, durable, and professional-grade explosion-proof lighting and industrial electrical solutions that fit seamlessly into modern municipal and industrial spaces.
          </p>
        </div>
      </section>

      {/* Mission Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Visual element */}
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-xl overflow-hidden border border-neutral-250 bg-neutral-50 flex items-center justify-center p-12">
                <Image
                  src="/products/O1CN01RYnR551fsuHOJPb5X_!!2219827714063-0-cib.jpg"
                  alt="Jinyu Capital Lighting Structure Design"
                  width={380}
                  height={380}
                  className="object-contain"
                />
              </div>
              {/* Floating badge */}
              <div
                className="absolute -bottom-6 -right-6 w-36 h-36 rounded-xl border border-black bg-white z-10 shadow-lg"
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="font-display text-3xl font-extrabold text-black">PRO</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400" style={{ fontFamily: "var(--font-display)" }}>Grade</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                  Who We Are
                </span>
                <h2 className="font-display text-4xl font-extrabold mt-3 mb-6 tracking-tight">
                  THE JINYU CAPITAL MISSION.
                </h2>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 font-light">
                Jinyu Capital was born out of a desire for premium, authentic industrial lighting and electrical solutions that don't compromise on build quality or aesthetic values. We noticed a gap in the market for functional, heavy-duty lighting tools that look clean, feel professional, and are built to withstand high-volume usage.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 font-light">
                Our mission is simple: to power your lighting journey. We believe that professional design and premium materials shouldn't just be for high-end commercial facilities. By engineering equipment that meets professional industrial criteria, we supply builders, contractors, and owners alike with commercial-grade solutions.
              </p>

              <div className="space-y-4 pt-4">
                <h3 className="font-display text-lg font-bold uppercase tracking-wider">Quality Standards</h3>
                {[
                  "High-performance explosion-proof design certifications",
                  "Die-cast aluminum housings rated to IP66 standards",
                  "UV-stabilized PMMA diffusers and optical systems",
                  "Eco-friendly, highly efficient LED chips and drivers",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-neutral-100 text-black"
                    >
                      <CheckCircle className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
            Our Foundation
          </span>
          <h2 className="font-display text-4xl font-extrabold mt-3 mb-16 tracking-tight">
            CORE PHILOSOPHY.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="h-6 w-6" />,
                title: "Precision Engineering",
                desc: "We stay focused on functional design, balancing luminaire optics to international standards, and ensuring maximum luminous efficiency.",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Durable Integrity",
                desc: "We never compromise on build quality. Our products are made using explosion-proof, corrosion-resistant compounds to withstand high wear.",
              },
              {
                icon: <Eye className="h-6 w-6" />,
                title: "Minimalist Aesthetics",
                desc: "We design clean, high-contrast aesthetics that blend perfectly into modern environments. Minimal visual clutter, maximum architectural focus.",
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl border border-neutral-200 bg-white hover:border-black transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6 bg-black text-white group-hover:scale-110 transition-transform"
                >
                  {val.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-4">
                  {val.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-500 font-light">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-2xl mx-auto px-4 space-y-6 relative z-10">
          <h2 className="font-display text-4xl font-extrabold tracking-tight">
            ELEVATE YOUR PROGRESS.
          </h2>
          <p className="text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
            Discover our collection and select the premium lighting systems built to illuminate your architectural spaces.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-xs uppercase tracking-widest bg-white text-black rounded-lg transition-all hover:bg-neutral-200"
              style={{ fontFamily: "var(--font-display)" }}
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
