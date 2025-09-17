#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Configuration
const CONFIG = {
  OUTPUT_DIR: './generated-omer-images',
  PICTURES_DIR: './pictures',
  SENTENCES_FILE: './sentences_of_shaul.json',
  CANVAS_WIDTH: 1080,
  CANVAS_HEIGHT: 1080,
  OVERLAY_OPACITY: 0.7,
  FONT_SIZE_OMER: 48,
  FONT_SIZE_QUOTE: 32,
  FONT_SIZE_DAY: 24,
  TEXT_COLOR: '#FFFFFF',
  OVERLAY_COLOR: 'rgba(0, 0, 0, 0.6)',
  MARGIN: 40,
  LINE_HEIGHT_MULTIPLIER: 1.2
};

// Omer days data (simplified version from constants.ts)
const OMER_DAYS = [
  { day: 1, omer: 'הַיּוֹם יוֹם אֶחָד לָעֹמֶר', shem: '' },
  { day: 2, omer: 'הַיּוֹם שְׁנֵי יָמִים לָעֹמֶר', shem: '' },
  { day: 3, omer: 'הַיּוֹם שְלֹשָה יָמִים לָעֹמֶר', shem: '' },
  { day: 4, omer: 'הַיּוֹם אַרְבָּעָה יָמִים לָעֹמֶר', shem: '' },
  { day: 5, omer: 'הַיּוֹם חֲמִשָּׁה יָמִים לָעֹמֶר', shem: '' },
  { day: 6, omer: 'הַיוֹם שִׁשָּׁה יָמִים לָעֹמֶר', shem: '' },
  { day: 7, omer: 'הַיּוֹם שִׁבְעָה יָמִים', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד לָעֹמֶר' },
  { day: 8, omer: 'הַיּוֹם שְׁמוֹנָה יָמִים', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 9, omer: 'הַיּוֹם תִּשְׁעָה יָמִים', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 10, omer: 'הַיּוֹם עֲשָׂרָה יָמִים', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד וּשְלֹשָה יָמִים לָעֹמֶר' },
  { day: 11, omer: 'הַיּוֹם אַחַד עָשָׂר יוֹם', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 12, omer: 'הַיּוֹם שְׁנֵים עָשָׂר יוֹם', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 13, omer: 'הַיּוֹם שְׁלֹשָׁה עָשָׂר יוֹם', shem: 'שֶׁהֵם שָׁבוּעַ אֶחָד וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 14, omer: 'הַיּוֹם אַרְבָּעָה עָשָׂר יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת לָעֹמֶר' },
  { day: 15, omer: 'הַיּוֹם חֲמִשָּׁה עָשָׂר יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 16, omer: 'הַיּוֹם שִׁשָּׁה עָשָׂר יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 17, omer: 'הַיּוֹם שִׁבְעָה עָשָׂר יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וּשְלֹשָה יָמִים לָעֹמֶר' },
  { day: 18, omer: 'הַיּוֹם שְׁמוֹנָה עָשָׂר יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 19, omer: 'הַיּוֹם תִּשְׁעָה עָשָׂר יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 20, omer: 'הַיּוֹם עֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁנֵי שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 21, omer: 'הַיּוֹם אֶחָד וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 22, omer: 'הַיּוֹם שְׁנַיִם וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 23, omer: 'הַיּוֹם שְׁלֹשָׁה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 24, omer: 'הַיּוֹם אַרְבָּעָה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 25, omer: 'הַיּוֹם חֲמִשָּׁה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 26, omer: 'הַיּוֹם שִׁשָּׁה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 27, omer: 'הַיּוֹם שִׁבְעָה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם שְׁלֹשָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 28, omer: 'הַיּוֹם שְׁמוֹנָה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 29, omer: 'הַיּוֹם תִּשְׁעָה וְעֶשְׂרִים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 30, omer: 'הַיּוֹם שְׁלשִׁים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 31, omer: 'הַיּוֹם אֶחָד וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 32, omer: 'הַיּוֹם שְׁנַיִם וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 33, omer: 'הַיּוֹם שְׁלֹשָה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 34, omer: 'הַיּוֹם אַרְבָּעָה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם אַרְבָּעָה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 35, omer: 'הַיּוֹם חֲמִשָּׁה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 36, omer: 'הַיּוֹם שִׁשָּׁה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 37, omer: 'הַיּוֹם שִׁבְעָה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 38, omer: 'הַיּוֹם שְׁמוֹנָה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 39, omer: 'הַיּוֹם תִּשְׁעָה וּשְׁלשִׁים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 40, omer: 'הַיּוֹם אַרְבָּעִים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 41, omer: 'הַיּוֹם אֶחָד וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם חֲמִשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 42, omer: 'הַיּוֹם שְׁנַיִם וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת לָעֹמֶר' },
  { day: 43, omer: 'הַיּוֹם שְׁלֹשָה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְיוֹם אֶחָד לָעֹמֶר' },
  { day: 44, omer: 'הַיּוֹם אַרְבָּעָה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁנֵי יָמִים לָעֹמֶר' },
  { day: 45, omer: 'הַיּוֹם חֲמִשָּׁה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וּשְׁלֹשָה יָמִים לָעֹמֶר' },
  { day: 46, omer: 'הַיּוֹם שִׁשָּׁה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְאַרְבָּעָה יָמִים לָעֹמֶר' },
  { day: 47, omer: 'הַיּוֹם שִׁבְעָה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וַחֲמִשָּׁה יָמִים לָעֹמֶר' },
  { day: 48, omer: 'הַיּוֹם שְׁמוֹנָה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁשָּׁה שָׁבוּעוֹת וְשִׁשָּׁה יָמִים לָעֹמֶר' },
  { day: 49, omer: 'הַיּוֹם תִּשְׁעָה וְאַרְבָּעִים יוֹם', shem: 'שֶׁהֵם שִׁבְעָה שָׁבוּעוֹת שַׁלמֵי לָעֹמֶר' }
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
 * Wrap text to fit within specified width
 */
function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Draw text with outline for better visibility
 */
function drawTextWithOutline(ctx, text, x, y, fillColor = CONFIG.TEXT_COLOR, strokeColor = '#000000', strokeWidth = 3) {
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.strokeText(text, x, y);
  
  ctx.fillStyle = fillColor;
  ctx.fillText(text, x, y);
}

/**
 * Generate a single Omer image
 */
async function generateOmerImage(omerDay, imagePath, quote, outputPath) {
  try {
    console.log(`Generating image for day ${omerDay}...`);
    
    // Load the background image
    const image = await loadImage(imagePath);
    
    // Create canvas
    const canvas = createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    const ctx = canvas.getContext('2d');
    
    // Calculate dimensions to fit image while maintaining aspect ratio
    const imageAspect = image.width / image.height;
    const canvasAspect = CONFIG.CANVAS_WIDTH / CONFIG.CANVAS_HEIGHT;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      drawHeight = CONFIG.CANVAS_HEIGHT;
      drawWidth = drawHeight * imageAspect;
      drawX = (CONFIG.CANVAS_WIDTH - drawWidth) / 2;
      drawY = 0;
    } else {
      // Image is taller than canvas
      drawWidth = CONFIG.CANVAS_WIDTH;
      drawHeight = drawWidth / imageAspect;
      drawX = 0;
      drawY = (CONFIG.CANVAS_HEIGHT - drawHeight) / 2;
    }
    
    // Draw background image
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    
    // Add semi-transparent overlay
    ctx.fillStyle = CONFIG.OVERLAY_COLOR;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
    
    // Set up text rendering
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Get Omer data
    const omerData = OMER_DAYS[omerDay - 1];
    const omerText = omerData.omer + (omerData.shem ? ' ' + omerData.shem : '');
    
    // Draw day number
    ctx.font = `bold ${CONFIG.FONT_SIZE_DAY}px Arial`;
    const dayText = `יום ${omerDay}`;
    drawTextWithOutline(ctx, dayText, CONFIG.CANVAS_WIDTH / 2, CONFIG.MARGIN + 30);
    
    // Draw Omer text
    ctx.font = `bold ${CONFIG.FONT_SIZE_OMER}px Arial`;
    const omerLines = wrapText(ctx, omerText, CONFIG.CANVAS_WIDTH - (CONFIG.MARGIN * 2));
    const omerStartY = CONFIG.CANVAS_HEIGHT * 0.15;
    
    omerLines.forEach((line, index) => {
      const y = omerStartY + (index * CONFIG.FONT_SIZE_OMER * CONFIG.LINE_HEIGHT_MULTIPLIER);
      drawTextWithOutline(ctx, line, CONFIG.CANVAS_WIDTH / 2, y);
    });
    
    // Draw quote from Shaul
    ctx.font = `${CONFIG.FONT_SIZE_QUOTE}px Arial`;
    const maxQuoteWidth = CONFIG.CANVAS_WIDTH - (CONFIG.MARGIN * 2);
    const quoteLines = wrapText(ctx, quote, maxQuoteWidth);
    
    const quoteStartY = CONFIG.CANVAS_HEIGHT * 0.7;
    quoteLines.forEach((line, index) => {
      const y = quoteStartY + (index * CONFIG.FONT_SIZE_QUOTE * CONFIG.LINE_HEIGHT_MULTIPLIER);
      drawTextWithOutline(ctx, line, CONFIG.CANVAS_WIDTH / 2, y);
    });
    
    // Draw attribution
    ctx.font = `italic ${CONFIG.FONT_SIZE_DAY}px Arial`;
    drawTextWithOutline(ctx, '- שאול', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - CONFIG.MARGIN);
    
    // Draw app title
    ctx.font = `bold ${CONFIG.FONT_SIZE_DAY}px Arial`;
    drawTextWithOutline(ctx, 'סופרים וזוכרים', CONFIG.CANVAS_WIDTH / 2, CONFIG.MARGIN);
    
    // Save the image
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✓ Generated: ${outputPath}`);
    
  } catch (error) {
    console.error(`Error generating image for day ${omerDay}:`, error);
  }
}

/**
 * Main function to generate all Omer images
 */
async function generateAllOmerImages() {
  console.log('🎨 Starting Omer image generation...');
  
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
