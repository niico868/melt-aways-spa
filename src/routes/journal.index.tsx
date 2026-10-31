import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { JOURNAL_POSTS } from "@/lib/journal";

export const Route = createFileRoute("/journal/")({
  component: JournalIndex,
});

function JournalIndex() {
  return (
    <Section>
      <div className="max-w-3xl mx-auto text-center mb-14">
        <Eyebrow>Treatment Journal</Eyebrow>
        <h1 className="text-4xl lg:text-6xl font-light text-ink leading-tight">Honest guidance, treatment education, and seasonal preparation.</h1>
        <p className="mt-5 text-taupe leading-relaxed">
          A growing library of articles from the Melt Aways team. We share what we share with clients in consultation,
          so you can feel informed before you book.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JOURNAL_POSTS.map((a) => (
          <article key={a.slug} className="bg-background rounded-3xl border border-border/60 card-shadow overflow-hidden flex flex-col">
            <img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" loading="lazy" width={1280} height={720} />
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.2em] text-primary/80">
                <span>{a.category}</span>
                <time dateTime={a.publishedAt} className="text-taupe/80 tracking-normal normal-case">
                  {new Date(a.publishedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                </time>
              </div>
              <h2 className="mt-2 text-xl text-ink leading-snug">{a.title}</h2>
              <p className="mt-3 text-sm text-taupe leading-relaxed flex-1">{a.excerpt}</p>
              <Link to="/journal/$slug" params={{ slug: a.slug }} className="mt-5 inline-flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
                Read article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <p className="text-center mt-12 text-sm text-taupe">
        Want guidance tailored to your body and goals? <Link to="/booking" className="text-primary font-medium hover:underline">Book a consultation</Link> and start with a conversation.
      </p>
    </Section>
  );
}