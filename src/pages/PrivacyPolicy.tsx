import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-8 pt-32">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Privacy Policy", href: "/privacy-policy" },
                    ]}
                />

                <div className="mt-8 max-w-4xl mx-auto prose dark:prose-invert">
                    <h1 className="font-display text-4xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="mb-4">
                            Welcome to KelsMall ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. The Data We Collect About You</h2>
                        <p className="mb-4">
                            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                            <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
                            <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Personal Data</h2>
                        <p className="mb-4">
                            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            <li>Where we need to comply with a legal or regulatory obligation.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Google User Data</h2>
                        <p className="mb-4">
                            If you choose to sign in or sign up using your Google account ("Google Sign-In"), we access specific personal information from your Google profile as permitted by your Google account settings. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Your email address (to create your account and communicate with you).</li>
                            <li>Your name (to personalize your user experience).</li>
                            <li>Your profile picture (to display as your avatar).</li>
                        </ul>
                        <p className="mb-4">
                            We use this information solely for authentication purposes and to maintain your user account. We do not share your Google user data with any third parties for marketing purposes without your explicit consent.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Data Retention and Deletion</h2>
                        <p className="mb-4">
                            We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                        </p>
                        <p className="mb-4">
                            <strong>Requesting Data Deletion:</strong> You have the right to request the deletion of your personal data. You can do this by:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Navigating to your Account Settings page and clicking "Delete Account".</li>
                            <li>Contacting our support team at <a href="mailto:kelsmall@gmail.com" className="text-primary hover:underline">kelsmall@gmail.com</a>.</li>
                        </ul>
                        <p className="mb-4">
                            Upon receiving a deletion request, we will permanently delete your account and personal information from our active databases within 30 days, unless we are required to retain it for legal reasons (e.g., transaction history for tax purposes).
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
                        <p className="mb-4">
                            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                        <p className="mb-4">
                            If you have any questions about this privacy policy or our privacy practices, please contact us at:
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

export default PrivacyPolicy;
