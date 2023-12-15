import React from 'react';
import './howItWorks.css'; // Make sure to create and link this CSS file

function HowItWorks() {
  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <div className="steps-container">
        <div className="step">
          <div className="icon">🏠</div> {/* Replace with actual icons */}
          <h3>Step 1: List a Space</h3>
          <p>Register and list your space with details and images.</p>
        </div>
        <div className="step">
          <div className="icon">🔍</div> {/* Replace with actual icons */}
          <h3>Step 2: Find a Space</h3>
          <p>Search and explore listings that meet your needs.</p>
        </div>
        <div className="step">
          <div className="icon">🔄</div> {/* Replace with actual icons */}
          <h3>Step 3: Transfer Lease</h3>
          <p>Finalize the lease transfer seamlessly through our platform.</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
