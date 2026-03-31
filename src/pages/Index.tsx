import MarketplaceHome from "@/components/MarketplaceHome";

type IndexProps = {
  initialFilter?: string;
  autoScrollToProducts?: boolean;
};

const Index = ({ initialFilter, autoScrollToProducts = false }: IndexProps) => (
  <main>
    <MarketplaceHome
      initialFilter={initialFilter}
      autoScrollToProducts={autoScrollToProducts}
    />
  </main>
);

export default Index;
