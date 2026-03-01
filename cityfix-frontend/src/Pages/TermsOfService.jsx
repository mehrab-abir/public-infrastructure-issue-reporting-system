import React from "react";
import Container from "../Components/Container";

const TermsOfService = () => {
  return (
    <div className="bg-surface pt-36 pb-20">
      <title>Terms of Service | CityFix</title>

      <Container>
        {/* Header */}
        <div className="mb-14 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            CityFix Terms of Service
          </h1>
          <p className="text-sm text-muted">
            <span className="font-semibold">Effective Date:</span> February 28,
            2026
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-10 text-sm leading-relaxed">
          {/* Intro */}
          <section>
            <p className="mb-3">
              Welcome to <span className="font-semibold">CityFix</span>
              (“CityFix,” “we,” “us,” “our”). These Terms of Service (“Terms”)
              govern your access to and use of the CityFix website, mobile
              features (if any), and services (collectively, the “Service”).
            </p>
            <p>
              By accessing or using the Service, you agree to these Terms. If
              you do not agree, please do not use the Service.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-lg font-semibold mb-2">
              1. Purpose of CityFix
            </h2>
            <p>
              CityFix enables users to report public infrastructure issues such
              as potholes, damaged sidewalks, broken streetlights, and similar
              concerns. Users may track updates, view timelines, upvote issues,
              and access optional paid features.
            </p>
            <p className="mt-2 font-medium">
              CityFix is not an emergency service. For emergencies, contact your
              local emergency services immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              2. Eligibility and Accounts
            </h2>
            <p>
              You must be at least 13 years old to use CityFix. If you are under
              the age of majority in your jurisdiction, you must have permission
              from a parent or guardian.
            </p>
            <p className="mt-2">
              You are responsible for maintaining the security of your account
              and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              3. User Content and Conduct
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate and truthful reports</li>
              <li>Do not submit false or misleading information</li>
              <li>Respect others — no harassment, hate, or abusive content</li>
              <li>
                Do not upload illegal content or content that violates privacy
              </li>
              <li>Avoid sharing sensitive personal information of others</li>
            </ul>
            <p className="mt-2">
              We reserve the right to remove content or restrict accounts that
              violate these rules.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              4. Photos, Locations, and Permissions
            </h2>
            <p>
              By uploading photos or location data, you confirm that you have
              the legal right to share such content and that it does not violate
              privacy, intellectual property, or local laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Content License</h2>
            <p>
              You retain ownership of your content. However, by submitting
              content to CityFix, you grant us a non-exclusive, worldwide,
              royalty-free license to use, display, store, and distribute that
              content solely for operating and improving the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              6. Paid Features and Payments
            </h2>
            <p>
              CityFix may offer paid features such as issue boosting or
              subscriptions. Payments are processed securely through third-party
              providers.
            </p>
            <p className="mt-2">
              Unless required by law, all payments are non-refundable once
              completed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              7. No Guarantee of Resolution
            </h2>
            <p>
              CityFix does not guarantee that reported issues will be reviewed,
              addressed, or resolved within any specific timeframe. Paid
              features do not guarantee faster resolution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              8. Prohibited Activities
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Attempting to hack or disrupt the Service</li>
              <li>Scraping or copying data at scale</li>
              <li>Uploading malware or harmful code</li>
              <li>Impersonating others or misrepresenting identity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              9. Moderation and Enforcement
            </h2>
            <p>
              CityFix may suspend or terminate access, remove content, or limit
              features if these Terms are violated or if required for legal or
              safety reasons.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">10. Disclaimers</h2>
            <p>
              The Service is provided “as is” and “as available.” CityFix
              disclaims all warranties to the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              11. Limitation of Liability
            </h2>
            <p>
              CityFix will not be liable for indirect, incidental, or
              consequential damages. Total liability will not exceed the amount
              you paid to CityFix in the past 12 months, if any.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              12. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. Continued use of the
              Service after changes indicates acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">13. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mt-1 font-medium">support@cityfix.example</p>
          </section>

          <section className="pt-6 border-t text-xs text-muted">
            <p>© {new Date().getFullYear()} CityFix. All rights reserved.</p>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;
