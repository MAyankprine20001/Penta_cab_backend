const express = require('express');
const router = express.Router();
const { Route } = require('../model');

// Default routes data for seeding (if database is empty)
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

// Helper function to convert MongoDB document to API format
const formatRoute = (route) => {
  if (!route) return null;
  return {
    id: route._id.toString(),
    routeName: route.routeName,
    from: route.from,
    to: route.to,
    description: route.description || '',
    seoTitle: route.seoTitle || '',
    seoDescription: route.seoDescription || '',
    seoKeywords: route.seoKeywords || [],
    status: route.status || 'active',
    tags: route.tags || [],
    lastBooking: route.lastBooking || new Date().toISOString().split('T')[0],
    createdAt: route.createdAt ? route.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: route.updatedAt ? route.updatedAt.toISOString() : new Date().toISOString()
  };
};

// Get all routes with enhanced pagination
router.get('/routes', async (req, res) => {
  try {
    const { 
      status, 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      const searchTerm = search.toLowerCase();
      query.$or = [
        { routeName: { $regex: searchTerm, $options: 'i' } },
        { from: { $regex: searchTerm, $options: 'i' } },
        { to: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    // Build sort object
    const sortObj = {};
    const sortField = sortBy === 'createdAt' ? 'createdAt' : 
                     sortBy === 'updatedAt' ? 'updatedAt' :
                     sortBy === 'lastBooking' ? 'lastBooking' :
                     sortBy;
    sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count
    const total = await Route.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
    // Fetch routes
    const routes = await Route.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);
    
    // Format routes for API response
    const formattedRoutes = routes.map(formatRoute);
    
    // Calculate pagination metadata
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    const nextPage = hasNextPage ? pageNum + 1 : null;
    const prevPage = hasPrevPage ? pageNum - 1 : null;
    
    // Count routes by status
    const statusCounts = {
      total: await Route.countDocuments({}),
      active: await Route.countDocuments({ status: 'active' }),
      inactive: await Route.countDocuments({ status: 'inactive' })
    };
    
    res.json({
      success: true,
      data: formattedRoutes,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        startIndex: skip + 1,
        endIndex: Math.min(skip + limitNum, total)
      },
      statusCounts,
      filters: {
        status: status || 'all',
        search: search || '',
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes',
      error: error.message
    });
  }
});

// Get single route by ID
router.get('/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: formatRoute(route)
    });
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route',
      error: error.message
    });
  }
});

// Create new route
router.post('/routes', async (req, res) => {
  try {
    const { 
      routeName, 
      from, 
      to, 
      description, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      status, 
      tags 
    } = req.body;
    
    // Validation
    if (!routeName || !from || !to) {
      return res.status(400).json({
        success: false,
        message: 'Route name, from, and to are required'
      });
    }
    
    const newRoute = new Route({
      routeName,
      from,
      to,
      description: description || '',
      seoTitle: seoTitle || '',
      seoDescription: seoDescription || '',
      seoKeywords: seoKeywords || [],
      status: status || 'active',
      tags: tags || [],
      lastBooking: new Date().toISOString().split('T')[0]
    });
    
    await newRoute.save();
    
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: formatRoute(newRoute)
    });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create route',
      error: error.message
    });
  }
});

// Update route
router.put('/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      routeName, 
      from, 
      to, 
      description, 
      seoTitle, 
      seoDescription, 
      seoKeywords, 
      status, 
      tags 
    } = req.body;
    
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    // Update route fields
    if (routeName) route.routeName = routeName;
    if (from) route.from = from;
    if (to) route.to = to;
    if (description !== undefined) route.description = description;
    if (seoTitle !== undefined) route.seoTitle = seoTitle;
    if (seoDescription !== undefined) route.seoDescription = seoDescription;
    if (seoKeywords !== undefined) route.seoKeywords = seoKeywords;
    if (status) route.status = status;
    if (tags !== undefined) route.tags = tags;
    
    await route.save();
    
    res.json({
      success: true,
      message: 'Route updated successfully',
      data: formatRoute(route)
    });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route',
      error: error.message
    });
  }
});

// Delete route
router.delete('/routes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findByIdAndDelete(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete route',
      error: error.message
    });
  }
});

// Toggle route status (active/inactive)
router.patch('/routes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (active/inactive) is required'
      });
    }
    
    const route = await Route.findById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    route.status = status;
    await route.save();
    
    res.json({
      success: true,
      message: `Route ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: formatRoute(route)
    });
  } catch (error) {
    console.error('Error toggling route status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route status',
      error: error.message
    });
  }
});

// Get route statistics
router.get('/routes/stats/summary', async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments({});
    const activeRoutes = await Route.countDocuments({ status: 'active' });
    const inactiveRoutes = await Route.countDocuments({ status: 'inactive' });
    
    // Get recent routes (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRoutes = await Route.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get routes by month (for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const routes = await Route.find({
      createdAt: { $gte: sixMonthsAgo }
    }).select('createdAt');
    
    const monthlyStats = {};
    routes.forEach(route => {
      const monthKey = route.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: {
        total: totalRoutes,
        active: activeRoutes,
        inactive: inactiveRoutes,
        recent: recentRoutes,
        typeStats: {}, // Not used in current schema
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching route statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route statistics',
      error: error.message
    });
  }
});

// Bulk operations for routes
router.post('/routes/bulk', async (req, res) => {
  try {
    const { operation, routeIds, data } = req.body;
    
    if (!operation || !routeIds || !Array.isArray(routeIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation and routeIds array are required'
      });
    }
    
    let updatedRoutes = [];
    let deletedCount = 0;
    
    switch (operation) {
      case 'delete':
        // Bulk delete
        const deleteResult = await Route.deleteMany({ _id: { $in: routeIds } });
        deletedCount = deleteResult.deletedCount;
        break;
        
      case 'updateStatus':
        // Bulk status update
        if (!data || !data.status) {
          return res.status(400).json({
            success: false,
            message: 'Status is required for updateStatus operation'
          });
        }
        
        await Route.updateMany(
          { _id: { $in: routeIds } },
          { $set: { status: data.status } }
        );
        
        const updatedStatusRoutes = await Route.find({ _id: { $in: routeIds } });
        updatedRoutes = updatedStatusRoutes.map(formatRoute);
        break;
        
      case 'updateType':
        // Bulk type update (if type field exists in future)
        if (!data || !data.type) {
          return res.status(400).json({
            success: false,
            message: 'Type is required for updateType operation'
          });
        }
        
        await Route.updateMany(
          { _id: { $in: routeIds } },
          { $set: { type: data.type } }
        );
        
        const updatedTypeRoutes = await Route.find({ _id: { $in: routeIds } });
        updatedRoutes = updatedTypeRoutes.map(formatRoute);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Supported operations: delete, updateStatus, updateType'
        });
    }
    
    res.json({
      success: true,
      message: `Bulk ${operation} operation completed successfully`,
      data: {
        processedCount: routeIds.length,
        deletedCount: operation === 'delete' ? deletedCount : undefined,
        updatedRoutes: updatedRoutes.length > 0 ? updatedRoutes : undefined
      }
    });
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation',
      error: error.message
    });
  }
});

// Seed default routes (optional endpoint for initial setup)
router.post('/routes/seed', async (req, res) => {
  try {
    const existingCount = await Route.countDocuments({});
    
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Routes already exist in database. Skipping seed.',
        existingCount
      });
    }
    
    const seededRoutes = await Route.insertMany(defaultRoutes);
    
    res.json({
      success: true,
      message: `Successfully seeded ${seededRoutes.length} default routes`,
      count: seededRoutes.length
    });
  } catch (error) {
    console.error('Error seeding routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed routes',
      error: error.message
    });
  }
});

module.exports = router;
