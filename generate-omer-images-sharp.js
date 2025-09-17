#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  OUTPUT_DIR: './generated-omer-images',
  PICTURES_DIR: './pictures',
  SENTENCES_FILE: './sentences_of_shaul.json',
  IMAGE_WIDTH: 1080,
  IMAGE_HEIGHT: 1080,
  TEXT_COLOR: 'white',
  OVERLAY_COLOR: 'rgba(0, 0, 0, 0.6)',
  FONT_SIZE_LARGE: 48,
  FONT_SIZE_MEDIUM: 32,
  FONT_SIZE_SMALL: 24
};

// Omer days data (simplified)
const OMER_DAYS = [
  { day: 1, omer: 'הַיּוֹם יוֹם אֶחָד לָעֹמֶר' },
  { day: 2, omer: 'הַיּוֹם שְׁנֵי יָמִים לָעֹמֶר' },
  { day: 3, omer: 'הַיּוֹם שְלֹשָה יָמִים לָעֹמֶר' },
  { day: 4, omer: 'הַיּוֹם אַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 5, omer: 'הַיּוֹם חֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 6, omer: 'הַיוֹם שִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 7, omer: 'הַיּוֹם שִׁבְעָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד לָעֹמֶר' },
  { day: 8, omer: 'הַיּוֹם שְׁמוֹנָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 9, omer: 'הַיּוֹם תִּשְׁעָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 10, omer: 'הַיּוֹם עֲשָׂרָה יָמִים שֶׁהֵם שָׁבוּעַ אֶחָד וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 11, omer: 'הַיּוֹם אַחַד עָשָׂר יוֹם שֶׁהֵם שָׁבוּעַ אֶחָד וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 12, omer: 'הַיּוֹם שְׁנֵים עָשָׂר יוֹם שֶׁהֵם שָׁבוּעַ אֶחָד וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 13, omer: 'הַיּוֹם שְׁלֹשָׁה עָשָׂר יוֹם שֶׁהֵם שָׁבוּעַ אֶחָד וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 14, omer: 'הַיּוֹם אַרְבָּעָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת לָעֹמֶר' },
  { day: 15, omer: 'הַיּוֹם חֲמִשָּׁה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 16, omer: 'הַיּוֹם שִׁשָּׁה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 17, omer: 'הַיּוֹם שִׁבְעָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 18, omer: 'הַיּוֹם שְׁמוֹנָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 19, omer: 'הַיּוֹם תִּשְׁעָה עָשָׂר יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 20, omer: 'הַיּוֹם עֶשְׂרִים יוֹם שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 21, omer: 'הַיּוֹם אֶחָד וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 22, omer: 'הַיּוֹם שְׁנַיִם וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 23, omer: 'הַיּוֹם שְׁלֹשָׁה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 24, omer: 'הַיּוֹם אַרְבָּעָה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 25, omer: 'הַיּוֹם חֲמִשָּׁה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 26, omer: 'הַיּוֹם שִׁשָּׁה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 27, omer: 'הַיּוֹם שִׁבְעָה וְעֶשְׂרִים יוֹם שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 28, omer: 'הַיּוֹם שְׁמוֹנָה וְעֶשְׂרִים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 29, omer: 'הַיּוֹם תִּשְׁעָה וְעֶשְׂרִים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 30, omer: 'הַיּוֹם שְׁלשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 31, omer: 'הַיּוֹם אֶחָד וּשְׁלשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 32, omer: 'הַיּוֹם שְׁנַיִם וּשְׁלשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 33, omer: 'הַיּוֹם שְׁלֹשָה וּשְׁלשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 34, omer: 'הַיּוֹם אַרְבָּעָה וּשְׁלשִׁים יוֹם שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 35, omer: 'הַיּוֹם חֲמִשָּׁה וּשְׁלשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 36, omer: 'הַיּוֹם שִׁשָּׁה וּשְׁלשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 37, omer: 'הַיּוֹם שִׁבְעָה וּשְׁלשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 38, omer: 'הַיּוֹם שְׁמוֹנָה וּשְׁלשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 39, omer: 'הַיּוֹם תִּשְׁעָה וּשְׁלשִׁים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 40, omer: 'הַיּוֹם אַרְבָּעִים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 41, omer: 'הַיּוֹם אֶחָד וְאַרְבָּעִים יוֹם שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 42, omer: 'הַיּוֹם שְׁנַיִם וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 43, omer: 'הַיּוֹם שְׁלֹשָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 44, omer: 'הַיּוֹם אַרְבָּעָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 45, omer: 'הַיּוֹם חֲמִשָּׁה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 46, omer: 'הַיּוֹם שִׁשָּׁה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 47, omer: 'הַיּוֹם שִׁבְעָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 48, omer: 'הַיּוֹם שְׁמוֹנָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 49, omer: 'הַיּוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם שֶׁהֵם שִׁבְעָה שָׁבוּעוֹת שַׁלמֵי לָעֹמֶר' }
];

/**
 * Pseudo-random function that's consistent for the same seed
 */
function getPseudoRandomIndex(seed, arrayLength) {
  let hash = seed;
  hash = ((hash << 5) - hash + seed) & 0xffffffff;
  hash = ((hash << 5) - hash + 42) & 0xffffffff;
  return Math.abs(hash) % arrayLength;
}

/**
 * Load sentences from JSON file
 */
function loadSentences() {
  try {
    const data = fs.readFileSync(CONFIG.SENTENCES_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.paragraphs || [];
  } catch (error) {
    console.error('Error loading sentences:', error);
    return [];
  }
}

/**
 * Get all image files from pictures directory
 */
function getAllImages() {
  try {
    const files = fs.readdirSync(CONFIG.PICTURES_DIR);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });
  } catch (error) {
    console.error('Error reading pictures directory:', error);
    return [];
  }
}

/**
 * Create SVG text overlay
 */
function createTextOverlay(omerDay, omerText, quote) {
  const svgWidth = CONFIG.IMAGE_WIDTH;
  const svgHeight = CONFIG.IMAGE_HEIGHT;
  
  // Break long text into multiple lines
  const maxCharsPerLine = 30;
  const omerLines = omerText.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')) || [omerText];
  const quoteLines = quote.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g')) || [quote];
  
  const svg = `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <!-- Semi-transparent overlay -->
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.6)"/>
      
      <!-- App title -->
      <text x="50%" y="60" text-anchor="middle" 
            fill="white" font-size="28" font-family="Arial" font-weight="bold"
            stroke="black" stroke-width="2">
        סופרים וזוכרים
      </text>
      
      <!-- Day number -->
      <text x="50%" y="120" text-anchor="middle" 
            fill="white" font-size="32" font-family="Arial" font-weight="bold"
            stroke="black" stroke-width="2">
        יום ${omerDay}
      </text>
      
      <!-- Omer text -->
      ${omerLines.map((line, index) => `
        <text x="50%" y="${180 + (index * 50)}" text-anchor="middle" 
              fill="white" font-size="42" font-family="Arial" font-weight="bold"
              stroke="black" stroke-width="3">
          ${line.trim()}
        </text>
      `).join('')}
      
      <!-- Quote -->
      ${quoteLines.map((line, index) => `
        <text x="50%" y="${svgHeight - 200 + (index * 40)}" text-anchor="middle" 
              fill="white" font-size="28" font-family="Arial"
              stroke="black" stroke-width="2">
          ${line.trim()}
        </text>
      `).join('')}
      
      <!-- Attribution -->
      <text x="50%" y="${svgHeight - 60}" text-anchor="middle" 
            fill="white" font-size="24" font-family="Arial" font-style="italic"
            stroke="black" stroke-width="2">
        - שאול
      </text>
    </svg>
  `;
  
  return Buffer.from(svg);
}

/**
 * Generate a single Omer image using Sharp
 */
async function generateOmerImage(omerDay, imagePath, quote, outputPath) {
  try {
    console.log(`Generating image for day ${omerDay}...`);
    
    const omerData = OMER_DAYS[omerDay - 1];
    const omerText = omerData.omer;
    
    // Create text overlay SVG
    const textOverlay = createTextOverlay(omerDay, omerText, quote);
    
    // Process image with Sharp
    await sharp(imagePath)
      .resize(CONFIG.IMAGE_WIDTH, CONFIG.IMAGE_HEIGHT, { 
        fit: 'cover',
        position: 'center'
      })
      .composite([{
        input: textOverlay,
        top: 0,
        left: 0
      }])
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    
    console.log(`✓ Generated: ${outputPath}`);
    
  } catch (error) {
    console.error(`Error generating image for day ${omerDay}:`, error);
  }
}

/**
 * Main function to generate all Omer images
 */
async function generateAllOmerImages() {
  console.log('🎨 Starting Omer image generation with Sharp...');
  
  // Create output directory
  if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
  }
  
  // Load data
  const sentences = loadSentences();
  const images = getAllImages();
  
  if (sentences.length === 0) {
    console.error('❌ No sentences found!');
    return;
  }
  
  if (images.length === 0) {
    console.error('❌ No images found!');
    return;
  }
  
  console.log(`📚 Loaded ${sentences.length} sentences`);
  console.log(`🖼️  Found ${images.length} images`);
  
  // Generate images for all 49 days
  for (let day = 1; day <= 49; day++) {
    const dayIndex = day - 1;
    
    // Get pseudo-random image and quote for this day
    const imageIndex = getPseudoRandomIndex(dayIndex, images.length);
    const quoteIndex = getPseudoRandomIndex(dayIndex + 17, sentences.length);
    
    const imagePath = path.join(CONFIG.PICTURES_DIR, images[imageIndex]);
    const quote = sentences[quoteIndex];
    const outputPath = path.join(CONFIG.OUTPUT_DIR, `omer-day-${day.toString().padStart(2, '0')}.jpg`);
    
    await generateOmerImage(day, imagePath, quote, outputPath);
  }
  
  console.log('🎉 All Omer images generated successfully!');
  console.log(`📁 Images saved to: ${CONFIG.OUTPUT_DIR}`);
}

// Run the script
if (require.main === module) {
  generateAllOmerImages().catch(console.error);
}

module.exports = {
  generateAllOmerImages,
  generateOmerImage,
  CONFIG
};
