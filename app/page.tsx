export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Nav />
      <Hero />
      <OurBrands />
      <AboutRossari />
      <ProductLines />
      <FeaturedProducts />
      <WhyRossari />
      <ContactCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur border-b border-ink/5 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-display font-semibold text-ink">Shy</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-soft">
          <a href="#brands" className="hover:text-ink transition-colors">Our Brands</a>
          <a href="#products" className="hover:text-ink transition-colors">Products</a>
          <a href="#contact" className="btn-primary py-2 px-5 text-sm">
            Enquire Now
          </a>
        </nav>
        <a href="#contact" className="md:hidden btn-primary py-2 px-4 text-sm">
          Enquire
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sage-300 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-sage-500 -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-sage-500/20 border border-sage-400/40 px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            <span className="text-sage-300 text-sm font-semibold tracking-wide uppercase">
              Distributors
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
            Premium Pet Care,{" "}
            <span className="text-sage-300">Delivered with Care.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed max-w-2xl">
            <strong className="text-white">Shy</strong> is a distributor of the finest
            pet care brands in India. We currently carry{" "}
            <strong className="text-white">Rossari Pet Care</strong> — and are bringing more
            exceptional brands to you soon.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#products" className="btn-primary text-base">
              Explore Rossari Products
            </a>
            <a href="#contact" className="btn bg-white/10 text-white hover:bg-white/20 border border-white/20 text-base rounded-full px-6 py-3">
              Get in Touch
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 text-sm text-white/50">
            {["Dog Food", "Cat Food", "Grooming", "Supplements", "Prescription Diets", "Homecare"].map((tag) => (
              <span key={tag} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function OurBrands() {
  return (
    <section id="brands" className="py-16 bg-white border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="section-label">Our Distribution Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink mt-2">
            Brands We Carry
          </h2>
          <p className="text-ink-muted text-lg mt-3 max-w-xl mx-auto">
            We partner with innovative pet care brands to bring quality products to retailers
            and pet parents across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Rossari — Active */}
          <div className="card ring-2 ring-ink/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-semibold text-ink">Rossari Pet Care</h3>
                <p className="text-sm text-ink-muted mt-0.5">RCPPL</p>
              </div>
              <span className="badge bg-sage-100 text-sage-600 font-semibold">
                ✓ Available Now
              </span>

            </div>
            <p className="text-sm text-ink-soft leading-relaxed">
              India&apos;s most innovative pet care company — spanning premium nutrition,
              professional grooming, veterinary supplements, and homecare. pH balanced,
              paraben free, expert formulated.
            </p>
            <a href="#about" className="text-sm font-semibold text-ink hover:text-ink-soft flex items-center gap-1">
              Explore Rossari →
            </a>
          </div>

          {/* Coming Soon */}
          <div className="card bg-cream-100 border border-dashed border-ink/20 flex flex-col gap-4 opacity-75">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-display font-semibold text-ink-muted">More Brands</h3>
                <p className="text-sm text-ink-muted mt-0.5">In the pipeline</p>
              </div>
              <span className="badge bg-cream-200 text-ink-muted">
                Coming Soon
              </span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed">
              We are actively onboarding new premium pet care brands. Stay tuned —
              more categories, more choices, all through Shy.
            </p>
            <a href="#contact" className="text-sm font-semibold text-ink-muted hover:text-ink flex items-center gap-1">
              Register your interest →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutRossari() {
  const stats = [
    { label: "Product Lines", value: "10+", desc: "Across food, grooming & health" },
    { label: "Pet Products", value: "50+", desc: "SKUs for dogs, cats & homes" },
    { label: "pH Balanced", value: "100%", desc: "All grooming formulations" },
    { label: "Free From", value: "Harsh Chemicals", desc: "Paraben, Silicone & Sulphate free" },
  ];

  return (
    <section id="about" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">About Rossari</span>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink mt-2">
              Everything for Pets, Nothing Compromised
            </h2>
            <p className="text-ink-soft text-lg leading-relaxed mt-4">
              Rossari Pet Care is driven by the core purpose of providing innovative,
              high-quality products to ensure exceptional care for pets, thereby enriching
              the unique bond between people and their animal companions.
            </p>
            <p className="text-ink-soft text-lg leading-relaxed mt-4">
              Their strategic vision is to achieve global recognition as the most respected
              and innovative pet care company — committing to enrich the relationship between
              people and their pets through honest engagement and the highest standards of
              innovation, quality, and environmental responsibility.
            </p>
            <p className="text-ink-soft text-lg leading-relaxed mt-4">
              Every product is crafted to foster a cleaner, healthier life for your pet and
              to strengthen the unique bond you share.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card">
                <div className="text-2xl font-display font-bold text-ink">{stat.value}</div>
                <div className="text-sm font-semibold text-ink mt-1">{stat.label}</div>
                <div className="text-xs text-ink-muted mt-1">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const productLines = [
  {
    name: "Sniffy",
    tagline: "Gluten Free Dog Food",
    colorClass: "bg-cream-100 border-cream-200",
    icon: "🐕",
    description:
      "Premium gluten-free dry food for dogs at every life stage — Baby Buddy, Starter, Puppy, and Adult — all crafted with real Chicken & Egg.",
    variants: ["Baby Buddy Pack", "Starter", "Puppy", "Adult"],
    highlight: "Gluten Free",
  },
  {
    name: "Zippy",
    tagline: "Dog Food & Treats",
    colorClass: "bg-cream-100 border-cream-200",
    icon: "🦴",
    description:
      "A complete range of dry food, wet food, dental sticks, and treats. New improved formula with enhanced brain, eye, gut, and oral health benefits.",
    variants: ["Dry Food", "Wet Food (85g)", "Dental Sticks", "Chick N' Stix Treats"],
    highlight: "New Improved Formula",
  },
  {
    name: "Toptail",
    tagline: "Cat Food & Treats",
    colorClass: "bg-cream-100 border-cream-200",
    icon: "🐈",
    description:
      "Crafted for the discerning feline — Ocean Fish, Laddi Range, Wet Food in gravy, Squeezy Creamy Treats, and crunchy Dry Treats.",
    variants: ["Ocean Fish", "Laddi Range", "Wet Food", "Squeezy Treats", "Dry Treats"],
    highlight: "Made for Cats",
  },
  {
    name: "Vetsense",
    tagline: "Prescription Diets & Supplements",
    colorClass: "bg-cream-100 border-cream-200",
    icon: "💊",
    description:
      "Veterinarian-formulated prescription diets and chewable supplements targeting renal, hepatic, derma, GI, weight management, and more.",
    variants: ["Renal Support", "Hepatic Support", "Weight Management", "Derma Support", "GI Support", "Weaning Diet"],
    highlight: "Vet Formulated",
  },
  {
    name: "Lozalo",
    tagline: "Natural Choice for Pet Grooming",
    colorClass: "bg-sage-50 border-sage-100",
    icon: "🛁",
    description:
      "pH balanced, paraben-free, silicone-free grooming with natural extracts. Fruit, Floral, Privilege, Botanical, Medicated, and Professional ranges.",
    variants: ["Fruit Range", "Floral Range", "Privilege Range", "Botanical Range", "Professional 5L", "Medicated Range"],
    highlight: "pH Balanced · Paraben Free",
  },
  {
    name: "Lozalo Homecare",
    tagline: "A Clean Home for Healthy Pets",
    colorClass: "bg-sage-50 border-sage-100",
    icon: "🏠",
    description:
      "Keep your pet's environment spotless with Kennel Wash, Disinfectant Surface Cleaner, Multi-Surface Cleaner, Pet Wipes, Fabric Detergent, Cat Litter, and Dusting Talc.",
    variants: ["Kennel Wash", "Disinfectant Cleaner", "Pet Wipes", "Fabric Detergent", "Cat Litter", "Dusting Talc"],
    highlight: "Home & Kennel Safe",
  },
];

function ProductLines() {
  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Rossari Product Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink mt-2">
            Complete Care, Every Category
          </h2>
          <p className="text-lg text-ink-muted mt-3 max-w-2xl mx-auto">
            Six specialized product lines covering everything from daily nutrition to
            professional grooming and home hygiene.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productLines.map((line) => (
            <div
              key={line.name}
              className={`rounded-2xl border p-6 flex flex-col gap-4 hover:shadow-soft transition-shadow duration-200 ${line.colorClass}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-soft">
                  {line.icon}
                </div>
                <span className="badge bg-white text-ink border border-ink/10 text-[11px]">
                  {line.highlight}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-display font-semibold text-ink">{line.name}</h3>
                <p className="text-sm font-medium text-ink-muted">{line.tagline}</p>
              </div>

              <p className="text-sm text-ink-soft leading-relaxed">{line.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {line.variants.map((v) => (
                  <span
                    key={v}
                    className="text-xs rounded-full bg-white border border-ink/10 px-2.5 py-1 text-ink-soft"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const featuredProducts = [
  {
    category: "Vetsense Supplements",
    name: "Vetsense Gold",
    subtitle: "Comprehensive Multivitamin",
    price: "₹249",
    pack: "30 Tablets",
    description:
      "Enriched with Vitamin A, B-complex, and essential minerals to improve heart function, strengthen immunity, and protect against oxidative damage.",
    benefits: ["Enhances Heart Functioning", "Supports Immune System", "Boosts Antioxidants", "GMO Free · Gluten Free"],
    suitableFor: "Dogs 12 weeks & above",
  },
  {
    category: "Vetsense Supplements",
    name: "Vetsense Joint Care",
    subtitle: "Advanced Joint Support",
    price: "₹449",
    pack: "30 Tablets",
    description:
      "Collagen, Hyaluronic Acid, Chondroitin, and Glucosamine work together to strengthen bones, lubricate joints, and protect ligaments from wear and tear.",
    benefits: ["Supports Healthy Hips & Joints", "Improves Mobility", "Relieves Pain & Discomfort", "Hemp Seed Oil + MSM"],
    suitableFor: "Dogs 12 weeks & above",
  },
  {
    category: "Vetsense Supplements",
    name: "Skin & Coat Care",
    subtitle: "Biotin & Omega Complex",
    price: "₹349",
    pack: "30 Tablets",
    description:
      "Formulated with Biotin, Omega Fatty Acids, Zinc, and Aloe Vera to manage itching, dermatitis, and hotspots while promoting a radiant, healthy coat.",
    benefits: ["Safely Deters Fleas", "Keeps Skin Hydrated", "Supports Healthy Coat", "Omega 3 & 6 · Brewer's Yeast"],
    suitableFor: "Dogs 12 weeks & above",
  },
  {
    category: "Vetsense Dermal Care",
    name: "Itch Relief Spray",
    subtitle: "Aloe Vera & Tea Tree Oil",
    price: "₹350",
    pack: "100 ml",
    description:
      "Calms hot spots, itching, and skin concerns while deeply moisturizing dry and damaged coats. Sulphate free, paraben free, chemical dye free.",
    benefits: ["For Dogs & Cats of All Ages", "Calms Hot Spots & Itching", "Sulphate & Paraben Free", "Natural Botanical Ingredients"],
    suitableFor: "Dogs & Cats, all ages",
  },
  {
    category: "Vetsense Dermal Care",
    name: "Odour Control Spray",
    subtitle: "Kiwi Blossom Freshness",
    price: "₹320",
    pack: "200 ml",
    description:
      "Targets odour-causing bacteria using Baking Soda, Kiwi Extract, Aloe Vera, and Grapefruit Seed Extract. Long-lasting freshness for skin and coat.",
    benefits: ["Neutralizes Odour Bacteria", "pH Balanced", "Sulphate & Paraben Free", "Kiwi + Aloe Vera + Grapefruit"],
    suitableFor: "Dogs & Cats",
  },
  {
    category: "Lozalo Professional Grooming",
    name: "Professional Conditioner",
    subtitle: "With Collagen Protein",
    price: "₹999",
    pack: "1 Litre",
    description:
      "The professional groomer's choice for luxurious, healthy coats. Rinse-off conditioner with Collagen Protein — sulphate free, paraben free, silicone free, pH balanced.",
    benefits: ["Collagen Protein Formula", "Rinse-Off Conditioner", "Sulphate · Paraben · Silicone Free", "pH Balanced"],
    suitableFor: "Professional Groomers",
  },
];

function FeaturedProducts() {
  return (
    <section className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="section-label">Spotlight</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-ink mt-2">
            Featured Rossari Products
          </h2>
          <p className="text-lg text-ink-muted mt-3 max-w-2xl mx-auto">
            A closer look at some of the most impactful products in the Rossari range.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((p) => (
            <div key={p.name} className="card border-l-4 border-l-ink flex flex-col gap-3">
              <div>
                <span className="text-xs font-semibold text-ink-muted uppercase tracking-wide">{p.category}</span>
                <h3 className="text-lg font-display font-semibold text-ink mt-0.5">{p.name}</h3>
                <p className="text-sm text-ink-muted">{p.subtitle}</p>
              </div>

              <p className="text-sm text-ink-soft leading-relaxed">{p.description}</p>

              <ul className="space-y-1 mt-auto">
                {p.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-ink-soft">
                    <span className="text-sage-500 mt-0.5 flex-shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-cream-200">
                <span className="text-xs text-ink-muted">Suitable for: {p.suitableFor}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const pillars = [
  {
    icon: "🌿",
    title: "Natural Extracts",
    description:
      "Formulations built on botanical ingredients — Aloe Vera, Tea Tree, Jojoba, Kiwi Extract, Grapefruit Seed, Colloidal Oatmeal, and more.",
  },
  {
    icon: "🧪",
    title: "pH Balanced",
    description:
      "Every grooming product is pH balanced to match your pet's skin chemistry, preventing irritation and dryness.",
  },
  {
    icon: "✅",
    title: "Free from Harsh Chemicals",
    description:
      "The entire grooming range is paraben free, silicone free, sulphate free, and chemical dye free.",
  },
  {
    icon: "🐾",
    title: "For All Life Stages",
    description:
      "From weaning kittens and puppies to senior dogs — every product range covers all ages and breeds.",
  },
  {
    icon: "💡",
    title: "Vet & Expert Formulated",
    description:
      "The Vetsense line is designed by veterinary experts for prescription-grade nutrition and therapeutic care.",
  },
  {
    icon: "🌍",
    title: "Global Ambitions, Indian Roots",
    description:
      "Rossari is committed to achieving global recognition as the most respected and innovative pet care company.",
  },
];

function WhyRossari() {
  return (
    <section className="py-20 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sage-400 font-semibold text-sm uppercase tracking-widest">Why Rossari</span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mt-2">
            The Rossari Difference
          </h2>
          <p className="text-lg text-white/50 mt-3 max-w-2xl mx-auto">
            Science-backed, nature-inspired, and built with an unwavering commitment to pet well-being.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-4">{p.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section id="contact" className="py-20 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-ink p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
              Ready to partner with Shy?
            </h2>
            <p className="text-white/60 text-lg mt-3 max-w-xl">
              We distribute Rossari Pet Care products across India. Reach out for
              product enquiries, pricing, and wholesale orders — and be the first to
              know when new brands join our portfolio.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a href="mailto:info@shycares.in" className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                <span className="text-xl">📧</span>
                <span className="font-medium">info@shycares.in</span>
              </a>
              <a
                href="https://wa.me/919887445671"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
              >
                <span className="text-xl">📱</span>
                <span className="font-medium">+91 98874 45671</span>
              </a>
            </div>
          </div>
          <a
            href="mailto:info@shycares.in"
            className="flex-shrink-0 btn-primary text-lg px-8 py-4"
          >
            Enquire Now →
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-ink border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xl font-display font-semibold text-white">Shy</span>
            <p className="text-white/40 text-sm mt-1">Distributors · Rossari Pet Care & more</p>
          </div>
          <div className="text-center text-sm text-white/40">
            <p>Rossari Pet Care (RCPPL) products distributed by Shy</p>
            <p className="mt-1">© {new Date().getFullYear()} Shy. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#brands" className="hover:text-white transition-colors">Our Brands</a>
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
