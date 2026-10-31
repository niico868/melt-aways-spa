import bellyFatAsset from "@/assets/journal-belly-fat-v2.png.asset.json";
import glp1Asset from "@/assets/journal-tirzep.png.asset.json";
import consultationAsset from "@/assets/journal-consult.png.asset.json";

const bellyFatThumb = bellyFatAsset.url;
const glp1Thumb = glp1Asset.url;
const consultationThumb = consultationAsset.url;

export type JournalArticle = {
  slug: string;
  category: string;
  title: string;
  description: string;
  excerpt: string;
  ctaText: string;
  image: string;
  body: string[];
  /** ISO date for the post's publication (used by lists + article page). */
  publishedAt: string;
};

export const JOURNAL_POSTS: JournalArticle[] = [
  {
    slug: "why-your-belly-fat-might-not-be-your-fault",
    category: "Body Confidence",
    publishedAt: "2026-06-23T11:00:00Z",
    title: "Why Your Belly Fat Might Not Be Your Fault (And What to Do About It)",
    description:
      "A gentle, honest guide to stubborn belly fat, body changes, and how a smarter treatment plan can help.",
    excerpt:
      "Stubborn belly fat is often more about biology than effort. Here’s why a personalized approach matters.",
    ctaText: "Book your free consultation →",
    image: bellyFatThumb,
    body: [
      "You've tried. Really tried.",
      "You've cut back, moved more, searched \"how to lose belly fat\" at 11pm, started fresh on Monday more times than you can count. And yet, that one stubborn area around your midsection just won't budge.",
      "If that sounds familiar, you're not imagining it. And you're definitely not failing.",
      "Here's something nobody talks about enough: the stomach area is one of the most hormonally sensitive parts of the body. Stress, sleep, age, medication, years of dieting and stopping — all of it can make your midsection harder to shift than it used to be.",
      "So when a woman says, \"I lose weight everywhere except my belly,\" or someone tells us, \"I used to be able to do this easily, but now nothing works\" — that's not a mindset problem. That's biology. And it's more common than most people realise.",
      "The issue isn't that you're not trying hard enough. Sometimes it's that your body needs a smarter approach, not a harder one.",
      "There's something quietly painful about avoiding photos, wearing clothes that hide instead of express, or feeling like a stranger in your own body. You might not even talk about it, but it's there every morning when you get dressed.",
      "At Melt Aways, we hear this a lot. And we never take it lightly.",
      "People come to us nervous, sometimes embarrassed. Some have spent years feeling like they've already exhausted every option. What they usually haven't had is someone who actually sits down with them, listens to their story, and builds a plan around their body, not a template.",
      "That's where we start.",
      "Two people can have the exact same goal and need completely different support. One person might need targeted body treatments. Another might need help managing cravings or staying consistent. Someone else might just need a safe, non-judgmental space to restart, and that's completely valid too.",
      "We're not here to sell you the most treatments. We're here to figure out what actually makes sense for you.",
      "That might be a combination of body contouring, wellness guidance, and accountability. Or it might be simpler than that. We don't know until we talk, and neither do you.",
      "When the right plan meets the right body, something changes. Clothes feel different. People start noticing. You catch yourself standing a little differently. The mirror stops feeling like an opponent.",
      "That shift isn't about reaching some dramatic before-and-after moment. It's smaller than that, and more personal. It's feeling like yourself again, like your body is finally working with you instead of against you.",
      "If you've been stuck, frustrated, or quietly discouraged about your belly for a while, that's reason enough to reach out.",
      "Come have a conversation. No pressure, no judgment, just an honest talk about where you are and where you'd like to be.",
      "We'll listen. We'll help you make sense of what's been happening. And if we're the right fit, we'll put together a plan that actually respects your body, your pace, and your life.",
    ],
  },
  {
    slug: "semaglutide-and-tirzepatide-what-you-should-know",
    category: "Weight Support",
    publishedAt: "2026-06-30T11:00:00Z",
    title: "Semaglutide & Tirzepatide: What You Should Know Before You Start",
    description:
      "What semaglutide and tirzepatide may help with, why consultation matters, and what realistic progress can feel like.",
    excerpt:
      "Before starting semaglutide or tirzepatide, it helps to understand how they work and what support still matters.",
    ctaText: "Book your consultation →",
    image: glp1Thumb,
    body: [
      "You've probably heard it a hundred times.",
      "\"Just eat less.\" \"Move more.\" \"It's all about discipline.\"",
      "And maybe you've nodded along, even tried again, because what else do you do when someone makes it sound that easy? But if you've ever dealt with cravings that feel bigger than your willpower, or a body that just seems to resist every effort you throw at it, you already know: it's rarely that simple.",
      "That's why more people are starting to ask about weight loss injections, specifically semaglutide and tirzepatide. And if you're one of them, you deserve a straight answer, not a sales pitch.",
      "Both are prescription medications that work with your body's appetite signals. The easiest way to think about it: imagine your hunger like a volume dial that someone cranked up and forgot to turn back down. You're not eating out of weakness. Your body is just louder than most.",
      "These treatments may help bring that volume to a more manageable level. Not silent. Not effortless. But quieter. Clients often describe it as finally having enough mental space around food to make clearer choices, without feeling like they're white-knuckling it every single day.",
      "There's a quiet shame some people feel when they start looking into weight loss injections. Like asking for help means they've given up on doing it \"the right way.\"",
      "But think about it differently. Someone with poor vision doesn't fail at seeing, they get glasses. Someone learning a skill gets coaching. Getting support for something your body is genuinely struggling with isn't giving up. It's being smart about what you actually need.",
      "That said, and this matters, the medication isn't doing the whole job. Your habits, sleep, hydration, and consistency still play a real role. What changes is that the effort starts to feel less like a battle you're losing, and more like something you can actually sustain.",
      "Not every treatment is the right fit for every person, and at Melt Aways, we take that seriously.",
      "Before we recommend anything, we want to understand you. Your goals, your history, what you've already tried, how your body has been responding. Some people are great candidates for one approach. Others need something different. And sometimes the most helpful thing we can do is explain why a particular route isn't right for where you are right now.",
      "That's not a door closing. That's honest care.",
      "Most people don't come in wanting a medical lecture. They want real answers to real questions: Will this help with cravings? Do I still need to change how I eat? What if I don't see results right away? Is this safe for me specifically?",
      "These are fair questions, and they're the ones we're here to answer. Because a plan that leaves you guessing isn't really a plan.",
      "Some clients notice changes within the first few weeks. Others need more time, and go through a stretch of quiet progress that doesn't feel like much until suddenly it does. That's why having someone in your corner matters. You shouldn't have to interpret your own body alone.",
      "Sometimes the first signs are subtle. Cravings loosen their grip a little. You don't feel stuffed and sluggish after meals anymore. Your clothes shift before the scale does. You feel slightly more in control, and that feeling compounds.",
      "Those quiet moments are worth paying attention to. They're usually the beginning of something real.",
      "Many of our clients come to us after years of diets, programs, and routines that worked for a while, then didn't. They're not looking for someone to recap everything they already know. They're looking for someone who actually listens, and helps them build something that fits their life, not just a generic plan.",
      "If you're curious about semaglutide, tirzepatide, or any of our weight loss support options, the first step isn't a commitment. It's a conversation.",
      "Fill out your intake form or book a consultation, and we'll figure out together whether a treatment makes sense for you, what that might look like, and what realistic progress could feel like for your body.",
      "No pressure. No judgment. Just clarity, and a plan that actually belongs to you.",
    ],
  },
  {
    slug: "why-we-talk-first-and-why-it-matters",
    category: "Consultation First",
    publishedAt: "2026-07-07T11:00:00Z",
    title: "Why We Talk First — and Why That Actually Matters",
    description:
      "A consultation-first approach protects clients, creates better treatment matches, and makes care feel genuinely personal.",
    excerpt:
      "The consultation is where real listening starts and where safer, smarter treatment plans take shape.",
    ctaText: "Book your consultation →",
    image: consultationThumb,
    body: [
      "Most people don't walk into Melt Aways looking for a treatment.",
      "They walk in with a feeling they've been carrying for a while.",
      "Frustration from trying things that didn't stick. Embarrassment about a part of their body they've been quietly hiding. That specific exhaustion that comes from starting over so many times you're not sure you have another start left in you. Or just a low, persistent fear that maybe nothing is going to work, not for them, not this time.",
      "We see that. And it's exactly why we don't jump straight into treatment.",
      "Before we recommend anything, we want to understand what brought you here.",
      "Maybe your body shifted after pregnancy, stress, or a hormonal change and never quite found its way back. Maybe you've done the programs, followed the plans, and still felt like something wasn't adding up. Maybe you've never done anything like this before and you're not even sure what you're looking for yet, just that something needs to change.",
      "All of that is useful information. None of it is something to be embarrassed about.",
      "Your body isn't a problem to be solved the same way for everyone. It has its own patterns, its own history, its own reasons for doing what it does. A plan worth following has to actually account for that.",
      "A real consultation isn't a formality. It's where we figure out what you actually need.",
      "Some clients come in wanting to lose inches around a specific area. Some want support with weight loss. Some are dealing with bloating, clothes that stopped fitting, or a confidence that's been slowly wearing down over years. Some just want to feel like themselves again, and they're not even sure how to describe what that would look like.",
      "The treatment is physical. But the reason behind it almost never is.",
      "That's why listening isn't optional for us. It's the whole starting point.",
      "A lot of people feel nervous before their first visit. They worry about being looked at, assessed, or worst of all, dismissed. They've sometimes spent years not talking about the thing that's been bothering them most.",
      "You can talk about it here.",
      "Whatever your body looks like right now. Whatever you've tried. Whatever you're not comfortable with. You can say it, and you'll be met with privacy, patience, and actual respect, not a polished version of it.",
      "Every body that walks through our door is welcome. Full stop.",
      "Here's something worth knowing: not every treatment is right for every goal. And the consultation is what keeps us from guessing.",
      "It's how we figure out which path makes the most sense for you, what's realistic, how many sessions you might need, what your results could actually look like, and what role you'll play in the process. Because your effort genuinely matters too. Water, consistency, follow-up care, the habits you build alongside treatment, these things aren't just fine print. They're part of what makes progress last.",
      "We're not going to promise you overnight results or tell you what you want to hear just to get you started. That's not care. That's noise. What we'll do instead is give you an honest picture and a plan that actually fits.",
      "Yes, we want you to see results. Real, visible ones.",
      "But the moments clients tend to remember most aren't always the measurements. It's putting on the outfit they'd been avoiding. Believing a compliment instead of brushing it off. Standing a little differently. Feeling like their body finally belongs to them again.",
      "That's what good care is supposed to do, not just change how you look, but quietly shift how you move through your own life.",
      "Tell us where you are. What's been bothering you. What you want to feel when you get dressed in the morning.",
      "We'll listen without judgment and guide you with honesty. No rush, no pressure, just clarity about what's possible and what it could look like for you specifically.",
      "Real results don't happen by accident. They happen when someone actually takes the time to understand you first.",
    ],
  },
];

export function getJournalArticle(slug: string) {
  return JOURNAL_POSTS.find((article) => article.slug === slug);
}