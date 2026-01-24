import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const TermsOfUse = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 pt-32">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Terms of Use", href: "/terms" },
                    ]}
                />

                <div className="mt-8 max-w-4xl mx-auto prose dark:prose-invert">
                    <h1 className="font-display text-4xl font-bold mb-6">Terms of Use</h1>
                    <p className="text-muted-foreground mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using KelsMall ("the Application" or "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
                        <p className="mb-4">
                            To use certain features of the Service, you may be required to register for an account. You agree to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Provide accurate, current, and complete information during the registration process.</li>
                            <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
                            <li>Notify us immediately if you discover or suspect any security breaches related to the Service.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Use of the Service</h2>
                        <p className="mb-4">
                            You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, impairs, or renders the Service less efficient. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Attempt to reverse engineer, decompile, hack, disable, interfere with, disassemble, modify, copy, translate, or disrupt the features, functionality, integrity, or performance of the Service.</li>
                            <li>Harass, abuse, or harm another person or group.</li>
                            <li>Use the Service to transmit or publish any content that is offensive, defamatory, or violates the rights of others.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
                        <p className="mb-4">
                            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of KelsMall and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of KelsMall.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
                        <p className="mb-4">
                            We may terminate your access to the Service, without cause or notice, which may result in the forfeiture and destruction of all information associated with you. All provisions of this Agreement that by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
                        <p className="mb-4">
                            In no event shall KelsMall, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <address className="not-italic">
                            <strong>KelsMall</strong><br />
                            Email: <a href="mailto:kelsmall@gmail.com" className="text-primary hover:underline">kelsmall@gmail.com</a><br />
                            Phone: +233 543119117<br />
                            Address: Red Okai Street, Achimota, Accra, Ghana.
                        </address>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsOfUse;
