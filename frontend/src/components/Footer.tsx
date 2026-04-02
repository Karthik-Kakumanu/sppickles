import BilingualText from "@/components/BilingualText";

const Footer = () => {
  return (
    <footer className="py-10 bg-card border-t border-border">
      <div className="container max-w-5xl mx-auto px-6 text-center">
        <BilingualText
          as="p"
          te="అసలైన బ్రాహ్మణ పచ్చళ్ళు"
          en="Authentic Brahmin Pickles"
          className="mb-2 text-foreground"
          teluguClassName="font-heading text-lg font-bold"
          englishClassName="font-heading text-xl font-bold"
        />
        <BilingualText
          as="p"
          te="విజయవాడ, ఆంధ్రప్రదేశ్"
          en="Vijayawada, Andhra Pradesh"
          className="mb-1 text-muted-foreground"
          teluguClassName="font-body text-xs"
          englishClassName="font-body text-sm"
        />
        <BilingualText
          as="p"
          te="అసలైన ఆంధ్ర రుచి, మా వంటింటి నుంచి మీ పళ్లెం వరకు"
          en="Authentic Andhra taste, from our kitchen to your plate"
          className="mb-6 text-muted-foreground"
          teluguClassName="font-body text-xs"
          englishClassName="font-body text-sm"
        />
        <div className="section-divider mb-6" />
        <BilingualText
          as="p"
          te={`© ${new Date().getFullYear()} అసలైన బ్రాహ్మణ పచ్చళ్ళు. అన్ని హక్కులు రిజర్వు.`}
          en={`© ${new Date().getFullYear()} Authentic Brahmin Pickles. All rights reserved.`}
          className="text-muted-foreground"
          teluguClassName="font-body text-[11px]"
          englishClassName="font-body text-xs"
        />
      </div>
    </footer>
  );
};

export default Footer;
