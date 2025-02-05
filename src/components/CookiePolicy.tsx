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
  items: {
    title: string;
    description: string;
  }[];
}

const BulletList: React.FC<BulletListProps> = ({ items }) => {
  return (
    <ul className="list-disc ml-6 space-y-4">
      {items.map((item, index) => (
        <li key={index} className="text-gray-700">
          <span className="font-semibold">{item.title}</span> {item.description}
        </li>
      ))}
    </ul>
  );
};

export const CookiePolicy: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <>
      <Navbar onOpenAuth={() => setShowAuthModal(true)} />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
                <p className="text-gray-600">Effective Date: {currentDate}</p>
              </div>
              
              <div className="space-y-6">
                <PolicySection title="Introduction">
                  <p className="text-gray-700">
                    Vision Venture Coaching & Consulting LLC ("Vision Venture") uses cookies to improve your experience on our website and learning portal. This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookie preferences.
                  </p>
                </PolicySection>

                <PolicySection title="Types of Cookies We Use">
                  <BulletList items={[
                    {
                      title: "Essential Cookies:",
                      description: "Necessary for core website functionality, such as logging into your account."
                    },
                    {
                      title: "Performance Cookies:",
                      description: "Help us analyze how users interact with our website to improve content and design."
                    },
                    {
                      title: "Functionality Cookies:",
                      description: "Remember your preferences, such as language or region."
                    },
                    {
                      title: "Third-Party Cookies:",
                      description: "Tools like Google Analytics collect data for usage analysis."
                    }
                  ]} />
                </PolicySection>

                <PolicySection title="Your Choices">
                  <p className="text-gray-700 mb-4">
                    You can manage your cookie preferences through our cookie consent banner or your browser settings.
                  </p>
                  
                  <div className="text-gray-700">
                    <p className="mb-2">For more details, please contact us at:</p>
                    <p><strong>Email:</strong> visionventurecoaching@gmail.com</p>
                  </div>
                </PolicySection>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CookiePolicy;