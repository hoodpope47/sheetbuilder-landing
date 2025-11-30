import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – AI Sheet Builder",
  description: "The rules for using the AI Sheet Builder website and tools.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-600 mb-8">
          Last updated: 2025. These Terms of Service explain how you may use
          the AI Sheet Builder website and tools.
        </p>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              1. Using AI Sheet Builder
            </h2>
            <p>
              AI Sheet Builder is designed to help you generate structured
              Google Sheets templates, prompts, and workflows. By accessing or
              using the product, you agree to follow these terms and any
              additional guidelines we publish in the interface.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              2. Your account and responsibilities
            </h2>
            <p>
              You are responsible for keeping your account secure and for all
              activity that happens under your login. You agree not to share
              your password, attempt to impersonate someone else, or use the
              product in a way that violates any applicable law or regulation.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              3. Acceptable use
            </h2>
            <p>
              You agree not to misuse AI Sheet Builder, including by attempting
              to access systems without authorization, reverse-engineering or
              scraping the service, sending spam, or uploading content that is
              unlawful, harmful, or infringing. We may suspend or terminate
              access if we reasonably believe your use risks harm to the
              product, our infrastructure, or other users.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              4. AI-generated content
            </h2>
            <p>
              Our tools may generate formulas, text, or other suggestions using
              AI models. You are responsible for reviewing outputs before using
              them in your business. We do not guarantee that any generated
              content is error-free, compliant, or fit for a particular purpose.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              5. Communications and marketing
            </h2>
            <p>
              We may use the email address or phone number associated with your
              account to send important product notices, onboarding information,
              and optional marketing updates about AI Sheet Builder. You can
              opt out of marketing at any time as described in our Privacy
              Policy, but we may still send transactional or service-related
              messages.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              6. Disclaimer of warranties
            </h2>
            <p>
              AI Sheet Builder is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. We strive to keep the service fast and
              reliable, but we do not promise that it will be uninterrupted,
              error-free, or meet every requirement. You use the product at
              your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              7. Limitation of liability
            </h2>
            <p>
              To the maximum extent allowed by law, we are not liable for any
              indirect, incidental, or consequential damages arising out of or
              related to your use of AI Sheet Builder. Our total liability for
              any claim related to the service will be limited to the amount you
              paid us for access to the product, if any, over the previous
              twelve months.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              8. Changes to these terms
            </h2>
            <p>
              We may update these Terms of Service from time to time to reflect
              product changes or legal requirements. When we make material
              changes, we will update the &quot;Last updated&quot; date above
              and may notify you through the product or by email.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
