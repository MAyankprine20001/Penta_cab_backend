const mongoose = require('mongoose');
const connectDB = require('../config/db');
const { Blog } = require('../model');

// Default blogs data
const defaultBlogs = [
  {
    title: "Welcome to Penta CAB Blog",
    content: `<p>This is our first blog post about our amazing cab services. We are committed to providing the best transportation solutions for our customers.</p>
    <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop" alt="Modern taxi service" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <p>Our fleet consists of modern, well-maintained vehicles that ensure your comfort and safety during your journey.</p>
    <h2>Why Choose Penta CAB?</h2>
    <ul>
      <li>Professional drivers with years of experience</li>
      <li>24/7 availability</li>
      <li>Competitive pricing</li>
      <li>Clean and comfortable vehicles</li>
    </ul>`,
    excerpt: "Discover the best cab services in your city with Penta CAB.",
    author: "Admin",
    publishedAt: "2024-01-15",
    status: "published",
    tags: ["travel", "cab", "services"]
  },
  {
    title: "Top 10 Places to Visit in Mumbai",
    content: `<p>Explore the vibrant city of Mumbai with our curated list of must-visit destinations. From historical landmarks to modern attractions, Mumbai has something for everyone.</p>
    <img src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=400&fit=crop" alt="Mumbai skyline" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Must-Visit Locations</h2>
    <p>Mumbai, the financial capital of India, offers a unique blend of history, culture, and modernity.</p>
    <img src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=400&fit=crop" alt="Gateway of India" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <p>Our experienced drivers know all the best routes to help you navigate this bustling metropolis efficiently.</p>`,
    excerpt: "Discover Mumbai's most iconic destinations.",
    author: "Admin",
    publishedAt: "2024-01-10",
    status: "published",
    tags: ["mumbai", "travel", "destinations"]
  },
  {
    title: "Best Cab Booking Tips for Travelers",
    content: `<p>Learn the essential tips for booking cabs efficiently and getting the best deals for your travel needs.</p>
    <img src="https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=400&fit=crop" alt="Cab booking app" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <h2>Smart Booking Strategies</h2>
    <p>Booking a cab doesn't have to be complicated. Follow these simple tips to ensure a smooth experience:</p>
    <ol>
      <li>Book in advance during peak hours</li>
      <li>Check multiple apps for the best rates</li>
      <li>Consider traffic conditions when planning</li>
      <li>Always verify driver details before getting in</li>
    </ol>
    <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop" alt="Happy traveler" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
    <p>With Penta CAB, you can rest assured that your journey will be comfortable and reliable.</p>`,
    excerpt: "Essential tips for smart cab booking and travel planning.",
    author: "Admin",
    publishedAt: "2024-01-08",
    status: "published",
    tags: ["tips", "booking", "travel"]
  }
];

async function seedBlogs() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Check if blogs already exist
    const existingCount = await Blog.countDocuments({});
    
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} blogs. Skipping seed.`);
      console.log('If you want to seed anyway, delete existing blogs first.');
      process.exit(0);
    }
    
    // Insert default blogs
    console.log('Seeding default blogs...');
    const result = await Blog.insertMany(defaultBlogs);
    
    console.log(`✅ Successfully seeded ${result.length} blogs to database!`);
    console.log('Blogs seeded:');
    result.forEach((blog, index) => {
      console.log(`  ${index + 1}. ${blog.title} (${blog.status})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  }
}

// Run the seed function
seedBlogs();

