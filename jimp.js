const express = require('express');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const fontLibraryPath = './dafonts/'

// Read the content of the font library directory
fs.readdir(fontLibraryPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }
  
    // Filter out only directories
const folders = files.filter((file) => file.isDirectory()).map((dir) => dir.name);
});
  
  // Function to get a random element from an array
  function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }


app.use(express.json());
app.post('/compose', async (req, res) => {
    const { text } = req.body;

    // Choose a random folder
    const randomFolder = getRandomElement(folders);
    console.log('Randomly selected folder:', randomFolder);

    try {
        // Load letter images
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&\'(!_^*$%/ç€';
        const fut_alph = '?.éèêàôù-"+)<>=,;:\\'
        const images = await Promise.all(
          alphabet.split('').map(async (letter) => {
            const image = await Jimp.read(fontLibraryPath + randomFolder + '/' + letter + '.png');
            return { letter, image };
          })
        );
    
        // Compose the text
        let currentX = 50;
        const distanceBetweenImages = -20;
        const compositeImage = new Jimp(800, 200, 'lightgray');
    
        for (let i = 0; i < text.length; i++) {
          const letter = text[i].toUpperCase();
          const { image } = images.find((img) => img.letter === letter) || {};
    
          if (image) {
            compositeImage.blit(image, currentX, 50);
            currentX += image.getWidth() + distanceBetweenImages;
          }
        }
    
        // Save or send the composed image
        const outputPath = '/path/to/composedImage.png';
        await compositeImage.writeAsync(outputPath);
    
        res.json({ success: true, imagePath: outputPath });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    });
    
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
