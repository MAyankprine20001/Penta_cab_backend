// Email Template Utility for MakeRide
// Provides consistent, professional email templates for all booking types

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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          text-align: center;
        }
        
        .email-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .email-header .icon {
          font-size: 28px;
        }
        
        .email-body {
          padding: 32px 24px;
        }
        
        .booking-summary {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          border-left: 4px solid #667eea;
        }
        
        .route-info {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .car-selection {
          font-size: 16px;
          color: #34495e;
          font-weight: 500;
        }
        
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e0e0e0, transparent);
          margin: 24px 0;
        }
        
        .traveller-section {
          margin-bottom: 24px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .traveller-details {
          display: grid;
          gap: 12px;
        }
        
        .detail-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #34495e;
          min-width: 80px;
          font-size: 14px;
        }
        
        .detail-value {
          color: #2c3e50;
          flex: 1;
          font-size: 14px;
          word-break: break-word;
        }
        
        .email-footer {
          background-color: #f8f9fa;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        
        .company-name {
          font-weight: 600;
          color: #667eea;
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .tagline {
          color: #6c757d;
          font-size: 14px;
        }
        
        .contact-info {
          margin-top: 16px;
          font-size: 13px;
          color: #6c757d;
        }
        
        .highlight {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 4px;
          padding: 8px 12px;
          margin: 8px 0;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 0;
            border-radius: 0;
          }
          
          .email-body {
            padding: 24px 16px;
          }
          
          .email-header {
            padding: 20px 16px;
          }
          
          .email-header h1 {
            font-size: 20px;
          }
          
          .detail-row {
            flex-direction: column;
            gap: 4px;
          }
          
          .detail-label {
            min-width: auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>
            <span class="icon">${icon}</span>
            ${title}
          </h1>
        </div>
        
        <div class="email-body">
          <div class="booking-summary">
            <div class="route-info">
              <span>📍</span>
              <span>Route: ${route}</span>
            </div>
            <div class="car-selection">
              <span>🚗</span>
              <span>${carLabel}: ${car.type.toUpperCase()} - ₹${car.price}</span>
            </div>
            ${date && time ? `
              <div style="margin-top: 12px; font-size: 14px; color: #6c757d;">
                <span>📅</span>
                <span>${date} at ${time}</span>
              </div>
            ` : ''}
          </div>
          
          <div class="divider"></div>
          
          <div class="traveller-section">
            <h3 class="section-title">
              <span>👤</span>
              <span>Traveller Details</span>
            </h3>
            
            <div class="traveller-details">
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${traveller.name}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Mobile:</span>
                <span class="detail-value">${traveller.mobile}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">
                  <a href="mailto:${traveller.email}" style="color: #667eea; text-decoration: none;">
                    ${traveller.email}
                  </a>
                </span>
              </div>
              
              ${traveller.pickup || traveller.pickupAddress ? `
                <div class="detail-row">
                  <span class="detail-label">Pickup:</span>
                  <span class="detail-value">${traveller.pickup || traveller.pickupAddress}</span>
                </div>
              ` : ''}
              
              ${traveller.drop || traveller.dropAddress ? `
                <div class="detail-row">
                  <span class="detail-label">Drop:</span>
                  <span class="detail-value">${traveller.drop || traveller.dropAddress}</span>
                </div>
              ` : ''}
              
              ${traveller.remark ? `
                <div class="detail-row">
                  <span class="detail-label">Remark:</span>
                  <span class="detail-value">${traveller.remark}</span>
                </div>
              ` : ''}
              
              ${traveller.gst ? `
                <div class="detail-row">
                  <span class="detail-label">GST:</span>
                  <span class="detail-value">${traveller.gst}</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          ${traveller.gstDetails ? `
            <div class="highlight">
              <strong>📋 GST Details Required:</strong> Please provide your GST details for invoice generation.
            </div>
          ` : ''}
        </div>
        
        <div class="email-footer">
          <div class="company-name">MakeRide Team</div>
          <div class="tagline">Your trusted travel partner</div>
          <div class="contact-info">
            <p>📧 support@makeride.com | 📱 +91-XXXX-XXXXXX</p>
            <p>🌐 www.makeride.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Template for booking confirmation emails
const generateBookingConfirmationTemplate = (bookingData) => {
  const { route, car, traveller, date, time, serviceType, bookingId, paymentMethod, totalFare, amountPaid } = bookingData;
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr;
  };

  // Get payment mode
  const getPaymentMode = (method) => {
    switch(method) {
      case '0': return 'Cash';
      case '20': return 'UPI/Card (20% Advance)';
      case '100': return 'UPI/Card (100% Advance)';
      default: return 'Cash';
    }
  };

  // Get vehicle type
  const getVehicleType = (carType) => {
    switch(carType?.toLowerCase()) {
      case 'sedan': return 'Sedan AC taxi vehicle';
      case 'suv': return 'SUV AC taxi vehicle';
      case 'innova': return 'Innova AC taxi vehicle';
      case 'crysta': return 'Innova Crysta AC taxi vehicle';
      default: return 'AC taxi vehicle';
    }
  };

  // Calculate charges display
  const getChargesDisplay = () => {
    if (paymentMethod === '20') {
      return `${totalFare}/- INR (20% done)`;
    } else if (paymentMethod === '100') {
      return `${totalFare}/- INR (100% done)`;
    } else {
      return `${totalFare}/- INR`;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .value {
          margin-bottom: 10px;
        }
        .booking-id {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Your booking has been confirmed by Penta cab for</h2>
      </div>

      <div class="section">
        <div class="label">Vehicle Type</div>
        <div class="value">${getVehicleType(car?.type)}</div>
      </div>

      <div class="booking-id">
        <div class="label">Booking id</div>
        <div class="value">${bookingId || 'N/A'}</div>
      </div>

      <div class="section">
        <div class="label">Guest</div>
        <div class="value">
          <div class="label">Name</div>
          <div class="value">Mr/Mrs - ${traveller?.name || 'N/A'}</div>
          
          <div class="label">Mobile number</div>
          <div class="value">‪+91  ${traveller?.mobile || 'N/A'}‬</div>
        </div>
      </div>

      <div class="section">
        <div class="label">Date - ${formatDate(date)}</div>
        <div class="label">Time - ${formatTime(time)}</div>
      </div>

      <div class="section">
        <div class="label">Payment mode</div>
        <div class="value">Cash/upi - ${getPaymentMode(paymentMethod)}</div>
      </div>

      <div class="section">
        <div class="label">Pickup location</div>
        <div class="value">${traveller?.pickup || traveller?.pickupAddress || 'N/A'}</div>
      </div>

      <div class="section">
        <div class="label">Drop location</div>
        <div class="value">${traveller?.drop || traveller?.dropAddress || 'N/A'}</div>
      </div>

      <div class="section">
        <div class="label">Charges</div>
        <div class="value">${getChargesDisplay()}</div>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p>Thank you for choosing Penta Cab!</p>
        <p>Our team will contact you shortly with driver details.</p>
      </div>
    </body>
    </html>
  `;
};

// Template for driver details emails
const generateDriverDetailsTemplate = (bookingData, driverDetails) => {
  const { route, date, time, car, traveller, bookingId, paymentMethod, totalFare } = bookingData;
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    return timeStr;
  };

  // Get payment mode
  const getPaymentMode = (method) => {
    switch(method) {
      case '0': return 'Cash';
      case '20': return 'UPI/Card (20% Advance)';
      case '100': return 'UPI/Card (100% Advance)';
      default: return 'Cash';
    }
  };

  // Get vehicle type
  const getVehicleType = (carType) => {
    switch(carType?.toLowerCase()) {
      case 'sedan': return 'Sedan AC taxi vehicle';
      case 'suv': return 'SUV AC taxi vehicle';
      case 'innova': return 'Innova AC taxi vehicle';
      case 'crysta': return 'Innova Crysta AC taxi vehicle';
      default: return 'AC taxi vehicle';
    }
  };

  // Calculate charges display
  const getChargesDisplay = () => {
    if (paymentMethod === '20') {
      return `${totalFare}/- INR (20% done)`;
    } else if (paymentMethod === '100') {
      return `${totalFare}/- INR (100% done)`;
    } else {
      return `${totalFare}/- INR`;
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Driver Details</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .section {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .value {
          margin-bottom: 10px;
        }
        .booking-id {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          font-family: monospace;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
        }
        .driver-section {
          background-color: #f9f9f9;
          border: 2px solid #007bff;
        }
        .vehicle-section {
          background-color: #e8f5e8;
          border: 2px solid #28a745;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Your booking has been confirmed by Penta cab for</h2>
      </div>

      <div class="section">
        <div class="label">Vehicle Type</div>
        <div class="value">${getVehicleType(car?.type)}</div>
      </div>

      <div class="booking-id">
        <div class="label">Booking id</div>
        <div class="value">${bookingId || 'N/A'}</div>
      </div>

      <div class="section">
        <div class="label">Guest</div>
        <div class="value">
          <div class="label">Name</div>
          <div class="value">Mr/Mrs - ${traveller?.name || 'N/A'}</div>
          
          <div class="label">Mobile number</div>
          <div class="value">‪+91  ${traveller?.mobile || 'N/A'}‬</div>
        </div>
      </div>

      <div class="section">
        <div class="label">Date - ${formatDate(date)}</div>
        <div class="label">Time - ${formatTime(time)}</div>
      </div>

      <div class="section">
        <div class="label">Payment mode</div>
        <div class="value">Cash/upi - ${getPaymentMode(paymentMethod)}</div>
      </div>

      <div class="section">
        <div class="label">Pickup location</div>
        <div class="value">${traveller?.pickup || traveller?.pickupAddress || 'N/A'}</div>
      </div>

      <div class="section">
        <div class="label">Drop location</div>
        <div class="value">${traveller?.drop || traveller?.dropAddress || 'N/A'}</div>
      </div>

      <div class="section">
        <div class="label">Charges</div>
        <div class="value">${getChargesDisplay()}</div>
      </div>

      <div class="section driver-section">
        <div class="label">Chauffeur details :</div>
        <div class="value">
          <div class="label">Chauffeur :</div>
          <div class="value">${driverDetails?.name || 'N/A'}</div>
          
          <div class="label">Mob. No :</div>
          <div class="value">${driverDetails?.whatsappNumber || 'N/A'}</div>
        </div>
      </div>

      <div class="section vehicle-section">
        <div class="label">Vehicle details :</div>
        <div class="value">
          <div class="label">Cab :</div>
          <div class="value">${car?.name || car?.type || 'N/A'}</div>
          
          <div class="label">Reg. no/car number . :</div>
          <div class="value">${driverDetails?.vehicleNumber || 'N/A'}</div>
        </div>
      </div>

      <div style="text-align: center; margin-top: 30px; color: #666;">
        <p>Thank you for choosing Penta Cab!</p>
        <p>Safe travels! 🚗✨</p>
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8f9fa;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .email-header {
          background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
          color: white;
          padding: 24px;
          text-align: center;
        }
        
        .email-header h1 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .email-body {
          padding: 32px 24px;
        }
        
        .decline-info {
          background-color: #fff5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          border-left: 4px solid #dc3545;
        }
        
        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 8px 0;
          font-size: 14px;
        }
        
        .info-label {
          font-weight: 600;
          color: #34495e;
          min-width: 80px;
        }
        
        .info-value {
          color: #2c3e50;
          flex: 1;
        }
        
        .apology-note {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-style: italic;
        }
        
        .email-footer {
          background-color: #f8f9fa;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        
        .company-name {
          font-weight: 600;
          color: #dc3545;
          font-size: 16px;
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>
            <span>📝</span>
            <span>Booking Update</span>
          </h1>
        </div>
        
        <div class="email-body">
          <div class="decline-info">
            <p style="margin-bottom: 16px; font-size: 16px; color: #2c3e50;">
              We regret to inform you that we are unable to fulfill your booking request at this time.
            </p>
            
            <div class="info-row">
              <span class="info-label">Route:</span>
              <span class="info-value">${route}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Reason:</span>
              <span class="info-value">${reason || 'Service temporarily unavailable'}</span>
            </div>
          </div>
          
          <div class="apology-note">
            <p>We sincerely apologize for any inconvenience this may cause.</p>
            <p style="margin-top: 8px;">Please feel free to contact us for alternative arrangements.</p>
          </div>
        </div>
        
        <div class="email-footer">
          <div class="company-name">MakeRide Team</div>
          <p style="color: #6c757d; font-size: 14px; margin-top: 8px;">
            📧 support@makeride.com | 📱 +91-XXXX-XXXXXX
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  generateEmailTemplate,
  generateBookingConfirmationTemplate,
  generateDriverDetailsTemplate,
  generateDeclineTemplate
};
