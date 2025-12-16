// Email Template Utility for Penta Cab
// Fixed version with better email client compatibility

// Helper function to format date safely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const dateStr = String(dateString).trim();
    
    // Try parsing different date formats
    let date = null;
    
    // Handle YYYY-MM-DD format (most common from HTML date inputs)
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = dateStr.split('-');
      date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    // Handle DD-MM-YYYY format
    else if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const parts = dateStr.split('-');
      date = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    // Handle MM/DD/YYYY format
    else if (dateStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const parts = dateStr.split('/');
      date = new Date(parseInt(parts[2], 10), parseInt(parts[0], 10) - 1, parseInt(parts[1], 10));
    }
    // Try standard Date parsing as fallback
    else {
      date = new Date(dateStr);
    }
    
    // Check if date is valid
    if (date && !isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // If all parsing fails, return the original string
    return dateString;
  } catch (error) {
    // If any error occurs, return the original string
    return dateString;
  }
};

// Helper function to format time to 12-hour format with AM/PM
const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  
  try {
    const timeStr = String(timeString).trim();
    
    // If already in 12-hour format with AM/PM, return as is
    if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) {
      return timeStr;
    }
    
    // Handle 24-hour format (HH:MM or HH:MM:SS)
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      
      // Format with leading zero for hours if needed
      return `${hours}:${minutes} ${ampm}`;
    }
    
    // If format is not recognized, return as is
    return timeStr;
  } catch (error) {
    // If any error occurs, return the original string
    return timeString;
  }
};
const getCabName = (cabTypeOrId) => {
  console.log("cabTypeOrId", cabTypeOrId);
  // Handle both cab type strings and ID strings

  const cabIdMapping = {
    1: "SEDAN",
    2: "SUV",
    3: "Innova",
    4: "INNOVA CRYSTAL",
  };

  return cabIdMapping[cabTypeOrId];
};

const generateEmailTemplate = (bookingData) => {
  const { type, route, car, traveller, date, time, serviceType } = bookingData;
  
  // Determine the appropriate icon and title based on booking type
  let icon, title, carLabel;
  switch (type) {
    case 'LOCAL':
      icon = '🚖';
      title = 'Local Ride Booking';
      carLabel = 'Car Selected';
      break;
    case 'AIRPORT':
      icon = '🛫';
      title = serviceType === 'drop' ? 'Airport Drop Booking' : 'Airport Pickup Booking';
      carLabel = 'Car Selected';
      break;
    case 'OUTSTATION':
      icon = '🚗';
      title = 'Intercity Booking';
      carLabel = 'Car Selected';
      break;
    default:
      icon = '🚖';
      title = 'Booking Confirmation';
      carLabel = 'Car Selected';
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .booking-id-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
        }
        
        .booking-id-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .booking-id-value {
          font-size: 24px;
          font-weight: bold;
          font-family: monospace;
          letter-spacing: 1px;
        }
        
        .info-section {
          margin-bottom: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #667eea;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-icon {
          font-size: 18px;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #667eea;
          color: white;
          display: inline-block;
          text-align: center;
          line-height: 30px;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .payment-status {
          background: #28a745;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          text-align: center;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .email-header {
            padding: 25px 15px;
          }
          
          .email-body {
            padding: 25px 15px;
          }
          
          .booking-id-value {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">🚗 PENTA CAB</div>
          <div class="header-title">Booking Confirmed!</div>
          <div class="header-subtitle">Your ride is ready to go</div>
        </div>
        
        <div class="email-body">
          <div class="booking-id-section">
            <div class="booking-id-label">Booking ID</div>
            <div class="booking-id-value">${bookingData.bookingId || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🚗</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${bookingData.car?.type ? bookingData.car.type.toUpperCase() + ' AC taxi vehicle' : 'AC taxi vehicle'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Guest Information
            </div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">Mr/Mrs - ${traveller?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value">+91 ${traveller?.mobile || 'N/A'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📅</span>
              Trip Schedule
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDate(date)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${formatTime(time)}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">💳</span>
              Payment Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Mode:</span>
              <span class="detail-value">${bookingData.paymentMethod === '0' ? 'Cash/UPI' : bookingData.paymentMethod === '20' ? 'UPI/Card (20% Advance)' : bookingData.paymentMethod === '100' ? 'UPI/Card (100% Advance)' : 'Cash/UPI'}</span>
            </div>
            <div class="payment-status">
              Total Charges: ${bookingData.totalFare || car?.price || 0}/- INR ${bookingData.paymentMethod === '20' ? '(20% done)' : bookingData.paymentMethod === '100' ? '(100% done)' : ''}
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📍</span>
              Pickup Location
            </div>
            <div class="detail-value">${traveller?.pickup || traveller?.pickupAddress || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🎯</span>
              Drop Location
            </div>
            <div class="detail-value">${traveller?.drop || traveller?.dropAddress || 'N/A'}</div>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="footer-tagline">Your trusted travel partner</div>
          
          <div class="contact-info">
            <div class="contact-item">📧 <a href="mailto:info.pentacab@gmail.com" style="color: white; text-decoration: none;">info.pentacab@gmail.com</a></div>
            <div class="contact-item">📱 <a href="tel:+917600839900" style="color: white; text-decoration: none;">+91-7600839900</a></div>
            <div class="contact-item">🌐 <a href="https://www.pentacab.com/" style="color: white; text-decoration: none;">https://www.pentacab.com/</a></div>
          </div>
          
          <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
            <p>Thank you for choosing Penta Cab! Our team will contact you shortly with driver details.</p>
            <p style="margin-top: 8px;">© 2015 Penta Cab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for booking confirmation emails
const generateBookingConfirmationTemplate = (bookingData) => {
  return generateEmailTemplate({
    ...bookingData,
    type: bookingData.serviceType || 'LOCAL'
  });
};

// Template for admin booking notification emails (slightly different from user email)
const generateAdminBookingNotificationTemplate = (bookingData) => {
  const { type, route, car, traveller, date, time, serviceType, bookingId, paymentMethod, totalFare } = bookingData;
  
  // Determine the appropriate icon and title based on booking type
  let icon, title;
  switch (type || serviceType) {
    case 'LOCAL':
      icon = '🚖';
      title = 'Local Ride Booking';
      break;
    case 'AIRPORT':
      icon = '🛫';
      title = serviceType === 'drop' ? 'Airport Drop Booking' : 'Airport Pickup Booking';
      break;
    case 'OUTSTATION':
      icon = '🚗';
      title = 'Intercity Booking';
      break;
    default:
      icon = '🚖';
      title = 'New Booking';
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Admin Notification</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .admin-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 12px;
          margin-top: 10px;
          display: inline-block;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .booking-id-section {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
        }
        
        .booking-id-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .booking-id-value {
          font-size: 24px;
          font-weight: bold;
          font-family: monospace;
          letter-spacing: 1px;
        }
        
        .info-section {
          margin-bottom: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #ff6b6b;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-icon {
          font-size: 18px;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #ff6b6b;
          color: white;
          display: inline-block;
          text-align: center;
          line-height: 30px;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .payment-status {
          background: #ff6b6b;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          text-align: center;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .email-header {
            padding: 25px 15px;
          }
          
          .email-body {
            padding: 25px 15px;
          }
          
          .booking-id-value {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">${icon} PENTA CAB</div>
          <div class="header-title">New Booking Notification</div>
          <div class="header-subtitle">Action Required - Please Review</div>
          <div class="admin-badge">ADMIN PANEL</div>
        </div>
        
        <div class="email-body">
          <div class="booking-id-section">
            <div class="booking-id-label">Booking ID</div>
            <div class="booking-id-value">${bookingId || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🚗</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value">${car?.type ? car.type.toUpperCase() + ' AC taxi vehicle' : 'AC taxi vehicle'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Customer Information
            </div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${traveller?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value">+91 ${traveller?.mobile || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${traveller?.email || 'N/A'}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📅</span>
              Trip Schedule
            </div>
            <div class="detail-row">
              <span class="detail-label">Route:</span>
              <span class="detail-value">${route || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDate(date)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${formatTime(time)}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">💳</span>
              Payment Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Mode:</span>
              <span class="detail-value">${paymentMethod === '0' ? 'Cash Payment' : paymentMethod === '20' ? 'UPI/Card (20% Advance)' : paymentMethod === '100' ? 'UPI/Card (100% Advance)' : 'Cash'}</span>
            </div>
            <div class="payment-status">
              Total Charges: ₹${totalFare || car?.price || 0} ${paymentMethod === '20' ? '(20% Advance Paid)' : paymentMethod === '100' ? '(100% Advance Paid)' : '(Cash on Delivery)'}
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📍</span>
              Pickup Location
            </div>
            <div class="detail-value">${traveller?.pickup || traveller?.pickupAddress || 'N/A'}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🎯</span>
              Drop Location
            </div>
            <div class="detail-value">${traveller?.drop || traveller?.dropAddress || 'N/A'}</div>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="footer-tagline">Admin Notification System</div>
          
          <div class="contact-info">
            <div class="contact-item">📧 <a href="mailto:info.pentacab@gmail.com" style="color: white; text-decoration: none;">info.pentacab@gmail.com</a></div>
            <div class="contact-item">📱 <a href="tel:+917600839900" style="color: white; text-decoration: none;">+91-7600839900</a></div>
            <div class="contact-item">🌐 <a href="https://www.pentacab.com/" style="color: white; text-decoration: none;">https://www.pentacab.com/</a></div>
          </div>
          
          <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
            <p>Please assign a driver and vehicle for this booking.</p>
            <p style="margin-top: 8px;">© 2015 Penta Cab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for driver details emails
const generateDriverDetailsTemplate = (bookingData, driverDetails) => {
  const { route, date, time, car, traveller, bookingId, paymentMethod, totalFare } = bookingData;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Driver Details - Penta Cab</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .header-subtitle {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .booking-id-section {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin-bottom: 25px;
        }
        
        .booking-id-label {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .booking-id-value {
          font-size: 24px;
          font-weight: bold;
          font-family: monospace;
          letter-spacing: 1px;
        }
        
        .info-section {
          margin-bottom: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          border-left: 4px solid #28a745;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
        }
        
        .section-icon {
          font-size: 18px;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #28a745;
          color: white;
          display: inline-block;
          text-align: center;
          line-height: 30px;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .payment-status {
          background: #28a745;
          color: white;
          padding: 12px 16px;
          border-radius: 6px;
          text-align: center;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .driver-section {
          background: linear-gradient(135deg, #1a5490 0%, #0d3a66 100%);
          color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          border: 2px solid #2d6fb8;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .driver-section .section-title {
          color: #ffffff !important;
          font-size: 18px;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          margin-bottom: 15px;
        }
        
        .driver-section .section-icon {
          background: #28a745;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          margin-right: 10px;
          vertical-align: middle;
        }
        
        .vehicle-section {
          background: linear-gradient(135deg, #fd7e14 0%, #e8590c 100%);
          color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .whatsapp-button {
          display: inline-block;
          background: #25d366;
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 600;
          margin-top: 15px;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .footer-tagline {
          font-size: 14px;
          margin-bottom: 15px;
          opacity: 0.9;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .email-container {
            border-radius: 8px;
          }
          
          .email-header {
            padding: 25px 15px;
          }
          
          .email-body {
            padding: 25px 15px;
          }
          
          .booking-id-value {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">🚗 PENTA CAB</div>
          <div class="header-title">Driver Details Assigned!</div>
          <div class="header-subtitle">Your chauffeur is ready</div>
        </div>
        
        <div class="email-body">
          <div class="booking-id-section">
            <div class="booking-id-label">Booking ID</div>
            <div class="booking-id-value">${bookingId || "N/A"}</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🚗</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Type:</span>
              <span class="detail-value"> ${
                getCabName(car)
                  ? `${getCabName(car)} AC taxi vehicle`
                  : "AC taxi vehicle"
              }</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">👤</span>
              Guest Information
            </div>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">Mr/Mrs - ${
                traveller?.name || "N/A"
              }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Mobile:</span>
              <span class="detail-value">+91 ${
                traveller?.mobile || "N/A"
              }</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📅</span>
              Trip Schedule
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${formatDate(date)}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time:</span>
              <span class="detail-value">${formatTime(time)}</span>
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">💳</span>
              Payment Details
            </div>
            <div class="detail-row">
              <span class="detail-label">Mode:</span>
              <span class="detail-value">${
                paymentMethod === "0"
                  ? "Cash/UPI"
                  : paymentMethod === "20"
                  ? "UPI/Card (20% Advance)"
                  : paymentMethod === "100"
                  ? "UPI/Card (100% Advance)"
                  : "Cash/UPI"
              }</span>
            </div>
            <div class="payment-status">
              Total Charges: ${totalFare || car?.price || 0}/- INR ${
    paymentMethod === "20"
      ? "(20% done)"
      : paymentMethod === "100"
      ? "(100% done)"
      : ""
  }
            </div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">📍</span>
              Pickup Location
            </div>
            <div class="detail-value">${
              traveller?.pickup || traveller?.pickupAddress || "N/A"
            }</div>
          </div>
          
          <div class="info-section">
            <div class="section-title">
              <span class="section-icon">🎯</span>
              Drop Location
            </div>
            <div class="detail-value">${
              traveller?.drop || traveller?.dropAddress || "N/A"
            }</div>
          </div>
          
          <div class="driver-section">
            <div class="section-title" style="color: #ffffff !important; font-size: 20px; font-weight: 900; text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5); margin-bottom: 18px; letter-spacing: 0.5px;">
              <span class="section-icon" style="background: #28a745; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; margin-right: 10px; vertical-align: middle; padding: 2px;">👨‍💼</span>
              Chauffeur/Driver Details
            </div>
            <div class="detail-row">
              <span class="detail-label" style="font-weight: 600; color: #fff; font-size: 14px; display: inline-block; width: 140px; white-space: nowrap;">Chauffeur:</span>
              <span class="detail-value" style="color: #fff; font-size: 15px; font-weight: 600;">${
                driverDetails?.name || "N/A"
              }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label" style="font-weight: 600; color: #fff; font-size: 14px; display: inline-block; width: 140px; white-space: nowrap;">Mob. No:</span>
              <span class="detail-value" style="color: #fff; font-size: 15px; font-weight: 600;">${
                driverDetails?.whatsappNumber || "N/A"
              }</span>
            </div>
            <a href="https://wa.me/${
              driverDetails?.whatsappNumber?.replace(/[^0-9]/g, "") || ""
            }" class="whatsapp-button">
              💬 Contact Driver on WhatsApp
            </a>
          </div>
          
          <div class="vehicle-section">
            <div class="section-title">
              <span class="section-icon">🚙</span>
              Vehicle Details
            </div>
            <div class="detail-row">
              <span class="detail-label" style="font-weight: 600; color: #fff; font-size: 14px; display: inline-block; width: 140px; white-space: nowrap;">Car Name:</span>
              <span class="detail-value" style="color: #fff; font-size: 15px; font-weight: 600;">${
                driverDetails?.carName
              }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label" style="font-weight: 600; color: #fff; font-size: 14px; display: inline-block; width: 140px; white-space: nowrap;">Vehicle Number:</span>
              <span class="detail-value" style="color: #fff; font-size: 15px; font-weight: 600;">${
                driverDetails?.vehicleNumber || "N/A"
              }</span>
            </div>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="footer-tagline">Your trusted travel partner</div>
          
          <div class="contact-info">
            <div class="contact-item">📧 <a href="mailto:info.pentacab@gmail.com" style="color: white; text-decoration: none;">info.pentacab@gmail.com</a></div>
            <div class="contact-item">📱 <a href="tel:+917600839900" style="color: white; text-decoration: none;">+91-7600839900</a></div>
            <div class="contact-item">🌐 <a href="https://www.pentacab.com/" style="color: white; text-decoration: none;">https://www.pentacab.com/</a></div>
          </div>
          
          <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
            <p>Safe travels! 🚗✨</p>
            <p style="margin-top: 8px;">© 2015 Penta Cab. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for decline emails
const generateDeclineTemplate = (route, reason) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Update</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
          margin: 0;
          padding: 20px;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
        }
        
        .company-logo {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .header-title {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .email-body {
          padding: 30px 20px;
        }
        
        .decline-info {
          background: #fff5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
          border-left: 4px solid #dc3545;
        }
        
        .detail-row {
          margin-bottom: 10px;
          padding: 5px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #555;
          font-size: 14px;
          display: inline-block;
          width: 120px;
        }
        
        .detail-value {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .apology-note {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-style: italic;
        }
        
        .email-footer {
          background: #2c3e50;
          color: white;
          padding: 25px 20px;
          text-align: center;
        }
        
        .footer-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .contact-info {
          margin-top: 15px;
          font-size: 12px;
          opacity: 0.8;
        }
        
        .contact-item {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <div class="company-logo">🚗 PENTA CAB</div>
          <div class="header-title">Booking Update</div>
        </div>
        
        <div class="email-body">
          <div class="decline-info">
            <p style="margin-bottom: 16px; font-size: 16px; color: #2c3e50;">
              We regret to inform you that we are unable to fulfill your booking request at this time.
            </p>
            
            <div class="detail-row">
              <span class="detail-label">Route:</span>
              <span class="detail-value">${route}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-label">Reason:</span>
              <span class="detail-value">${reason || 'Service temporarily unavailable'}</span>
            </div>
          </div>
          
          <div class="apology-note">
            <p>We sincerely apologize for any inconvenience this may cause.</p>
            <p style="margin-top: 8px;">Please feel free to contact us for alternative arrangements.</p>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="footer-logo">PENTA CAB</div>
          <div class="contact-info">
            <div class="contact-item">📧 info.pentacab@gmail.com</div>
            <div class="contact-item">📱 +91-7600839900</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateEmailTemplate,
  generateBookingConfirmationTemplate,
  generateAdminBookingNotificationTemplate,
  generateDriverDetailsTemplate,
  generateDeclineTemplate
};
