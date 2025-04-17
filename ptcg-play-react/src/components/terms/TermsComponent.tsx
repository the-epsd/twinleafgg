import React from 'react';

const TermsComponent: React.FC = () => {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>

      <section className="terms-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
      </section>

      <section className="terms-section">
        <h2>2. User Conduct</h2>
        <p>
          Users are expected to conduct themselves in a respectful and sportsmanlike manner. Any form of harassment, cheating, or unsportsmanlike conduct will not be tolerated.
        </p>
      </section>

      <section className="terms-section">
        <h2>3. Game Rules</h2>
        <p>
          All games must be played according to the official Pokémon TCG rules. Any attempts to exploit bugs or use unauthorized software will result in account suspension.
        </p>
      </section>

      <section className="terms-section">
        <h2>4. Account Security</h2>
        <p>
          Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
        </p>
      </section>

      <section className="terms-section">
        <h2>5. Privacy Policy</h2>
        <p>
          We collect and use personal information in accordance with our Privacy Policy. By using our services, you consent to the collection and use of this information.
        </p>
      </section>

      <section className="terms-section">
        <h2>6. Intellectual Property</h2>
        <p>
          All content, including but not limited to game mechanics, card designs, and website content, is the property of the respective owners and is protected by copyright laws.
        </p>
      </section>

      <section className="terms-section">
        <h2>7. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Users will be notified of any changes, and continued use of the service constitutes acceptance of the modified terms.
        </p>
      </section>

      <section className="terms-section">
        <h2>8. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever.
        </p>
      </section>

      <section className="terms-section">
        <h2>9. Limitation of Liability</h2>
        <p>
          In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>
      </section>

      <section className="terms-section">
        <h2>10. Contact Information</h2>
        <p>
          For any questions about these Terms and Conditions, please contact us at support@ptcg-elite.com
        </p>
      </section>
    </div>
  );
};

export default TermsComponent; 