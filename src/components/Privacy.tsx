import React from "react";
import { RxCross2 } from "react-icons/rx";
interface props {
  setisprivacy: (value: boolean) => void;
}
const Privacy: React.FC<props> = ({setisprivacy}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center h-full bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="p-6 max-w-4xl mx-auto bg-[#121212] rounded-lg shadow-md h-[90vh] overflow-y-scroll">
        <div className="flex justify-end">
          <RxCross2
            size={28}
            color="#9ca3af"
            className="cursor-pointer"
            onClick={() => {
              setisprivacy(false);
            }}
          />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-white">
          Privacy Policy for FeedSenseAI
        </h1>
        <p className="text-white mb-4">
          Welcome to FeedSenseAI. Protecting your privacy is important to us.
          This Privacy Policy explains how we collect, use, and safeguard your
          information when you use our platform, FeedSenseAI, which provides
          tools for feedback collection, analysis, and prioritization.
        </p>
        <p className="text-white mb-6">
          By using FeedSenseAI, you agree to the terms outlined in this Privacy
          Policy. If you do not agree with the terms, please refrain from using
          our services.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          1. Information We Collect
        </h2>
        <h3 className="text-xl font-semibold mb-2 text-white">
          1.1 Information You Provide to Us
        </h3>
        <ul className="list-disc list-inside mb-4 text-white">
          <li>
            <strong>Account Information:</strong> Name, email address, password,
            and other details provided during account registration.
          </li>
          <li>
            <strong>Feedback Data:</strong> Feedback and related metadata
            collected through forms or other integrations.
          </li>
          <li>
            <strong>Payment Information:</strong> Billing details, including
            credit card or other payment method information, handled securely by
            third-party payment processors.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-2 text-white">
          1.2 Automatically Collected Information
        </h3>
        <ul className="list-disc list-inside mb-4 text-white">
          <li>
            <strong>Usage Data:</strong> Information about how you interact with
            our platform, including IP address, browser type, operating system,
            and activity logs.
          </li>
          <li>
            <strong>Cookies:</strong> Data collected via cookies and similar
            technologies to enhance user experience. (Refer to our Cookie Policy
            for more details.)
          </li>
        </ul>

        <h3 className="text-xl font-semibold mb-2 text-white">
          1.3 Third-Party Integrations
        </h3>
        <p className="text-white mb-6">
          Information obtained through third-party services connected to
          FeedSenseAI (e.g., CRM tools, project management systems) as
          authorized by you.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          2. How We Use Your Information
        </h2>
        <ul className="list-disc list-inside mb-6 text-white">
          <li>To provide and maintain the FeedSenseAI platform.</li>
          <li>To analyze and prioritize user feedback.</li>
          <li>
            To communicate with you regarding updates, support, and promotional
            materials (you can opt out of marketing communications).
          </li>
          <li>To enhance user experience through research and development.</li>
          <li>To ensure security and prevent fraud.</li>
          <li>To comply with legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          3. How We Share Your Information
        </h2>
        <p className="text-white mb-6">
          We do not sell or rent your personal information. We may share your
          information in the following scenarios:
        </p>
        <ul className="list-disc list-inside mb-6 text-white">
          <li>
            <strong>With Service Providers:</strong> Trusted third parties who
            assist us in operating our platform, such as hosting, payment
            processing, and analytics.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When required by law or to
            protect our legal rights.
          </li>
          <li>
            <strong>Business Transfers:</strong> In case of a merger,
            acquisition, or sale of assets, your information may be transferred
            to the new entity.
          </li>
          <li>
            <strong>With Your Consent:</strong> When explicitly authorized by
            you.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          4. Data Retention
        </h2>
        <p className="text-white mb-6">
          We retain your information for as long as necessary to fulfill the
          purposes outlined in this Privacy Policy or as required by law.
          Feedback data may be anonymized and stored for analytical purposes.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          5. Your Rights
        </h2>
        <p className="text-white mb-6">
          Depending on your location, you may have the following rights:
        </p>
        <ul className="list-disc list-inside mb-6 text-white">
          <li>Access your personal information.</li>
          <li>Correct inaccurate or incomplete information.</li>
          <li>Delete or request the deletion of your personal data.</li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Data portability.</li>
        </ul>
        <p className="text-white mb-6">
          To exercise these rights, contact us at [Insert Contact Email].
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          6. Security Measures
        </h2>
        <p className="text-white mb-6">
          We implement industry-standard security measures to protect your
          information. However, no system is completely secure. You are
          responsible for maintaining the confidentiality of your account
          credentials.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          7. Children Privacy
        </h2>
        <p className="text-white mb-6">
          FeedSenseAI is not intended for use by children under 13. We do not
          knowingly collect personal information from children. If we become
          aware that a child\u2019s data has been collected, we will take
          appropriate steps to delete it.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          8. Changes to This Privacy Policy
        </h2>
        <p className="text-white mb-6">
          We may update this Privacy Policy from time to time. Changes will be
          posted on this page with an updated effective date. Continued use of
          FeedSenseAI after changes implies acceptance of the revised policy.
        </p>

        <h2 className="text-2xl font-semibold mb-3 text-white">
          9. Contact Us
        </h2>
        <p className="text-white">
          If you have questions or concerns about this Privacy Policy, please
          contact us:
        </p>
        <p className="text-white">Email: chrahulofficial@gmail.com</p>
      </div>
    </div>
  );
};

export default Privacy;
