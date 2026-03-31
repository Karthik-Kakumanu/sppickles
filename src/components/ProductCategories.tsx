import pickleAvakaya from "@/assets/pickle-avakaya.jpg";
import categoryPowders from "@/assets/category-powders.jpg";
import categoryVadiyalu from "@/assets/category-vadiyalu.jpg";

const categories = [
  {
    name: "Pickles",
    description: "Avakaya, Gongura, Lemon, Tomato, Garlic & more",
    image: pickleAvakaya,
    tagline: "The heart of every Telugu meal",
  },
  {
    name: "Powders",
    description: "Kandi Podi, Nuvvula Podi, Karivepaku Podi & more",
    image: categoryPowders,
    tagline: "Freshly ground, packed with flavour",
  },
  {
    name: "Vadiyalu & Appadalu",
    description: "Sun-dried rice crackers, lentil wafers & more",
    image: categoryVadiyalu,
    tagline: "Crispy traditions, made with patience",
  },
];

const ProductCategories = () => {
  return (
    <section className="relative py-24 md:py-32 mandala-bg overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-turmeric/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-chilli/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <p className="font-heading text-xs tracking-widest uppercase text-chilli font-semibold mb-3">
            Explore
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Our Traditional Kitchen
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed-lg font-body text-lg">
            Discover the heritage of authentic Andhra cuisine, passed down through generations
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className={`group flex flex-col ${
                i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              } gap-10 md:gap-12 items-center animate-fade-in`}
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2">
                <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-smooth-lg h-80 md:h-96">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full">
                    <p className="text-ivory text-sm font-semibold">
                      {i === 0 ? "🌶️ Pickles" : i === 1 ? "🧂 Powders" : "🌾 Savories"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2">
                <div className="space-y-5">
                  {/* Heading */}
                  <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground leading-tight">
                    {cat.name}
                  </h3>

                  {/* Tagline */}
                  <p className="font-body text-chilli text-lg italic font-medium">
                    "{cat.tagline}"
                  </p>

                  {/* Description */}
                  <p className="font-body text-muted-foreground leading-relaxed-lg text-base md:text-lg">
                    {cat.description}
                  </p>

                  {/* CTAs */}
                  <div className="flex gap-4 pt-4">
                    <button className="btn-primary px-6 py-3 rounded-lg text-base">
                      View Products →
                    </button>
                    <button className="btn-secondary px-6 py-3 rounded-lg text-base">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
