import { MessageCircle, ShoppingBag } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import FloatingWhatsappButton from "@/components/FloatingWhatsappButton";
import SiteFooter from "@/components/SiteFooter";
import LanguageToggle from "@/components/LanguageToggle";
import { useStore } from "@/components/StoreProvider";
import { brand, navigation } from "@/data/site";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/components/LanguageProvider";

const pageWrap = "w-full px-6 md:px-10 lg:px-16 xl:px-24";
const brandMark = "/sp-pickles-mark.svg";

const SiteLayout = () => {
  const { cartCount } = useStore();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#fffaf4] text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#eadfd5] bg-[#fffaf4]/95 backdrop-blur-md">
        <div className={`${pageWrap} flex items-center justify-between gap-6 py-4 md:py-5`}>
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={brandMark}
              alt={brand.name}
              className="h-12 w-12 rounded-full border border-[#eadfd5] bg-white object-contain p-1 shadow-sm"
            />
            <div className="min-w-0">
              <p className="truncate font-heading text-3xl font-semibold tracking-[-0.02em] text-[#241612]">
                {brand.name}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#8b1e1e]">
                {t('layout.storeTagline')}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <nav className="flex items-center gap-1 rounded-full border border-[#eadfd5] bg-white/90 px-2 py-2 shadow-sm">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#6b5643] transition duration-300 hover:bg-[#fff3ef] hover:text-[#241612]"
                  activeClassName="bg-[#8b1e1e] text-white"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 rounded-full border border-[#eadfd5] bg-white px-5 py-3 text-sm font-semibold text-[#241612] shadow-sm transition duration-300 hover:border-[#8b1e1e]/20 hover:bg-[#fff3ef]"
            >
              <ShoppingBag className="h-4 w-4" />
              {t('layout.cart')} ({cartCount})
            </Link>

            <LanguageToggle />

            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-[#20BA5A] hover:shadow-lg"
            >
              <MessageCircle className="h-4 w-4" />
              {t('layout.whatsapp')}
            </a>
          </div>
        </div>

        <div className={`${pageWrap} pb-5 lg:hidden`}>
          <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-[#eadfd5] bg-white px-2 py-2 shadow-sm">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[#6b5643] transition duration-300 hover:bg-[#fff3ef] hover:text-[#241612]"
                activeClassName="bg-[#8b1e1e] text-white"
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/cart"
              className="whitespace-nowrap rounded-full bg-[#8b1e1e] px-4 py-2 text-sm font-semibold text-white"
            >
              {t('layout.cart')} ({cartCount})
            </Link>

            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <FloatingWhatsappButton />

      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
