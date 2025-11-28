export const metadata = {
  title: "Terms of Service | AI Sheet Builder",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 space-y-6 text-gray-700">
      <h1 className="text-3xl font-semibold text-gray-900">Terms of Service</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Acceptance of Terms</h2>
        <p className="text-sm leading-relaxed">
          By accessing or using the service, you agree to these terms. If you do not agree, please
          discontinue use immediately.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Use of the Service</h2>
        <p className="text-sm leading-relaxed">
          You may use the platform to generate and manage spreadsheet templates for personal or
          business use. You are responsible for maintaining the confidentiality of your account.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Limitation of Liability</h2>
        <p className="text-sm leading-relaxed">
          The service is provided “as is” without warranties. We are not liable for any indirect,
          incidental, or consequential damages arising from use of the product.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Changes to These Terms</h2>
        <p className="text-sm leading-relaxed">
          We may update these terms periodically. Continued use of the service after updates
          constitutes acceptance of the revised terms.
        </p>
      </section>
    </main>
  );
}
