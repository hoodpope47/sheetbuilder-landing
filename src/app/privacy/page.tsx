export const metadata = {
  title: "Privacy Policy | AI Sheet Builder",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 space-y-6 text-gray-700">
      <h1 className="text-3xl font-semibold text-gray-900">Privacy Policy</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Information We Collect</h2>
        <p className="text-sm leading-relaxed">
          We collect basic account information, usage data, and voluntary feedback to improve your
          experience. Any data you provide is handled with care and only used to deliver the
          service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">How We Use Your Information</h2>
        <p className="text-sm leading-relaxed">
          We use your information to operate the product, personalize templates, and communicate
          important updates. We do not sell your data to third parties.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Data Storage &amp; Security</h2>
        <p className="text-sm leading-relaxed">
          Your data is stored with modern encryption and access controls. We regularly review our
          security practices to safeguard your information against unauthorized access.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        <p className="text-sm leading-relaxed">
          If you have questions about this policy, reach out at privacy@example.com and we will
          respond promptly.
        </p>
      </section>
    </main>
  );
}
