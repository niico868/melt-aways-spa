import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Section, Eyebrow } from "@/components/Section";
import { getJournalArticle } from "@/lib/journal";

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => {
    const article = getJournalArticle(params.slug);
    const title = article ? `${article.title} | Melt Aways Journal` : "Journal Article | Melt Aways";
    const description = article?.description ?? "Read the latest treatment guidance and consultation-first advice from Melt Aways.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(article ? [{ property: "og:image", content: article.image }] : []),
      ],
    };
  },
  component: JournalArticlePage,
});

function JournalArticlePage() {
  const { slug } = Route.useParams();
  const article = getJournalArticle(slug);

  if (!article) {
    return (
      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <Eyebrow>Treatment Journal</Eyebrow>
          <h1 className="text-4xl lg:text-5xl text-ink leading-tight">That article isn't available.</h1>
          <p className="mt-4 text-taupe">You can still browse the journal or book a consultation for personalized guidance.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/journal" className="inline-flex items-center gap-2 rounded-full border border-border/70 px-6 py-3 font-medium hover:bg-blush/40 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to journal
            </Link>
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full bg-fresh text-fresh-foreground px-6 py-3 font-medium btn-lux soft-shadow">
              Book consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <article className="max-w-4xl mx-auto">
        <Link to="/journal" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back to journal
        </Link>

        <header className="mt-6 text-center max-w-3xl mx-auto">
          <Eyebrow>{article.category}</Eyebrow>
          <h1 className="text-4xl lg:text-6xl text-ink leading-[1.04]">{article.title}</h1>
          <p className="mt-3 text-xs uppercase tracking-[0.22em] text-primary/70">
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          </p>
          <p className="mt-5 text-lg text-taupe leading-relaxed">{article.description}</p>
        </header>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-border/60 card-shadow bg-background">
          <img
            src={article.image}
            alt={article.title}
            className="w-full aspect-[16/9] object-cover"
            loading="eager"
            width={1280}
            height={720}
          />
        </div>

        <div className="mt-10 rounded-[2rem] border border-border/60 bg-background p-6 sm:p-8 lg:p-10 card-shadow">
          <div className="space-y-5 text-[1.02rem] leading-8 text-ink/85">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 rounded-[1.75rem] bg-cream border border-border/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-primary/70">Next step</div>
              <p className="mt-2 text-ink">Have a conversation first. We’ll guide you with honesty and clarity.</p>
            </div>
            <Link to="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-fresh text-fresh-foreground px-6 py-3 font-medium btn-lux soft-shadow">
              {article.ctaText} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </Section>
  );
}