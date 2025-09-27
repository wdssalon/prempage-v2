import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
