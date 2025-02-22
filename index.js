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
const { default: axios } = require('axios');
 const cheerio = require("cheerio");
 const { Configuration, OpenAIApi, default: OpenAI } = require('openai');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


// Initialize OpenAI
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// });
// const openai = new OpenAIApi(configuration);
const RSS_FEEDS = [
  "https://www.prothomalo.com/feed",
  "https://feeds.bbci.co.uk/news/rss.xml",
  "https://www.kalerkantho.com/rss.xml",
  "https://www.jagonews24.com/rss/rss.xml",
  "https://www.jugantor.com/feed/rss.xml",
  "https://www.banglanews24.com/rss/rss.xml",
  "https://bdnews24.com/?widgetName=rssfeed&widgetId=1150&getXmlFeed=true",
  "http://www.bd24live.com/feed",
  "https://www.thedailystar.net/frontpage/rss.xml",
];
const openai = new OpenAI({ apiKey: "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"});
// AI-enhanced content processing
async function enhanceContentWithAI(content) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "You are a helpful assistant that enhances news content."
      }, {
        role: "user",
        content: `Analyze this news content and provide: 
          1. A concise summary (max 2 sentences)
          2. Key topics/tags (max 5)
          3. Category classification
          4. Importance score (1-10)
          Content: ${content}`
      }]
    });

    const aiResponse = completion.data.choices[0].message.content;
    const parsed = parseAIResponse(aiResponse);
    return parsed;
  } catch (error) {
    console.error('Error in AI processing:', error);
    return null;
  }
}

// Parse AI response into structured data
function parseAIResponse(aiResponse) {
  // Add basic error handling
  try {
    const lines = aiResponse.split('\n');
    return {
      summary: lines[0].replace('Summary: ', ''),
      tags: lines[1].replace('Tags: ', '').split(', '),
      category: lines[2].replace('Category: ', ''),
      importance: parseInt(lines[3].replace('Importance: ', ''))
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return null;
  }
}

// Enhanced image processing with AI
async function enhanceImageProcessing(imageUrl) {
  if (!imageUrl) return null;
  
  try {
    const response = await openai.createImageAnalysis({
      image: imageUrl,
      prompt: "Analyze this news image for quality and relevance"
    });
    
    return {
      originalUrl: imageUrl,
      quality: response.data.quality_score,
      isRelevant: response.data.relevance_score > 0.7,
      alternativeText: response.data.description
    };
  } catch (error) {
    console.error('Error in image analysis:', error);
    return { originalUrl: imageUrl };
  }
}

// Enhanced RSS feed fetcher
const fetchRSSFeeds = async () => {
  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      for (const item of feed.items) {
        const slug = item.title.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');

        // Check for existing news
        const existingNews = await prisma.news.findUnique({ where: { slug } });
        
        if (!existingNews) {
          // Get image URL
          let imageUrl = item.enclosure?.url || item["media:content"]?.url || null;
          if (!imageUrl) {
            imageUrl = await fetchOGImage(item.link);
          }

          // Enhanced image processing
          const imageAnalysis = await enhanceImageProcessing(imageUrl);

          // AI content enhancement
          const aiEnhancements = await enhanceContentWithAI(
            item.content || item.description || item.title
          );

          // Create news with enhanced data
          await prisma.news.create({
            data: {
              title: item.title,
              shortDescription: aiEnhancements?.summary || item.contentSnippet || item.summary || null,
              description: item.content || item.description || null,
              slug,
              tags: aiEnhancements?.tags || [],
              category: aiEnhancements?.category || 'uncategorized',
              importance: aiEnhancements?.importance || 5,
              isBreakingNews: aiEnhancements?.importance >= 8,
              thumbnailUrl: imageAnalysis?.originalUrl || null,
              type: "rss",
              newsUrl: item.link,
              isExternalNews: true,
              imageUrl: imageAnalysis?.originalUrl || null,
              imageQuality: imageAnalysis?.quality || null,
              imageAltText: imageAnalysis?.alternativeText || null,
              hasVideo: false,
              authorName: item.creator || item.author || null,
              publishedAt: new Date(item.pubDate || Date.now()),
              // Add AI-generated fields
              aiSummary: aiEnhancements?.summary || null,
              aiCategory: aiEnhancements?.category || null,
              aiImportanceScore: aiEnhancements?.importance || null,
              lastProcessed: new Date(),
            },
          });

          console.log(`✅ Saved with AI enhancements: ${item.title}`);
        } else {
          console.log(`⚠️ Already Exists: ${item.title}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing feed ${feedUrl}:`, error);
    }
  }
};

// Periodic content refresh and update
async function updateExistingContent() {
  const oldNews = await prisma.news.findMany({
    where: {
      lastProcessed: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });

  for (const news of oldNews) {
    const aiEnhancements = await enhanceContentWithAI(news.description);
    if (aiEnhancements) {
      await prisma.news.update({
        where: { id: news.id },
        data: {
          aiSummary: aiEnhancements.summary,
          tags: aiEnhancements.tags,
          category: aiEnhancements.category,
          importance: aiEnhancements.importance,
          lastProcessed: new Date()
        }
      });
    }
  }
}

// Schedule periodic updates
setInterval(fetchRSSFeeds, 30 * 60 * 1000); // Every 30 minutes
setInterval(updateExistingContent, 24 * 60 * 60 * 1000); // Daily updates

// Initial run
fetchRSSFeeds();










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