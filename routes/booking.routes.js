const router = require('express').Router();
const sendEmail = require('../services/email.service');
const { BookingRequest } = require('../model');
const { generateDriverDetailsTemplate, generateDeclineTemplate } = require('../utils/emailTemplates');

// Cab type to name mapping
const getCabName = (cabTypeOrId) => {
  // Handle both cab type strings and ID strings
  const cabTypeMapping = {
    'sedan': 'SEDAN',
    'suv': 'SUV', 
    'innova': 'Innova',
    'crysta': 'INNOVA CRYSTAL'
  };
  
  const cabIdMapping = {
    '1': 'Innova',
    '2': 'SEDAN',
    '3': 'SUV',
    '4': 'INNOVA CRYSTAL'
  };
  
  // First try ID mapping, then type mapping
  return cabIdMapping[cabTypeOrId] || cabTypeMapping[cabTypeOrId] || cabTypeOrId;
};

// POST /api/create-booking-request
router.post('/api/create-booking-request', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Calculate payment details based on payment method
    const paymentMethod = bookingData.paymentMethod || '0';
    const totalFare = bookingData.cab?.price || 0;
    let amountPaid = 0;
    let remainingAmount = totalFare;
    let paymentStatus = 'pending';
    
    if (paymentMethod === '20') {
      amountPaid = Math.round(totalFare * 0.2); // 20% advance
      remainingAmount = totalFare - amountPaid;
      paymentStatus = 'partial';
    } else if (paymentMethod === '100') {
      amountPaid = totalFare; // 100% advance
      remainingAmount = 0;
      paymentStatus = 'full';
    }
    
    // Add payment details to the booking data
    const bookingRequestData = {
      ...bookingData,
      paymentDetails: {
        totalFare: totalFare,
        amountPaid: amountPaid,
        remainingAmount: remainingAmount,
        paymentStatus: paymentStatus,
        paymentDate: new Date()
      }
    };
    
    const bookingRequest = new BookingRequest(bookingRequestData);
    await bookingRequest.save();
    
    console.log("Direct booking created with payment details:", {
      paymentMethod,
      totalFare,
      amountPaid,
      remainingAmount,
      paymentStatus
    });
    
    res.status(201).json({ message: 'Booking request created successfully', bookingId: bookingRequest._id });
  } catch (err) { 
    console.error("Error creating booking request:", err);
    res.status(400).json({ error: err.message }); 
  }
});

// GET /api/booking-requests (pagination)
router.get('/api/booking-requests', async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const bookingRequests = await BookingRequest.find()
      .sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await BookingRequest.countDocuments();

    // Add calculated payment information and cab name to each booking request
    const bookingRequestsWithPayment = bookingRequests.map(request => {
      const paymentMethod = request.paymentMethod || '0';
      let remainingAmount = 0;
      let paymentStatus = 'Cash on Delivery';
      
      // Use paymentDetails.totalFare if available, otherwise fall back to cab.price
      const totalFare = request.paymentDetails?.totalFare || request.cab.price || 0;
      
      if (paymentMethod === '20') {
        // 20% advance payment
        remainingAmount = totalFare * 0.8; // 80% remaining
        paymentStatus = '20% Advance';
      } else if (paymentMethod === '100') {
        // 100% advance payment
        remainingAmount = 0; // No remaining amount
        paymentStatus = '100% Advance';
      } else {
        // Cash on delivery (paymentMethod === '0')
        remainingAmount = totalFare; // Full amount remaining
        paymentStatus = 'Cash on Delivery';
      }

      return {
        ...request.toObject(),
        calculatedPayment: {
          remainingAmount: Math.round(remainingAmount),
          paymentStatus: paymentStatus,
          totalFare: totalFare
        },
        cab: {
          ...(typeof request.cab === 'string' ? { _id: request.cab } : request.cab),
          name: getCabName(typeof request.cab === 'string' ? request.cab : request.cab?.type)
        }
      };
    });

    res.json({ bookingRequests: bookingRequestsWithPayment, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/booking-requests/:id/status
router.put('/api/booking-requests/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      req.params.id, { status, adminNotes }, { new: true }
    );
    if (!bookingRequest) return res.status(404).json({ error: 'Booking request not found' });
    res.json({ message: 'Booking request status updated successfully', bookingRequest });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/booking-requests/:id/driver-details
router.put('/api/booking-requests/:id/driver-details', async (req, res) => {
  try {
    const { driverDetails } = req.body;
    const bookingRequest = await BookingRequest.findByIdAndUpdate(
      req.params.id, { driverDetails, status: 'driver_sent' }, { new: true }
    );
    if (!bookingRequest) return res.status(404).json({ error: 'Booking request not found' });

    // Generate the modern driver details email template
    const html = generateDriverDetailsTemplate({
      route: bookingRequest.route,
      date: bookingRequest.date,
      time: bookingRequest.time
    }, driverDetails);

    await sendEmail({
      to: bookingRequest.traveller.email,
      subject: "🚖 Your Driver Details - MakeRide",
      html
    });

    return res.json({ message: 'Driver details added and email sent successfully', bookingRequest });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/send-decline-email
router.post('/api/send-decline-email', async (req, res) => {
  try {
    const { email, route, reason } = req.body;
    // Generate the modern decline email template
    const html = generateDeclineTemplate(route, reason);
    
    await sendEmail({ 
      to: email, 
      subject: "📝 Booking Update - MakeRide", 
      html 
    });
    return res.json({ message: 'Decline email sent successfully' });
  } catch (err) { res.status(500).json({ error: 'Failed to send decline email' }); }
});

// POST /api/fix-payment-details - Utility endpoint to fix existing bookings
router.post('/api/fix-payment-details', async (req, res) => {
  try {
    // Find all bookings that don't have paymentDetails.totalFare set
    const bookingsWithoutPaymentDetails = await BookingRequest.find({
      $or: [
        { 'paymentDetails.totalFare': { $exists: false } },
        { 'paymentDetails.totalFare': 0 },
        { 'paymentDetails.totalFare': null }
      ]
    });
    
    let fixedCount = 0;
    
    for (const booking of bookingsWithoutPaymentDetails) {
      const paymentMethod = booking.paymentMethod || '0';
      const totalFare = booking.cab?.price || 0;
      let amountPaid = 0;
      let remainingAmount = totalFare;
      let paymentStatus = 'pending';
      
      if (paymentMethod === '20') {
        amountPaid = Math.round(totalFare * 0.2);
        remainingAmount = totalFare - amountPaid;
        paymentStatus = 'partial';
      } else if (paymentMethod === '100') {
        amountPaid = totalFare;
        remainingAmount = 0;
        paymentStatus = 'full';
      }
      
      // Update the booking with payment details
      await BookingRequest.findByIdAndUpdate(booking._id, {
        paymentDetails: {
          totalFare: totalFare,
          amountPaid: amountPaid,
          remainingAmount: remainingAmount,
          paymentStatus: paymentStatus,
          paymentDate: new Date()
        }
      });
      
      fixedCount++;
    }
    
    res.json({ 
      message: `Fixed payment details for ${fixedCount} bookings`,
      fixedCount: fixedCount,
      totalFound: bookingsWithoutPaymentDetails.length
    });
  } catch (err) { 
    console.error("Error fixing payment details:", err);
    res.status(500).json({ error: err.message }); 
  }
});

module.exports = router;
