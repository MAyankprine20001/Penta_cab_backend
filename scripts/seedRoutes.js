const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Route } = require('../model');

// Default routes data
const defaultRoutes = [
  {
    routeName: "Ahmedabad to Mumbai",
    from: "Ahmedabad",
    to: "Mumbai",
    description: `<p>Experience a comfortable journey from Ahmedabad to Mumbai with our premium cab service. This popular route takes you through scenic landscapes and bustling cities.</p>
    <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop" alt="Ahmedabad to Mumbai route" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Route Highlights</h2>
    <ul>
      <li>Well-maintained highways</li>
      <li>Multiple rest stops available</li>
      <li>Professional drivers with local knowledge</li>
      <li>Comfortable seating and climate control</li>
    </ul>
    <p>Book your journey today and enjoy a hassle-free travel experience!</p>`,
    seoTitle: "Ahmedabad to Mumbai Cab Service | Penta CAB",
    seoDescription: "Book reliable cab service from Ahmedabad to Mumbai. Professional drivers, comfortable vehicles, and competitive pricing. Available 24/7.",
    seoKeywords: ["ahmedabad to mumbai cab", "mumbai cab service", "intercity travel", "cab booking"],
    status: "active",
    tags: ["intercity", "mumbai", "ahmedabad", "outstation"],
    lastBooking: "2024-01-18"
  },
  {
    routeName: "Mumbai Airport Transfer",
    from: "Mumbai Airport",
    to: "Mumbai City",
    description: `<p>Quick and reliable airport transfer service in Mumbai. Our drivers track your flight and ensure timely pickup and drop-off.</p>
    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop" alt="Mumbai Airport" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Airport Transfer Features</h2>
    <ul>
      <li>Flight tracking and monitoring</li>
      <li>Meet and greet service</li>
      <li>Luggage assistance</li>
      <li>24/7 availability</li>
    </ul>`,
    seoTitle: "Mumbai Airport Transfer Service | Penta CAB",
    seoDescription: "Professional Mumbai airport transfer service. Flight tracking, meet & greet, luggage assistance. Book now for reliable airport transportation.",
    seoKeywords: ["mumbai airport transfer", "airport cab mumbai", "mumbai airport taxi", "airport pickup"],
    status: "active",
    tags: ["airport", "mumbai", "transfer", "pickup"],
    lastBooking: "2024-01-19"
  },
  {
    routeName: "Local City Tour",
    from: "City Center",
    to: "Various Locations",
    description: `<p>Explore the city with our comprehensive local tour packages. Visit all major attractions and hidden gems with our knowledgeable drivers.</p>
    <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop" alt="City tour" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Tour Packages</h2>
    <ul>
      <li>Half-day city tour (4 hours)</li>
      <li>Full-day city tour (8 hours)</li>
      <li>Custom itinerary planning</li>
      <li>Multi-language guides available</li>
    </ul>`,
    seoTitle: "City Tour Service | Local Sightseeing | Penta CAB",
    seoDescription: "Explore the city with our local tour packages. Professional guides, comfortable vehicles, and customizable itineraries for the perfect city experience.",
    seoKeywords: ["city tour", "local sightseeing", "tour packages", "city exploration"],
    status: "active",
    tags: ["local", "tour", "sightseeing", "city"],
    lastBooking: "2024-01-17"
  },
  {
    routeName: "Delhi to Jaipur",
    from: "Delhi",
    to: "Jaipur",
    description: `<p>Discover the royal heritage of Rajasthan with our Delhi to Jaipur round-trip service. Experience the Pink City in comfort and style.</p>
    <img src="https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=400&fit=crop" alt="Delhi to Jaipur" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Round Trip Benefits</h2>
    <ul>
      <li>Same driver for both journeys</li>
      <li>Flexible return timing</li>
      <li>Luggage storage during stay</li>
      <li>Local recommendations and tips</li>
    </ul>`,
    seoTitle: "Delhi to Jaipur Cab Service | Round Trip | Penta CAB",
    seoDescription: "Book round-trip cab service from Delhi to Jaipur. Same driver, flexible timing, and comfortable journey to the Pink City of Rajasthan.",
    seoKeywords: ["delhi to jaipur cab", "jaipur round trip", "rajasthan travel", "pink city tour"],
    status: "active",
    tags: ["delhi", "jaipur", "round trip", "rajasthan"],
    lastBooking: "2024-01-10"
  },
  {
    routeName: "Mumbai to Pune",
    from: "Mumbai",
    to: "Pune",
    description: `<p>Fast and efficient service between Mumbai and Pune. Perfect for business travelers and weekend getaways to the cultural capital of Maharashtra.</p>
    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop" alt="Mumbai to Pune" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Why Choose This Route</h2>
    <ul>
      <li>Express highway connectivity</li>
      <li>Minimal traffic delays</li>
      <li>Comfortable business-class seating</li>
      <li>WiFi and charging ports available</li>
    </ul>`,
    seoTitle: "Mumbai to Pune Cab Service | Express Highway | Penta CAB",
    seoDescription: "Fast and comfortable cab service from Mumbai to Pune via express highway. Business-class amenities, WiFi, and reliable timing for your journey.",
    seoKeywords: ["mumbai to pune cab", "pune travel", "express highway", "business travel"],
    status: "active",
    tags: ["mumbai", "pune", "express", "business"],
    lastBooking: "2024-01-20"
  }
];

async function seedRoutes() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Check if routes already exist
    const existingCount = await Route.countDocuments({});
    
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} routes. Skipping seed.`);
      console.log('If you want to seed anyway, delete existing routes first.');
      process.exit(0);
    }
    
    // Insert default routes
    console.log('Seeding default routes...');
    const result = await Route.insertMany(defaultRoutes);
    
    console.log(`✅ Successfully seeded ${result.length} routes to database!`);
    console.log('Routes seeded:');
    result.forEach((route, index) => {
      console.log(`  ${index + 1}. ${route.routeName} (${route.from} → ${route.to})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding routes:', error);
    process.exit(1);
  }
}

// Run the seed function
seedRoutes();

