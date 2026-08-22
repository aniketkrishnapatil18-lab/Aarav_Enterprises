const axios = require('axios');

async function extractSearchKeywords(rawQuery) {
  // If the query is short, assume it's already concise
  if (rawQuery.split(' ').length <= 4) {
    return rawQuery;
  }
  
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  if (!provider) return rawQuery; // Fallback

  try {
    const prompt = `Extract exactly 2-4 primary keywords for an image search from this requirement: "${rawQuery}". Return ONLY the keywords, no quotes, no extra text.`;
    
    if (provider === 'openai' && process.env.AI_API_KEY) {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: process.env.AI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
          max_tokens: 15,
        },
        {
          headers: { 'Authorization': `Bearer ${process.env.AI_API_KEY}` },
          timeout: 5000,
        }
      );
      return response.data.choices[0].message.content.trim();
    } 
    
    if (provider === 'gemini' && process.env.AI_API_KEY) {
      const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.AI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 15 },
        },
        { timeout: 5000 }
      );
      return response.data.candidates[0].content.parts[0].text.trim();
    }
  } catch (err) {
    console.error('[Unsplash] AI keyword extraction failed, falling back to raw query.', err.message);
  }
  
  return rawQuery;
}

exports.searchImages = async (req, res) => {
  try {
    const { query, page = 1, per_page = 20, orientation } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.error('[Unsplash] Missing UNSPLASH_ACCESS_KEY');
      return res.status(500).json({ success: false, message: 'Unsplash API key is not configured.' });
    }

    // Convert long requirement to concise keywords
    const searchTerms = await extractSearchKeywords(query);

    const params = {
      query: searchTerms,
      page,
      per_page,
    };
    if (orientation) params.orientation = orientation;

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params,
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'Accept-Version': 'v1'
      },
      timeout: 10000
    });

    const data = response.data;
    
    // Normalize response
    const normalizedData = data.results.map(img => ({
      id: img.id,
      url: img.urls.regular,
      thumbnailUrl: img.urls.small,
      alt: img.alt_description || img.description || 'Unsplash image',
      width: img.width,
      height: img.height,
      photographerName: img.user.name,
      photographerUrl: `${img.user.links.html}?utm_source=aarav_enterprises&utm_medium=referral`,
      unsplashUrl: `${img.links.html}?utm_source=aarav_enterprises&utm_medium=referral`
    }));

    res.json({
      success: true,
      data: normalizedData,
      total: data.total,
      totalPages: data.total_pages,
      searchTerms // pass it back to let frontend know what was searched
    });

  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 401 || status === 403) {
        return res.status(401).json({ success: false, message: 'Unauthorized access to Unsplash.' });
      }
      if (status === 429) {
        return res.status(429).json({ success: false, message: 'Unsplash rate limit exceeded. Please try again later.' });
      }
    }
    console.error('[Unsplash] Search error:', err.message);
    res.status(500).json({ success: false, message: 'Unable to load images right now. Please try again.' });
  }
};
