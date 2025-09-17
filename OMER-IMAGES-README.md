# Omer Daily Images Generator

This tool generates 49 unique daily images for the Omer period, each featuring:
- A randomly selected background image from your pictures collection
- A randomly selected quote from Shaul
- The daily Omer counting text in Hebrew
- Beautiful text overlays with proper Hebrew typography

## Features

- **Consistent Randomization**: Each day gets the same image/quote combination every time you run the script
- **All 49 Days**: Generates complete set of Omer images (days 1-49)
- **Hebrew Text Support**: Proper Hebrew Omer counting formulas
- **Beautiful Overlays**: Semi-transparent backgrounds with white text and black outlines for readability
- **High Quality**: 1080x1080 pixel images perfect for social media sharing

## Files

- `generate-omer-images.js` - Canvas-based generator (more features, requires node-canvas)
- `generate-omer-images-sharp.js` - Sharp-based generator (simpler, easier to install)
- `package-image-gen.json` - Dependencies for the generators

## Quick Start

### Option 1: Using Sharp (Recommended - Easier Installation)

1. **Install Sharp**:
   ```bash
   npm install sharp
   ```

2. **Run the generator**:
   ```bash
   node generate-omer-images-sharp.js
   ```

### Option 2: Using Canvas (More Features)

1. **Install Canvas** (requires build tools):
   ```bash
   npm install canvas
   ```

2. **Run the generator**:
   ```bash
   node generate-omer-images.js
   ```

## Prerequisites

- Node.js installed on your system
- Pictures in the `./pictures` directory
- `sentences_of_shaul.json` file in the root directory

## Output

The script will create a `generated-omer-images` directory containing:
- `omer-day-01.jpg` through `omer-day-49.jpg`
- Each image is 1080x1080 pixels
- High quality JPEG format

## Customization

You can modify the configuration at the top of either script:

```javascript
const CONFIG = {
  OUTPUT_DIR: './generated-omer-images',    // Where to save images
  PICTURES_DIR: './pictures',               // Source images directory
  SENTENCES_FILE: './sentences_of_shaul.json', // Quotes file
  IMAGE_WIDTH: 1080,                        // Output width
  IMAGE_HEIGHT: 1080,                       // Output height
  // ... more options
};
```

## Image Mapping

The randomization algorithm ensures:
- **Day 1** always gets the same image and quote
- **Day 2** always gets the same (different) image and quote
- And so on for all 49 days

This means you can re-run the script and get identical results, perfect for consistent branding.

## Hebrew Text

Each image includes:
- **App Title**: "סופרים וזוכרים" (Sofrim VeZochrim)
- **Day Number**: "יום X" (Day X)
- **Omer Formula**: Full Hebrew counting text (e.g., "הַיּוֹם יוֹם אֶחָד לָעֹמֶר")
- **Quote**: Random quote from Shaul
- **Attribution**: "- שאול"

## Troubleshooting

### Canvas Installation Issues
If you have trouble installing the `canvas` package:
- Use the Sharp version instead (`generate-omer-images-sharp.js`)
- On Windows, you may need Visual Studio Build Tools
- On Linux, install: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev`
- On macOS, install Xcode command line tools: `xcode-select --install`

### Missing Images or Quotes
- Ensure the `pictures` directory contains your image files
- Ensure `sentences_of_shaul.json` exists and has the correct format
- Check file paths are correct relative to where you're running the script

### Memory Issues
If processing large images causes memory issues:
- Reduce `IMAGE_WIDTH` and `IMAGE_HEIGHT` in the config
- Process fewer images at once by modifying the loop

## Integration with Sofrim App

The updated `DailyContentService` in the app now:
- Uses the same randomization algorithm
- Selects images based on Omer day during the Omer period
- Falls back to day-of-year outside the Omer period
- Includes all available images from the pictures directory

## Example Usage

```bash
# Install dependencies
npm install sharp

# Generate all 49 images
node generate-omer-images-sharp.js

# Images will be saved to ./generated-omer-images/
ls generated-omer-images/
# omer-day-01.jpg  omer-day-02.jpg  ... omer-day-49.jpg
```

## Social Media Ready

The generated 1080x1080 images are perfect for:
- Instagram posts
- Facebook sharing
- WhatsApp status updates
- Twitter/X posts
- Any social media platform

Each image maintains the spiritual and memorial aspects of the Sofrim app while providing beautiful, shareable content for each day of the Omer period.
