import Link from "next/link";

const faqs: { q: string; a: string }[] = [
    {
        q: "What is this?",
        a: "A private writing experience for people who want to say something to someone they loved who is no longer here — and receive one thoughtful reply, once.",
    },
    {
        q: "Who is this for?",
        a: "For grief, remembrance, and unfinished words — a parent, partner, grandparent, close friend.",
    },
    {
        q: "Is anything sent to another person?",
        a: "No. Nothing is delivered to anyone else. The reply is delivered privately to you only, by email link.",
    },
    {
        q: "When does the reply arrive?",
        a: "Within 24 hours (often sooner). The reply is delivered by email link. If it’s not visible, check Spam/Promotions and mark it as “Not spam.”",
    },
    {
        q: "Can I write in my native language?",
        a: "Yes. Any language is welcome. Write in whatever language feels natural.",
    },
    {
        q: "Where is my message stored?",
        a: "Messages are stored in the app’s database so the reply can be generated and delivered. They are not public. For the strongest privacy, avoid including sensitive personal identifiers you wouldn’t want stored (addresses, account numbers, etc.).",
    },
    {
        q: "Is this therapy or a crisis service?",
        a: "No. This is not medical care, therapy, or emergency support. If you’re in immediate danger, contact local emergency services.",
    },
    {
        q: "How many replies do I get?",
        a: "One. One entry → one reply → one closing moment.",
    },
    {
        q: "What if I close the page after paying?",
        a: "After checkout, a resume link will arrive by email. Your link is valid for 24 hours and allows one message submission during that time. If it’s not visible, check Spam/Promotions and mark it as “Not spam.”",
    },
];

export default function FaqPage() {
    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-muted">FAQ</p>

                <h1 className="font-[var(--font-lora)] text-4xl md:text-5xl leading-tight">
                    Clear answers, gently.
                </h1>

                <p className="max-w-2xl text-muted">
                    This page exists so strangers understand immediately what this is — and what it is not.
                </p>

                <div className="flex gap-4 text-sm">
                    <Link href="/" className="underline underline-offset-4 hover:text-text">
                        Back to home
                    </Link>
                    <Link
                        href="/start"
                        className="underline underline-offset-4 hover:text-text"
                    >
                        Begin
                    </Link>
                </div>
            </div>

            <div className="space-y-4">
                {faqs.map((item) => (
                    <div
                        key={item.q}
                        className="rounded-3xl border border-border bg-surface px-6 py-5"
                    >
                        <p className="font-semibold text-text">{item.q}</p>
                        <p className="mt-2 text-muted leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
