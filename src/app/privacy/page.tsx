import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – AI Sheet Builder",
  description: "How we collect, use, and protect your data in 2025.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Last updated: 2025. This page explains how AI Sheet Builder collects,
          uses, and protects your information when you use our website and tools.
        </p>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Information we collect
            </h2>
            <p>
              When you create an account, join a waitlist, or contact us, we may
              collect information such as your name, email address, phone number,
              workspace details, and any messages you send us. We also collect
              usage data about how you interact with our product, along with
              standard log data and device information.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Cookies and analytics
            </h2>
            <p>
              We use cookies and similar technologies to keep you signed in,
              remember your preferences, and understand how people use the
              product. In 2025, we also rely on privacy-aware analytics tools
              to measure performance and improve reliability. You can adjust
              your browser settings to limit or disable cookies, but some
              features may no longer work as expected.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              How we use your information
            </h2>
            <p>
              We use the information we collect to operate and improve AI Sheet
              Builder, respond to support requests, customize your experience,
              and develop new features. With your consent, we may use your email
              address and phone number to send onboarding content, feature
              updates, and marketing messages related to AI Sheet Builder. You
              can opt out of marketing communications at any time by using the
              unsubscribe link in emails or by contacting us directly.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Sharing and selling of data
            </h2>
            <p>
              We do not sell your personal data as a standalone product. We may
              share limited information with trusted service providers who help
              us run the product, such as email providers, analytics platforms,
              payment processors, or customer support tools. These providers are
              only allowed to use your information on our behalf and under
              appropriate data protection safeguards.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Your rights &amp; choices
            </h2>
            <p>
              Depending on where you live, you may have rights to access, update,
              or delete your personal data, and to object to or restrict certain
              types of processing. If you would like to exercise any of these
              rights, or if you want to stop receiving marketing messages, please
              contact us using the details provided in the product or on our main
              website.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              Contact &amp; legal note
            </h2>
            <p>
              If you have questions about this Privacy Policy or how we handle
              your data, please reach out using the support channels listed on
              our site. This summary is provided for general information only
              and does not constitute legal advice.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
