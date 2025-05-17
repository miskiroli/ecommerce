import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';
import Footer from '../components/Footer';
import { useLoading } from '../components/LoadingContext';

const Contact = () => {
  const { setLoading } = useLoading();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const simulateLoading = async () => {
      try {
        console.log('Setting loading to true for Contact page load');
        setLoading(true);
        // Mesterséges késleltetés 2 másodperc, hogy az animáció látható legyen
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        console.log('Setting loading to false for Contact page load');
        setLoading(false);
      }
    };

    simulateLoading();
  }, [setLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Setting loading to true for form submission');
      setLoading(true);
      // Itt lehetne egy valódi API-hívás
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 másodperc szimuláció
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while sending your message.');
    } finally {
      console.log('Setting loading to false for form submission');
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>Have a question? Reach out to us, and we'll help!</p>
      </div>

      <div className="contact-main">
        <div className="contact-form-section">
          <h2>Send a Message</h2>
          <div className="contact-form">
            {submitted ? (
              <div className="success-message">
                <p>Your message has been sent! We will respond soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            )}
          </div>
        </div>

        <div className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> support@shopzone.com</p>
            <p><strong>Phone:</strong> +36 123 456 789</p>
            <p><strong>Customer Support:</strong> Mon-Fri, 9:00 AM - 5:00 PM</p>
            <p><strong>Address:</strong> 1052 Budapest, Example Street 1</p>
          </div>
          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2695.663!2d19.053453!3d47.497912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4741dc3b9e7e3f9d%3A0x4e9b8a9c9d9c9f9f!2sBudapest%2C%20P%C3%A9lda%20utca%201%2C%201052!5e0!3m2!1shu!2shu!4v1698771234567!5m2!1shu!2shu"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="faq-link">
            <p>Have common questions? Check out the answers!</p>
            <Link to="/faq">
              <button className="faq-btn">Frequently Asked Questions</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;