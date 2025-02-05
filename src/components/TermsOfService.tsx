import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface TermsSectionProps {
  title: string;
  children: React.ReactNode;
}

const TermsSection: React.FC<TermsSectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
      {children}
    </div>
  );
};

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-2 text-gray-700">
      <p>
        <strong>Email:</strong> visionventurecoaching@gmail.com
      </p>
      <p>
        <strong>Phone:</strong> +1 (570) 394-9907
      </p>
      <p>
        <strong>Address:</strong> 520 Nicholas Ave, Danville, PA 17821
      </p>
    </div>
  );
};

export const TermsOfService: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
                <p className="text-gray-600">
                  Effective Date: January 21, 2025
                </p>
              </div>

              <div className="space-y-6">
                <p className="text-gray-700">
                  Welcome to visionventure.ai (the "Website"), operated by
                  Vision Venture Coaching & Consulting LLC ("Vision Venture").
                  By accessing or using our Website, services, or learning
                  portal, you agree to comply with and be bound by these Terms
                  of Service ("Terms"). If you do not agree with these Terms,
                  you may not use our services.
                </p>

                <TermsSection title="1. Acceptance of Terms">
                  <p className="text-gray-700">
                    By creating an account, accessing the learning portal, or
                    using any part of our Website, you acknowledge that you have
                    read, understood, and agree to these Terms. These Terms
                    constitute a binding agreement between you and Vision
                    Venture.
                  </p>
                </TermsSection>

                <TermsSection title="2. Eligibility">
                  <p className="text-gray-700">
                    You must be at least 18 years old to use our services. By
                    using our Website, you represent that you meet this age
                    requirement and that the information you provide is accurate
                    and complete.
                  </p>
                </TermsSection>

                <TermsSection title="3. Accounts and Security">
                  <ul className="list-disc list-inside text-gray-700">
                    <li>
                      <strong>Account Registration:</strong> To access certain
                      features, including the learning portal, you must register
                      for an account. You are responsible for providing accurate
                      and complete information during registration.
                    </li>
                    <li>
                      <strong>Account Security:</strong> You are responsible for
                      safeguarding your account credentials and for all
                      activities that occur under your account. Notify us
                      immediately if you suspect unauthorized access.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection title="4. Use of Services">
                  <p className="text-gray-700">
                    You may use the Website and services for personal and
                    non-commercial purposes only. You agree not to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Use the Website for unlawful purposes.</li>
                    <li>
                      Disrupt or interfere with the Website’s functionality.
                    </li>
                    <li>
                      Reverse-engineer or exploit any part of the Website.
                    </li>
                    <li>Share your account credentials with others.</li>
                  </ul>
                </TermsSection>

                <TermsSection title="5. Payment and Subscriptions">
                  <ul className="list-disc list-inside text-gray-700">
                    <li>
                      <strong>Fees:</strong> Certain services, including
                      educational content on the learning portal, may require
                      payment. All fees are non-refundable unless otherwise
                      stated.
                    </li>
                    <li>
                      <strong>Billing:</strong> By providing payment
                      information, you authorize us to charge applicable fees.
                      You are responsible for keeping your billing information
                      current.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection title="6. Intellectual Property">
                  <ul className="list-disc list-inside text-gray-700">
                    <li>
                      <strong>Ownership:</strong> All content, materials, and
                      features on the Website are owned by Vision Venture or its
                      licensors and are protected by copyright, trademark, and
                      other intellectual property laws.
                    </li>
                    <li>
                      <strong>License:</strong> Vision Venture grants you a
                      limited, non-exclusive, non-transferable license to access
                      and use the Website and services for personal use.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection title="7. Data and Privacy">
                  <p className="text-gray-700">
                    Your use of the Website is subject to our Privacy Policy,
                    which outlines how we collect, use, and safeguard your data.
                    By using the Website, you agree to the terms of the Privacy
                    Policy.
                  </p>
                </TermsSection>

                <TermsSection title="8. Third-Party Services">
                  <p className="text-gray-700">
                    Our Website may integrate with third-party services or
                    include links to external websites. Vision Venture is not
                    responsible for the content, functionality, or practices of
                    these third parties.
                  </p>
                </TermsSection>

                <TermsSection title="9. Termination">
                  <ul className="list-disc list-inside text-gray-700">
                    <li>
                      <strong>Suspension or Termination:</strong> Vision Venture
                      reserves the right to suspend or terminate your access to
                      the Website or services at any time, with or without cause
                      or notice.
                    </li>
                    <li>
                      <strong>Effect of Termination:</strong> Upon termination,
                      your right to use the Website ceases, and any provisions
                      of these Terms that by their nature should survive
                      termination will remain in effect.
                    </li>
                  </ul>
                </TermsSection>

                <TermsSection title="10. Limitation of Liability">
                  <p className="text-gray-700">
                    To the fullest extent permitted by law, Vision Venture is
                    not liable for any indirect, incidental, special, or
                    consequential damages arising from your use of the Website
                    or services.
                  </p>
                </TermsSection>

                <TermsSection title="11. Indemnification">
                  <p className="text-gray-700">
                    You agree to indemnify and hold Vision Venture harmless from
                    any claims, damages, liabilities, and expenses arising from
                    your use of the Website, your violation of these Terms, or
                    infringement of any third-party rights.
                  </p>
                </TermsSection>

                <TermsSection title="12. Modifications to Terms">
                  <p className="text-gray-700">
                    We reserve the right to update these Terms at any time.
                    Changes will be posted on this page with the updated
                    effective date. Continued use of the Website after changes
                    constitutes your acceptance of the updated Terms.
                  </p>
                </TermsSection>

                <TermsSection title="13. Governing Law">
                  <p className="text-gray-700">
                    These Terms are governed by the laws of the Commonwealth of
                    Pennsylvania, without regard to its conflict of law
                    principles. Any disputes will be resolved in the courts
                    located in Pennsylvania.
                  </p>
                </TermsSection>

                <TermsSection title="14. Contact Us">
                  <p className="mb-4">
                    If you have any questions about these Terms, please contact
                    us:
                  </p>
                  <ContactInfo />
                </TermsSection>

                <p className="text-gray-700 mt-8 text-center">
                  Thank you for using Vision Venture Coaching & Consulting LLC.
                  We are committed to providing valuable and secure services to
                  support your growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
