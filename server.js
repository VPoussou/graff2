const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const user_routes = require('./routes/user_routes');
const image_routes = require('./routes/image_routes');
// const fs = require('fs');
// const Jimp = require('jimp');
const port = process.env.PORT || 3000;
const { db_init } = require('./models/index');
const buildOrDev = 1; // 0 for dev, 1 for build
if (buildOrDev) {
     builRep = 'build';
} else {
     builRep = 'src';
}

db_init();

app.use(express.json());
app.use(cors());
app.use('/api', user_routes);
app.use('/compose', image_routes);
app.use(express.static(path.join(__dirname, builRep)));
app.use(express.static(path.join(__dirname, 'tempImgs')));

app.get('/img', (req,res) => {
    res.sendFile(path.join(__dirname, 'tempImgs', 'Youpi_composite.png'));
});

app.get('/loading', (req,res) => {
    res.sendFile(path.join(__dirname, builRep, 'index.html'));
});

// const fontLibraryPath = './dafonts/'

// // Read the content of the font library directory
// const folders = fs.readdir(fontLibraryPath, { withFileTypes: true }, (err, files) => {
//     if (err) {
//       console.error('Error reading directory:', err);
//       return;
//     } else {
//       // Filter out only directories
//       const folders = files.filter((file) => file.isDirectory()).map((dir) => dir.name);
//       return folders;
//     };
// });
  
//   // Function to get a random element from an array
//   function getRandomElement(array) {
//     const randomIndex = Math.floor(Math.random() * array.length);
//     return array[randomIndex];
//   }


// app.post('/compose', async (req, res) => {
//     const { text } = req.body;

//     // Choose a random folder
//     const randomFolder = getRandomElement(folders);
//     console.log('Randomly selected folder:', randomFolder);

//     try {
//         // Load letter images
//         const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&\'(!_^*$%/ç€';
//         const fut_alph = '?.éèêàôù-"+)<>=,;:\\'
//         const images = await Promise.all(
//           alphabet.split('').map(async (letter) => {
//             const image = await Jimp.read(fontLibraryPath + randomFolder + '/' + letter + '.png');
//             return { letter, image };
//           })
//         );
    
//         // Compose the text
//         let currentX = 0;
//         const distanceBetweenImages = -20;
//         const compositeImage = new Jimp(800, 200, 'lightgray');
    
//         for (let i = 0; i < text.length; i++) {
//           const letter = text[i].toUpperCase();
//           const { image } = images.find((img) => img.letter === letter) || {};
    
//           if (image) {
//             compositeImage.blit(image, currentX, 50);
//             currentX += image.getWidth() + distanceBetweenImages;
//           }
//         }
    
//         // Save or send the composed image
//         const outputPath = 'temp/' + text + '.png';
//         await compositeImage.writeAsync(outputPath);
//         res.setHeader('Content-Type', 'image/png');
//         res.send(compositeImage.bitmap.data);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, error: 'Internal Server Error' });
//       }
//     });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
}).on('error', (error) => {
    console.error('Error starting server:', error);
})



