const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const router = require('./src/routes');
const swaggerSpec = require('./src/config/swaggerConfig');
const app = express();
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();
const RSSParser = require('rss-parser');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.set('trust proxy', true);
// Routes
app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  if (res && !res.headersSent) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  }
});

const parser = new RSSParser();


const RSS_FEEDS = [
  'https://www.prothomalo.com/feed',
  // 'https://rss.cnn.com/rss/edition.rss',
  'https://feeds.bbci.co.uk/news/rss.xml',
  'https://www.kalerkantho.com/rss.xml',
  'https://www.jagonews24.com/rss/rss.xml',
  'https://www.jugantor.com/feed/rss.xml',
  'https://www.banglanews24.com/rss/rss.xml',
  'https://bdnews24.com/?widgetName=rssfeed&widgetId=1150&getXmlFeed=true',
  '	http://www.bd24live.com/feed',
  'https://www.thedailystar.net/frontpage/rss.xml'

];
const fetchRSSFeeds = async () => {
  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items) {
        // Generate a unique slug from title
        const slug = item.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Check if news already exists
        const existingNews = await prisma.news.findUnique({
          where: { slug },
        });

        if (!existingNews) {
          await prisma.news.create({
            data: {
              title: item.title,
              shortDescription: item.contentSnippet || item.summary || null,
              description: item.content || item.description || null,
              slug,
              tags: [],
              isBreakingNews: false,
              thumbnailUrl: item.enclosure?.url || null,
              type: 'rss',
              newsUrl: item.link,
              isExternalNews: true,
              imageUrl: item.enclosure?.url || null,
              hasVideo: false,
              authorName: item.creator || item.author || null,
              publishedAt: new Date(item.pubDate || Date.now()),
            },
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching RSS feed from ${feedUrl}:`, error);
    }
  }
};

// ✅ Call function AFTER defining it
// fetchRSSFeeds(); 


// Database connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    // Start the server only after database connection
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
})();