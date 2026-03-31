import { MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import Seo from "@/components/Seo";
import { brand } from "@/data/site";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";

const ContactPage = () => {
  return (
    <main className="bg-[#fffaf4] py-20">
      <Seo
        title="SP Traditional Pickles | Contact"
        description="Contact SP Traditional Pickles for orders, delivery support, and enquiries."
      />

      <section className={pageWrap}>
        <div className="banana-leaf-bg rounded-[2rem] border border-[#efe2cf] bg-[#fff8f0] px-8 py-12 md:px-12 lg:px-16">
          <h1 className="font-heading text-4xl font-semibold text-[#241612] md:text-5xl">
            Contact SP Traditional Pickles
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-[#6b5643]">
            Reach out for delivery support, product queries, or any help you need.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#eadfce]">
              <MessageCircle className="h-5 w-5 text-[#2E7D32]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#8d5a17]">
                WhatsApp
              </p>
              <a
                href={brand.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-base text-[#241612] hover:text-[#2E7D32]"
              >
                Message us now
              </a>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#eadfce]">
              <Phone className="h-5 w-5 text-[#8B0000]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#8d5a17]">
                Phones
              </p>
              <div className="mt-2 space-y-1">
                {brand.phoneNumbers.map((number) => (
                  <a
                    key={number}
                    href={`tel:${number.replace(/[^+\d]/g, "")}`}
                    className="block text-base text-[#241612] hover:text-[#8B0000]"
                  >
                    {number}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#eadfce]">
              <Truck className="h-5 w-5 text-[#2E7D32]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#8d5a17]">
                Delivery
              </p>
              <p className="mt-2 text-base leading-7 text-[#241612]">
                All India delivery available. Shipping charges are added separately at checkout.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#eadfce]">
              <MapPin className="h-5 w-5 text-[#8B0000]" />
              <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#8d5a17]">
                Address
              </p>
              <p className="mt-2 text-base leading-7 text-[#241612]">{brand.address}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#20BA5A] sm:w-auto"
            >
              Chat on WhatsApp
            </a>
            <a
              href={`tel:${brand.phoneNumbers[0].replace(/[^+\d]/g, "")}`}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#eadfd5] bg-white px-6 py-3.5 text-sm font-semibold text-[#241612] transition hover:bg-[#fff2ef] sm:w-auto"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
