import { Button } from "@/components/ui/button";

export default function FinalCTA() {
  return (
    <section id="contact" className="section-wrapper text-center">
      <h2 className="heading is-display">Start your next build faster</h2>
      <p className="text mt-4 max-w-2xl mx-auto">
        Duplicate this project, update the style guide, then move into skeleton and copy phases with confidence. The
        infrastructure is ready for hot reload, static export, and CDN asset uploads.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button size="lg">Open in Studio</Button>
        <Button variant="secondary" size="lg" asChild>
          <a href="/style-guide">Review visual system</a>
        </Button>
      </div>
    </section>
  );
}
