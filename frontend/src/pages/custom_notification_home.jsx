import { HelmetProvider } from "react-helmet-async";
import PropTypes from "prop-types";
import CustomNotification from "../components/custom_notification/custom_notification";

const ContactPage = ({ image }) => {
  const defaultDescription =
    "Track and manage your household inventory effortlessly with TidyHome. Keep an eye on your stock, monitor usage, and reduce waste with our smart home stock management system.";
  const defaultKeywords =
    "home inventory, stock management, household stock, consumption log, home storage, pantry tracking, home supplies tracker, inventory tracking, stock monitoring, home organization, household management, grocery tracking, smart home stock, kitchen inventory, home essentials, home stock control";
  const defaultTitle = "TidyHome | Custom Notification";
  const defaultImage = "https://placehold.co/600x400/png";

  return (
    <div>
      <div className="container">
        <div className="content">
          <HelmetProvider>
            {/* Title */}
            <title>{defaultTitle}</title>

            {/* Favicon */}
            <link
              rel="icon"
              type="image/png"
              href={image || defaultImage}
              sizes="16x16"
            />

            {/* Meta Description and Keywords */}
            <meta name="description" content={defaultDescription} />
            <meta name="keywords" content={defaultKeywords} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={defaultTitle} />
            <meta property="og:description" content={defaultDescription} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={window.location.href} />

            {/* Twitter Meta Tags */}
            <meta name="twitter:title" content={defaultTitle} />
            <meta name="twitter:description" content={defaultDescription} />
            <meta name="twitter:image" content={image || defaultImage} />
            <meta name="twitter:card" content="summary_large_image" />
          </HelmetProvider>

          <CustomNotification />
        </div>
      </div>
    </div>
  );
};

// PropTypes validation
ContactPage.propTypes = {
  image: PropTypes.string,
};

export default ContactPage;
