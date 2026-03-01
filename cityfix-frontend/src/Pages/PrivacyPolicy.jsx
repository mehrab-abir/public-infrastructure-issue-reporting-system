import React from "react";
import Container from "../Components/Container";

const PrivacyPolicy = () => {
  return (
    <div className="bg-surface pt-36 pb-20">
      <title>Privacy Policy | CityFix</title>

      <Container>
        {/* Header */}
        <div className="mb-14 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            CityFix Privacy Policy
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
              This Privacy Policy explains how{" "}
              <span className="font-semibold">CityFix</span>
              (“CityFix,” “we,” “us,” “our”) collects, uses, shares, and
              protects your information when you use our website and services
              (the “Service”).
            </p>
            <p>
              By using CityFix, you agree to the practices described in this
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              1. Information We Collect
            </h2>
            <p className="mb-2">
              We may collect the following types of information:
            </p>

            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium">Account information:</span> name,
                email, profile photo, role (citizen/staff/admin).
              </li>
              <li>
                <span className="font-medium">Issue report information:</span>{" "}
                issue title, category, description, location, photos you upload,
                and timestamps.
              </li>
              <li>
                <span className="font-medium">Usage information:</span> basic
                logs like requests to our server, pages/actions, and device
                details (for performance and security).
              </li>
              <li>
                <span className="font-medium">Payments (if applicable):</span>{" "}
                transaction details like payment amount and status. We do{" "}
                <span className="font-semibold">not</span> store full card
                details; payments are handled by third-party processors.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and operate the Service</li>
              <li>Create and manage user accounts</li>
              <li>Display reports, updates, and timelines</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
              <li>Process payments for optional paid features</li>
              <li>Improve performance, features, and user experience</li>
              <li>Communicate important service updates (if needed)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              3. How We Share Information
            </h2>
            <p className="mb-2">
              We do not sell your personal information. We may share information
              only in these situations:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium">Public display of reports:</span>{" "}
                issue details (and approximate location) may be visible to other
                users to support transparency and tracking.
              </li>
              <li>
                <span className="font-medium">Service providers:</span> trusted
                third parties that help us run CityFix (hosting, authentication,
                analytics, payments).
              </li>
              <li>
                <span className="font-medium">Legal and safety:</span> if
                required by law, court orders, or to protect users and the
                Service.
              </li>
              <li>
                <span className="font-medium">Business changes:</span> in case
                of a merger, acquisition, or asset transfer (you’ll be notified
                if required).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              4. Location and Photos
            </h2>
            <p>
              CityFix may collect and display location-related information to
              support issue reporting and tracking. If you upload photos, they
              may be visible to others depending on platform settings. Please do
              not upload images containing sensitive personal information (such
              as faces of bystanders, license plates, or private addresses),
              unless necessary and lawful.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Authentication</h2>
            <p>
              CityFix may use third-party authentication (for example, Firebase)
              to help you sign in securely. Authentication providers may process
              your login information according to their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Payments</h2>
            <p>
              Payments are processed by third-party payment providers (such as
              Stripe). CityFix receives payment confirmation and basic
              transaction details (like amount, currency, and payment status),
              but we do not store your full payment card information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Data Retention</h2>
            <p>
              We keep your information only as long as necessary to operate the
              Service, comply with legal obligations, resolve disputes, and
              enforce our policies. Issue reports may be retained for historical
              tracking and transparency purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Security</h2>
            <p>
              We take reasonable steps to protect your information. However, no
              online service can guarantee absolute security. Please use strong
              passwords and keep your account secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              9. Your Choices and Rights
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You may update your profile information within the Service
              </li>
              <li>You may request deletion of your account where applicable</li>
              <li>
                You may opt out of non-essential communications (if offered)
              </li>
            </ul>
            <p className="mt-2">
              Depending on your location, you may have additional legal rights
              (such as access, correction, or deletion). If you want to exercise
              these rights, contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              10. Children’s Privacy
            </h2>
            <p>
              CityFix is not intended for children under 13. If you believe a
              child has provided personal information, please contact us and we
              will take appropriate steps.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              update the “Effective Date” above when changes are made. Continued
              use of CityFix after updates means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">12. Contact</h2>
            <p>If you have questions about this Privacy Policy, contact:</p>
            <p className="mt-1 font-medium">support@cityfix.com</p>
          </section>

          <section className="pt-6 border-t text-xs text-muted">
            <p>© {new Date().getFullYear()} CityFix. All rights reserved.</p>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;
