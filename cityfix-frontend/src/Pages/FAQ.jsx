import React, { useMemo, useState } from "react";
import Container from "../Components/Container";

const FAQ = () => {
  const faqs = useMemo(
    () => [
      {
        q: "What is CityFix?",
        a: "CityFix is a public infrastructure issue reporting platform where citizens can report problems (like potholes or broken streetlights), track updates, and help prioritize issues through upvotes.",
      },
      {
        q: "Is CityFix an emergency service?",
        a: "No. CityFix is not an emergency service. If there is immediate danger or an emergency, please call your local emergency number right away.",
      },
      {
        q: "Do I need an account to report an issue?",
        a: "Yes, you generally need an account so your report can be tracked, updated, and linked to your profile. It also helps prevent spam and misuse.",
      },
      {
        q: "What information should I include in a report?",
        a: "Add a clear title, category, short description, accurate location, and a photo if possible. More details help staff understand the issue faster.",
      },
      {
        q: "Can I edit or delete my report after submitting?",
        a: "Yes. You can edit details (like description/photo) and delete your report from your dashboard as long as it’s still under your control and not restricted by moderation rules.",
      },
      {
        q: "How does upvoting work?",
        a: "Upvoting shows community interest and can help highlight urgent issues. You can usually toggle your upvote (add/remove) from the issue page.",
      },
      {
        q: "What do the issue statuses mean?",
        a: "Common statuses include: Pending (submitted), Staff Assigned (someone is assigned), In Progress/Working (being handled), Resolved (fixed), Closed (completed/ended), Rejected (not valid or not actionable).",
      },
      {
        q: "Can I boost an issue?",
        a: "CityFix may offer a paid ‘boost’ option to increase visibility (depending on your setup). Boosting does not guarantee faster resolution, but it can help prioritize attention.",
      },
      {
        q: "How are payments handled?",
        a: "Payments are processed securely by a third-party provider (like Stripe). CityFix does not store your full card details.",
      },
      {
        q: "How does CityFix use my location and photos?",
        a: "Location and photos help identify and verify issues. Please avoid uploading sensitive personal information. Reports may be visible to others depending on platform settings.",
      },
      {
        q: "I found wrong or inappropriate content. What should I do?",
        a: "Please report it through the platform (if available) or contact support. We may remove content or restrict accounts that violate our policies.",
      },
      {
        q: "How can I contact support?",
        a: "You can contact us at support@cityfix.example (replace this with your real support email).",
      },
    ],
    [],
  );

  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => {
    setOpenIndex((prev) => (prev === i ? -1 : i));
  };

  return (
    <div className="bg-surface pt-36 pb-20">
      <title>FAQ | CityFix</title>

      <Container>
        {/* Header */}
        <div className="mb-14 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">FAQ</h1>
          <p className="text-sm text-muted">
            Answers to common questions about CityFix.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className="rounded-2xl border border-base-300 bg-base-100/70 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base-content">
                    {item.q}
                  </span>

                  <span
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-full border border-base-300",
                      "text-base-content transition-transform duration-200",
                      isOpen ? "rotate-45" : "rotate-0",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className={[
                    "grid overflow-hidden px-5 transition-all duration-200",
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr] pb-0",
                  ].join(" ")}
                >
                  <div className="min-h-0 text-sm text-muted leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="max-w-4xl mx-auto mt-10 rounded-2xl border border-base-300 bg-base-100/60 p-5">
          <p className="text-sm text-muted">
            Still stuck? Email us at{" "}
            <span className="font-medium text-base-content">
              support@cityfix.com
            </span>{" "}
          </p>
        </div>
      </Container>
    </div>
  );
};

export default FAQ;
