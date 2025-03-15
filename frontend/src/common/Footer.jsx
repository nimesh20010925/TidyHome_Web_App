import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'; // Import icons

const Footer = () => {
  return (
    <footer className="footer bg-light text-dark py-5">
      <div className="container">
        <div className="row">
          {/* Company Info Section */}
          <div className="col-md-6 mb-4">
            <h4 className="fw-bold mb-2">Cultivating Efficiency, Tracking Excellence</h4>
            <p className="mb-0">Your Trusted Inventory Management Partner</p>
          </div>

          {/* Navigation Links Section */}
          <div className="col-md-6 d-flex justify-content-md-end justify-content-center align-items-center mb-4" style={{paddingLeft: '0px'}}>
            <nav className="nav" style={{justifyContent: 'flex-end', padding: '0px'}} >
              <a href="#dashboard" className="nav-link text-dark" style={{paddingRight: '0px', margin:'0px'}} >Dashboard</a>
              <a href="#inventory" className="nav-link text-dark" style={{paddingRight: '0px', margin:'0px'}} >Inventory</a>
              <a href="#shopping-list" className="nav-link text-dark" style={{paddingRight: '0px', margin:'0px'}} >Shopping List</a>
              <a href="#suppliers" className="nav-link text-dark" style={{paddingRight: '0px', margin:'0px'}} >Suppliers</a>
              <a href="#consumption" className="nav-link text-dark" style={{paddingRight: '0px', margin:'0px'}} >Consumptions</a>
              <a href="#contact" className="nav-link text-dark" style={{paddingRight: '0px', margin:'0px'}} >Custom Notifications</a>
            </nav>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="row mt-4">
          <div className="col-md-4 text-center text-md-start mb-3">
            <a href="#privacy" className="text-dark text-decoration-none">Privacy Policy</a>
          </div>
          <div className="col-md-4 text-center mb-3">
            <p className="mb-0">© 2023 Tidy Home Technologies, Inc.</p>
          </div>
          <div className="col-md-4 text-center text-md-end mb-3">
            <a href="#terms" className="text-dark text-decoration-none">Terms & Conditions</a>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="d-flex justify-content-center gap-4">
          <a href="#facebook" className="social-icon">
            <FaFacebook size={30} />
          </a>
          <a href="#instagram" className="social-icon">
            <FaInstagram size={30} />
          </a>
          <a href="#twitter" className="social-icon">
            <FaTwitter size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;