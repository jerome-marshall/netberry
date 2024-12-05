import React from "react";

interface PrivacyPolicyProps {}

const PrivacyPolicy = ({}: PrivacyPolicyProps) => {
  return (
    <div>
      <h1>NetBerry Privacy Policy</h1>
      <h2>Welcome to NetBerry</h2>
      <p>
        NetBerry is a web application that leverages the Netlify API to provide
        users with a user interface to access various APIs. This Privacy Policy
        explains how we collect, use, and protect your personal information when
        you use NetBerry. By using NetBerry, you agree to the practices
        described in this policy.
      </p>
      <h2>Information We Collect</h2>
      <h3>1. User Authentication</h3>
      <p>
        To access NetBerry, users are required to authenticate using Google
        OAuth. During this process, we collect and store the following
        information:
      </p>
      <ul>
        <li>Google account information (e.g., name, email)</li>
        <li>Authentication tokens provided by Google</li>
      </ul>
      <h3>2. User Preferences</h3>
      <p>
        NetBerry allows users to customize their experience by storing
        preferences. This may include:
      </p>
      <ul>
        <li>User interface settings</li>
        <li>API preferences</li>
        <li>Any other customization chosen by the user</li>
      </ul>
      <h3>3. Usage Data</h3>
      <p>
        We may collect non-personal information about how users interact with
        NetBerry. This includes:
      </p>
      <ul>
        <li>Log data (e.g., IP address, browser type, access times)</li>
        <li>Usage patterns and navigation within the application</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <h3>1. User Authentication</h3>
      <p>
        The information collected during Google OAuth authentication is used
        solely for the purpose of verifying user identity and providing access
        to NetBerry.
      </p>
      <h3>2. User Preferences</h3>
      <p>
        The preferences stored by users are used to enhance and personalize
        their experience with NetBerry. We do not share this information with
        third parties.
      </p>
      <h3>3. Usage Data</h3>
      <p>
        We use non-personal information to analyze and improve the performance,
        usability, and effectiveness of NetBerry. This data is aggregated and
        anonymized.
      </p>
      <h2>Data Security</h2>
      <p>
        We take the security of your information seriously. NetBerry employs
        industry-standard measures to protect your personal information from
        unauthorized access, disclosure, alteration, and destruction.
      </p>
      <h2>Third-Party Integrations</h2>
      <p>
        NetBerry integrates with the Netlify API for its core functionality.
        Please refer to Netlify&apos;s Privacy Policy for details on how they
        handle user data.
      </p>
      <h2>Your Choices</h2>
      <p>
        Users have the right to access, correct, or delete their personal
        information stored within NetBerry. To exercise these rights or if you
        have any privacy-related concerns, please contact us at{" "}
        <a href="mailto:starberrylife@starberry.tv">
          starberrylife@starberry.tv
        </a>
        .
      </p>
      <h2>Changes to this Privacy Policy</h2>
      <p>
        We may update this Privacy Policy to reflect changes in our practices or
        for other operational, legal, or regulatory reasons. Any updates will be
        effective immediately upon posting the revised policy on NetBerry.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us at{" "}
        <a href="mailto:starberrylife@starberry.tv">
          starberrylife@starberry.tv
        </a>
        .
      </p>
      <p>Thank you for using NetBerry!</p>
    </div>
  );
};

export default PrivacyPolicy;
