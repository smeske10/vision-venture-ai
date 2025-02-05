import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Settings } from 'lucide-react';
import { cookieHandler } from '../lib/cookie-handler';

interface CookiePreferences {
  essential: boolean;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true and disabled
    performance: true,
    functional: true,
    targeting: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already made cookie choices
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setPreferences({
      essential: true,
      performance: true,
      functional: true,
      targeting: true,
    });
    savePreferences({
      essential: true,
      performance: true,
      functional: true,
      targeting: true,
    });
  };

  const handleAcceptSelected = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      essential: true,
      performance: false,
      functional: false,
      targeting: false,
    };
    setPreferences(minimalPreferences);
    savePreferences(minimalPreferences);
  };

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-700">
                  We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
                  <button
                    onClick={() => navigate('/cookies')}
                    className="text-blue-600 hover:underline"
                  >
                    Learn more
                  </button>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Cookie Preferences</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Essential Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Required for basic site functionality. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="mt-1"
                  />
                </div>

                {/* Performance Cookies */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Performance Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Help us improve our website by collecting anonymous usage information.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.performance}
                    onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                    className="mt-1"
                  />
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Functional Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Enable advanced features and personalization.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="mt-1"
                  />
                </div>

                {/* Targeting Cookies */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Targeting Cookies</h3>
                    <p className="text-sm text-gray-600">
                      Allow us to deliver personalized content and advertisements.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.targeting}
                    onChange={(e) => setPreferences({ ...preferences, targeting: e.target.checked })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end space-x-4">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptSelected}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}