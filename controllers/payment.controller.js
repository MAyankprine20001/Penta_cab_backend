const CreateRazorPayInstance = require("../config/razorPay.config");
const crypto = require("crypto");
const { BookingRequest } = require("../model");
require("dotenv").config();

const razorPayInstance = CreateRazorPayInstance();

// controller

exports.createOrder = async (req, res) => {
  try {
    let { price, booking, selectedPayment } = req.body;

    if (price == null || isNaN(Number(price))) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    const amountInPaise = Math.round(Number(price) * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      // Razorpay will persist these; great for ops/reconciliation
      notes: {
        selectedPayment: selectedPayment ?? "",
        // keep it short; avoid dumping huge strings
        serviceType: booking?.serviceType ?? "",
        tripType: booking?.tripType ?? "",
        city: booking?.city ?? "",
        date: booking?.date ?? "",
        time: booking?.time ?? booking?.pickupTime ?? "",
        car: booking?.selectedCabName ?? booking?.car ?? "",
        name: booking?.name ?? "",
        mobile: booking?.mobile ?? "",
      },
    };

    razorPayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay order error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error creating order" });
      }

      return res.status(200).json({
        success: true,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
      });
    });
  } catch (error) {
    console.error("createOrder exception:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingData,
      selectedPayment,
      totalFare
    } = req.body || {};

    console.log("Payment verification request:", {
      razorpay_order_id,
      razorpay_payment_id,
      selectedPayment,
      totalFare,
      bookingDataKeys: bookingData ? Object.keys(bookingData) : 'no booking data'
    });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: razorpay_order_id, razorpay_payment_id, razorpay_signature",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Server misconfigured: RAZORPAY_KEY_SECRET not set",
      });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // (optional) timing-safe compare when lengths match
    const ok =
      expectedSignature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "hex"),
        Buffer.from(razorpay_signature, "hex")
      );

    if (ok) {
      // Calculate payment amounts based on selected payment method
      let amountPaid = 0;
      let paymentStatus = 'pending';
      
      if (selectedPayment === '20') {
        amountPaid = Math.round(totalFare * 0.2); // 20% advance
        paymentStatus = 'partial';
      } else if (selectedPayment === '100') {
        amountPaid = totalFare; // 100% advance
        paymentStatus = 'full';
      }

      const remainingAmount = totalFare - amountPaid;

      // Create booking request with payment details
      if (bookingData) {
        const bookingRequestData = {
          ...bookingData,
          paymentMethod: selectedPayment,
          paymentDetails: {
            totalFare: totalFare,
            amountPaid: amountPaid,
            remainingAmount: remainingAmount,
            paymentStatus: paymentStatus,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            paymentDate: new Date()
          }
        };

        console.log("Creating booking with payment details:", {
          paymentMethod: selectedPayment,
          totalFare,
          amountPaid,
          remainingAmount,
          paymentStatus
        });

        try {
          const bookingRequest = new BookingRequest(bookingRequestData);
          await bookingRequest.save();
          
          console.log("Booking created successfully:", bookingRequest._id);
          
          return res.status(200).json({ 
            success: true, 
            message: "Payment verified successfully and booking created",
            bookingId: bookingRequest._id,
            paymentDetails: {
              totalFare,
              amountPaid,
              remainingAmount,
              paymentStatus
            }
          });
        } catch (bookingError) {
          console.error("Error creating booking:", bookingError);
          return res.status(500).json({
            success: false,
            message: "Payment verified but booking creation failed"
          });
        }
      }

      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid signature sent!" });
  } catch (err) {
    console.error("verifyPayment error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Verification error" });
  }
};
