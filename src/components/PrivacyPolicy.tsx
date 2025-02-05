import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface PolicySectionProps {
  title: string;
  children: React.ReactNode;
}

const PolicySection: React.FC<PolicySectionProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-gray-900">{title}</h2>
      {children}
    </div>
  );
};

interface BulletListProps {
  items: string[];
}

const BulletList: React.FC<BulletListProps> = ({ items }) => {
  return (
    <ul className="list-disc ml-6 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ul>
  );
};

interface NumberedListProps {
  items: {
    title: string;
    description: string | string[];
  }[];
}

const NumberedList: React.FC<NumberedListProps> = ({ items }) => {
  return (
    <ol className="list-decimal ml-6 space-y-4">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">
          <strong>{item.title}</strong>
          {Array.isArray(item.description) ? (
            <BulletList items={item.description} />
          ) : (
            <p>{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
};

const ContactInfo: React.FC = () => {
  return (
    <div className="space-y-2">
      <p><strong>Email:</strong> visionventurecoaching@gmail.com</p>
      <p><strong>Phone:</strong> +1 (570) 394-9907</p>
      <p><strong>Address:</strong> 520 Nicholas Ave, Danville, PA 17821</p>
    </div>
  );
};

export const PrivacyPolicy: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-gray-600">Effective Date: January 21, 2025</p>
                <p className="text-lg font-semibold mt-4">Vision Venture Coaching & Consulting LLC ("Vision Venture")</p>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-700">
                  Thank you for visiting visionventure.ai. Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, including our learning portal. By accessing or using our services, you agree to the terms outlined in this policy.
                </p>

                <PolicySection title="Information We Collect">
                  <NumberedList items={[
                    {
                      title: "Personal Information:",
                      description: ["When you create an account on our learning portal, we collect information such as your name, email address, phone number, and any other details you provide during registration."]
                    },
                    {
                      title: "Usage Data:",
                      description: ["We collect information about how you use our website, including pages visited, time spent on pages, and other diagnostic data."]
                    },
                    {
                      title: "Cookies and Tracking Technologies:",
                      description: ["We use cookies to enhance your browsing experience, store user preferences, and track site usage."]
                    }
                  ]} />
                </PolicySection>

                <PolicySection title="How We Use Your Information">
                  <p className="mb-4">We may use the information we collect for the following purposes:</p>
                  <NumberedList items={[
                    {
                      title: "To Provide and Maintain Services:",
                      description: "Manage your account and provide access to our learning portal."
                    },
                    {
                      title: "To Improve Our Website:",
                      description: "Analyze usage data to enhance user experience and optimize website performance."
                    },
                    {
                      title: "To Communicate With You:",
                      description: "Send updates, newsletters, or respond to inquiries and support requests."
                    },
                    {
                      title: "To Comply With Legal Obligations:",
                      description: "Ensure compliance with applicable laws and regulations."
                    }
                  ]} />
                </PolicySection>

                <PolicySection title="Sharing Your Information">
                  <p className="mb-4">We value your trust and do not sell your personal information. However, we may share data in the following situations:</p>
                  <NumberedList items={[
                    {
                      title: "With Partners and Third-Party Apps:",
                      description: "To provide integrated services, such as education tools or analytics, that require limited data sharing. These partners are bound by confidentiality agreements."
                    },
                    {
                      title: "For Legal Compliance:",
                      description: "If required by law or to protect our rights, property, or safety."
                    }
                  ]} />
                </PolicySection>

                <PolicySection title="Data Security">
                  <p className="text-gray-700">
                    We implement robust security measures to protect your personal information, including encryption and secure access protocols. However, no system is completely secure, and we cannot guarantee absolute security.
                  </p>
                </PolicySection>

                <PolicySection title="Your Rights">
                  <NumberedList items={[
                    {
                      title: "Access and Update Your Information:",
                      description: "Log in to your account to view and edit your personal details."
                    },
                    {
                      title: "Delete Your Account:",
                      description: "Contact us at visionventurecoaching@gmail.com to request account deletion."
                    },
                    {
                      title: "Opt-Out of Communications:",
                      description: "Unsubscribe from emails or adjust notification settings in your account."
                    }
                  ]} />
                </PolicySection>

                <PolicySection title="Cookies Policy">
                  <p className="text-gray-700">
                    Cookies help us provide a better user experience. You can adjust your browser settings to refuse cookies or notify you when cookies are being used.
                  </p>
                </PolicySection>

                <PolicySection title="Third-Party Links">
                  <p className="text-gray-700">
                    Our website may contain links to external sites. We are not responsible for the privacy practices of these third parties.
                  </p>
                </PolicySection>

                <PolicySection title="Updates to This Privacy Policy">
                  <p className="text-gray-700">
                    We may update this Privacy Policy periodically to reflect changes in our practices or for legal reasons. Updates will be posted on this page with the revised effective date.
                  </p>
                </PolicySection>

                <PolicySection title="Contact Us">
                  <p className="mb-4">If you have any questions or concerns about this Privacy Policy, please contact us:</p>
                  <ContactInfo />
                </PolicySection>

                <p className="text-gray-700 mt-8 text-center">
                  Thank you for trusting Vision Venture Coaching & Consulting LLC. We are committed to safeguarding your privacy.
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