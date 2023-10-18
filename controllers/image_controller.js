const fs = require('fs');
const json = require('json');
const path = require('path');
const sharp = require('sharp');
const { stringify } = require('querystring');
const fontLibraryPath = path.join(__dirname, '../dafonts/');
const { spawn } = require('child_process');
const { all } = require('axios');


// Read the content of the font library directory
// const folderize = function() {
//     const folders = fs.readdir(fontLibraryPath, { withFileTypes: true }, (err, files) => {
//         if (err) {
//         console.error('Error reading directory:', err);
//         return;
//         } else {
//             // Filter out only directories
//             const folders = files.filter((file) => file.isDirectory()).map((dir) => dir.name);
//             return folders;
//         };
//     });
// }
  
  // Function to get a random element from an array
  function getRandomElement(array) {
    // const splitArray = array.split('')
    console.log(array)
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }


exports.compose = async function compose(req, res) {
    console.log('req.body', req.body);
    const { text } = req.body;

    function folderize() {
      console.log('folderize', fontLibraryPath);
      return new Promise((resolve, reject) => {
        fs.readdir(fontLibraryPath, (err, files) => {
          if (err) {
            console.error('Error reading directory:', err);
            reject(err);
          } else {
            console.log(files);
            const filteredFiles = files.filter(file => file !== '.DS_Store');
            resolve(filteredFiles);
          }
        });
      });
    }
    // Choose a random folder
    const folderList = await folderize();
    const randomFolder = getRandomElement(folderList);
    console.log('Randomly selected folder:', randomFolder);

    try {
        // Load letter images
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&\'(!_^*$%/ç€';
        const fut_alph = '?.éèêàôù-"+)<>=,;:\\'
        const numericalAlphabet = Array.from({length: 50}, (_, i) => i + 1);

        the_map = {
            'A': '0',
            'B': '1',
            'C': '2',
            'D': '3',
            'E': '4',
            'F': '5',
            'G': '6',
            'H': '7',
            'I': '8',
            'J': '9',
            'K': '10',
            'L': '11',
            'M': '12',
            'N': '13',
            'O': '14',
            'P': '15',
            'Q': '16',
            'R': '17',
            'S': '18',
            'T': '19',
            'U': '20',
            'V': '21',
            'W': '22',
            'X': '23',
            'Y': '24',
            'Z': '25',
            '0': '26',
            '1': '27',
            '2': '28',
            '3': '29',
            '4': '30',
            '5': '31',
            '6': '32',
            '7': '33',
            '8': '34',
            '9': '35',
            '@': '36',
            '#': '37',
            '&': '38',
            "'": '39',
            '(': '40',
            '!': '41',
            '_': '42',
            '^': '43',
            '*': '44',
            '$': '45',
            '%': '46',
            '/': '47',
            'ç': '48',
            '€': '49'
        }

        const imagesPromises = Promise.all(alphabet.split('').map(async (letter) => {
          try {
            const imageBuffer = await fs.promises.readFile(fontLibraryPath + randomFolder + '/' + the_map[letter] + '.png');
            const sharpImage = sharp(imageBuffer);
            const { width, height } = await sharpImage.metadata();
            sizedImg =  sharpImage.resize({ width, height });
          
            return { letter, sizedImg, width, height };
          } catch (err) {
            console.error(`Error reading image file for letter ${letter}:`, err);
            return null;
          }
        }));
        
        const letters_images = await imagesPromises;
        // console.log('letters_images', letters_images);
        
        const distanceBetweenImages = -20;
        let compositeWidth = 0;
        const the_set = []
        for (let i = 0; i < text.length; i++) {
          const letterO = text[i].toUpperCase();
          console.log('letter', letterO);
          console.log('flibidy', the_map[letterO]);
          console.log('letters lengtth', letters_images.length);
          for (let j = 0; j < letters_images.length; j++) {
            if (letters_images[j].letter === letterO) {
              console.log('found letter', letterO);
              found_letter_obj = { letter: letters_images[j].letter, sizedImg: letters_images[j].sizedImg, width: letters_images[j].width, height: letters_images[j].height };
              the_set.push(found_letter_obj);
              console.log('letterImage', );
              break;
            }
          }
        }
        maxHeight = 0;
        for (let i = 0; i < the_set.length; i++) {
          compositeWidth += the_set[i].width;
          if (the_set[i].height > maxHeight) {
            maxHeight = the_set[i].height;
          }
        }
        console.log('maxHeight', maxHeight);
        compositeWidth += (text.length - 1) * distanceBetweenImages;
        console.log('compositeWidth', compositeWidth);
        let currentX = 0;

        const finool_Image = the_set.reduce((composite, {letter, sizedImg, width, height}) => {
          sizedImg.raw = {width: width, height: height, channels: 4};
          console.log('image_prop', sizedImg);
          return composite.composite([{ input: sizedImg, top: 50, left: currentX}]);
          
        }, sharp({ create: { width: compositeWidth, height: maxHeight, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } }}));
        // Save or send the composed image
        const filename = text + '.png';
        const outputPath = path.join(__dirname, '../temp3', filename);

        const temp3Path = path.join(__dirname, '../temp3');
        if (!fs.existsSync(temp3Path)) {
          fs.mkdirSync(temp3Path, { recursive: true });
        }

        finool_Image.raw = {width: compositeWidth, height: maxHeight, channels: 4}
        // console.log('finool_Image', finool_Image);
        // base64Data = await finool_Image.toBuffer().then((data) => {
        //   return data.toString('base64');
        // }).catch((err) => {
        //   console.error('Error converting image to base64:', err);
        //   return null;
        // });
        const le_fioonl =  sharp(finool_Image);
        console.log('outputPath', outputPath);
        // base64Data = await le_fioonl.toBuffer().then((data) => {
        //   return data.toString('base64');
        // }).catch((err) => {
        //   console.error('Error converting image to base64:', err);
        //   return null;
        // });

        const bob = fs.promises.writeFile(outputPath, le_fioonl).then(() => {
          console.log('File written successfully');
        })
        .catch((error) => {
          console.error('Error writing file:', error);
        });
        await bob;
        res.status(200).json({ filename });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }};

exports.pyCompose = async function pyCompose(req, res) {
  let errored = false;
  console.log('req.body', req.body);
  // Replace 'path/to/python/script.py' with the actual path to your Python script
  const pythonScriptPath = path.join(__dirname, '../controllers', 'compose.py');
  const venvPythonExecutable = path.join(__dirname, '../bin/python3');

  // Your data to pass to the Python script
  const dataToSend = req.body.text;

  // Spawn a new Python process
  console.log(pythonScriptPath)
  const pythonProcess = spawn(venvPythonExecutable, [pythonScriptPath], {
    env: {
      ...process.env,  // Preserve the existing environment variables
      TEXT_VARIABLE: dataToSend,
    },
  });
  
  console.log('started python process')
  // Listen for stdout data from the Python script
  allOutputs = []
  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python script output: ${data}`);
    allOutputs.push(data);
  });

  // Listen for any errors that might occur during execution
  pythonProcess.on('error', (error) => {
    errored = true;
    allOutputs.push(error);
    console.log(`Error executing Python script: ${error}`);
    res.status(500).json({ allOutputs });
    
  });

  // Listen for the process to exit
  pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
    console.log('allOutputs', JSON.stringify(allOutputs));
    if (errored === false){res.status(200).json(JSON.stringify(allOutputs))};
  });
}