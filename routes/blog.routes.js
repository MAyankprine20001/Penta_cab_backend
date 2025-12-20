const express = require('express');
const router = express.Router();
const { Blog } = require('../model');

// Default blogs data for seeding (if database is empty)
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

// Helper function to convert MongoDB document to API format
const formatBlog = (blog) => {
  if (!blog) return null;
  return {
    id: blog._id.toString(),
    title: blog.title,
    content: blog.content,
    excerpt: blog.excerpt || '',
    author: blog.author || 'Admin',
    status: blog.status || 'draft',
    tags: blog.tags || [],
    publishedAt: blog.publishedAt || null,
    createdAt: blog.createdAt ? blog.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: blog.updatedAt ? blog.updatedAt.toISOString() : new Date().toISOString()
  };
};

// Get all blogs with enhanced pagination
router.get('/blogs', async (req, res) => {
  try {
    const { 
      status, 
      search, 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      author 
    } = req.query;
    
    // Build query
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by author
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }
    
    // Search functionality
    if (search) {
      const searchTerm = search.toLowerCase();
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { excerpt: { $regex: searchTerm, $options: 'i' } },
        { content: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    // Build sort object
    const sortObj = {};
    const sortField = sortBy === 'createdAt' ? 'createdAt' : 
                     sortBy === 'updatedAt' ? 'updatedAt' :
                     sortBy === 'publishedAt' ? 'publishedAt' :
                     sortBy;
    sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;
    
    // Get total count
    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);
    
    // Fetch blogs
    const blogs = await Blog.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);
    
    // Format blogs for API response
    const formattedBlogs = blogs.map(formatBlog);
    
    // Calculate pagination metadata
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    const nextPage = hasNextPage ? pageNum + 1 : null;
    const prevPage = hasPrevPage ? pageNum - 1 : null;
    
    // Count blogs by status
    const statusCounts = {
      total: await Blog.countDocuments({}),
      published: await Blog.countDocuments({ status: 'published' }),
      draft: await Blog.countDocuments({ status: 'draft' })
    };
    
    res.json({
      success: true,
      data: formattedBlogs,
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
        author: author || '',
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// Get single blog by ID
router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      data: formatBlog(blog)
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

// Create new blog
router.post('/blogs', async (req, res) => {
  try {
    const { title, content, excerpt, author, status, tags } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }
    
    const newBlog = new Blog({
      title,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      author: author || 'Admin',
      status: status || 'draft',
      tags: tags || [],
      publishedAt: status === 'published' ? new Date().toISOString().split('T')[0] : null
    });
    
    await newBlog.save();
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: formatBlog(newBlog)
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
});

// Update blog
router.put('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, author, status, tags } = req.body;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Update blog fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (author) blog.author = author;
    if (status) blog.status = status;
    if (tags !== undefined) blog.tags = tags;
    
    // Update publishedAt if status changed to published
    if (status === 'published' && blog.status !== 'published') {
      blog.publishedAt = new Date().toISOString().split('T')[0];
    }
    
    await blog.save();
    
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: formatBlog(blog)
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
});

// Delete blog
router.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
});

// Toggle blog status (publish/unpublish)
router.patch('/blogs/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['published', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (published/draft) is required'
      });
    }
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    blog.status = status;
    if (status === 'published' && !blog.publishedAt) {
      blog.publishedAt = new Date().toISOString().split('T')[0];
    }
    
    await blog.save();
    
    res.json({
      success: true,
      message: `Blog post ${status === 'published' ? 'published' : 'unpublished'} successfully`,
      data: formatBlog(blog)
    });
  } catch (error) {
    console.error('Error toggling blog status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog status',
      error: error.message
    });
  }
});

// Get blog statistics
router.get('/blogs/stats/summary', async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments({});
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    
    // Get recent blogs (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBlogs = await Blog.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    // Get blogs by author
    const blogs = await Blog.find({}).select('author');
    const authorStats = {};
    blogs.forEach(blog => {
      authorStats[blog.author] = (authorStats[blog.author] || 0) + 1;
    });
    
    // Get blogs by month (for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyBlogs = await Blog.find({
      createdAt: { $gte: sixMonthsAgo }
    }).select('createdAt');
    
    const monthlyStats = {};
    monthlyBlogs.forEach(blog => {
      const monthKey = blog.createdAt.toISOString().slice(0, 7); // YYYY-MM format
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
    });
    
    res.json({
      success: true,
      data: {
        total: totalBlogs,
        published: publishedBlogs,
        draft: draftBlogs,
        recent: recentBlogs,
        authorStats,
        monthlyStats
      }
    });
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog statistics',
      error: error.message
    });
  }
});

// Bulk operations for blogs
router.post('/blogs/bulk', async (req, res) => {
  try {
    const { operation, blogIds, data } = req.body;
    
    if (!operation || !blogIds || !Array.isArray(blogIds)) {
      return res.status(400).json({
        success: false,
        message: 'Operation and blogIds array are required'
      });
    }
    
    let updatedBlogs = [];
    let deletedCount = 0;
    
    switch (operation) {
      case 'delete':
        // Bulk delete
        const deleteResult = await Blog.deleteMany({ _id: { $in: blogIds } });
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
        
        const updateData = { status: data.status };
        if (data.status === 'published') {
          updateData.publishedAt = new Date().toISOString().split('T')[0];
        }
        
        await Blog.updateMany(
          { _id: { $in: blogIds } },
          { $set: updateData }
        );
        
        const updatedStatusBlogs = await Blog.find({ _id: { $in: blogIds } });
        updatedBlogs = updatedStatusBlogs.map(formatBlog);
        break;
        
      case 'updateAuthor':
        // Bulk author update
        if (!data || !data.author) {
          return res.status(400).json({
            success: false,
            message: 'Author is required for updateAuthor operation'
          });
        }
        
        await Blog.updateMany(
          { _id: { $in: blogIds } },
          { $set: { author: data.author } }
        );
        
        const updatedAuthorBlogs = await Blog.find({ _id: { $in: blogIds } });
        updatedBlogs = updatedAuthorBlogs.map(formatBlog);
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Supported operations: delete, updateStatus, updateAuthor'
        });
    }
    
    res.json({
      success: true,
      message: `Bulk ${operation} operation completed successfully`,
      data: {
        processedCount: blogIds.length,
        deletedCount: operation === 'delete' ? deletedCount : undefined,
        updatedBlogs: updatedBlogs.length > 0 ? updatedBlogs : undefined
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

// Seed default blogs (optional endpoint for initial setup)
router.post('/blogs/seed', async (req, res) => {
  try {
    const existingCount = await Blog.countDocuments({});
    
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Blogs already exist in database. Skipping seed.',
        existingCount
      });
    }
    
    const seededBlogs = await Blog.insertMany(defaultBlogs);
    
    res.json({
      success: true,
      message: `Successfully seeded ${seededBlogs.length} default blogs`,
      count: seededBlogs.length
    });
  } catch (error) {
    console.error('Error seeding blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed blogs',
      error: error.message
    });
  }
});

module.exports = router;
