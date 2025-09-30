"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Jordan M.",
    identity: "LGBTQIA+ Client",
    quote:
      "Finally found a therapist who truly understands the challenges of being queer in Texas. Blanca created a space where I could be completely authentic without fear of judgment.",
    rating: 5,
  },
  {
    name: "Maria S.",
    identity: "Trauma Survivor",
    quote:
      "The EMDR sessions changed my life. After years of carrying trauma, I finally feel like I can breathe again. Blanca's approach is both gentle and incredibly effective.",
    rating: 5,
  },
  {
    name: "Alex R.",
    identity: "Young Professional",
    quote:
      "As someone struggling with anxiety and depression, I was skeptical about therapy. But Blanca's progressive approach and genuine care made all the difference. I actually look forward to our sessions.",
    rating: 5,
  },
  {
    name: "Carmen L.",
    identity: "Immigrant Client",
    quote:
      "Finding culturally responsive therapy was so important to me. Blanca understands the unique challenges immigrants face and helps me navigate both healing and identity with such compassion.",
    rating: 5,
  },
];

export default function Testimonials({ sectionId }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section data-section-id={sectionId} className="py-20 safe-space">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="heading is-section mb-6">Stories of Healing &amp; Growth</h2>
            <p className="text is-lead max-w-3xl mx-auto">
              Real experiences from clients who found their path to authentic healing
            </p>
          </div>

          <div className="relative">
            <div className="inclusive-card text-center min-h-[300px] flex flex-col justify-center animate-fade-in-up">
              <Quote className="w-12 h-12 text-brand mx-auto mb-6 opacity-50" />

              <blockquote className="text-xl md:text-2xl font-serif text-brand-soft leading-relaxed mb-8 italic">
                "{testimonials[currentSlide].quote}"
              </blockquote>

              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[currentSlide].rating }).map((_, index) => (
                  <Star key={index} className="w-5 h-5 text-accent fill-current" />
                ))}
              </div>

              <div>
                <p className="font-semibold text-brand-soft text-lg">{testimonials[currentSlide].name}</p>
                <p className="text text-muted">{testimonials[currentSlide].identity}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-surface shadow-gentle hover:shadow-warm hover:bg-brand-soft/20 hover:text-brand-soft transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-surface shadow-gentle hover:shadow-warm hover:bg-brand-soft/20 hover:text-brand-soft transition"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-brand w-8" : "bg-border hover:bg-brand/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text text-sm text-muted italic">
              Client names have been changed to protect privacy. Testimonials shared with permission.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
