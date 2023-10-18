// FabricCanvas.js

import React, { useRef, useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';

const FabricCanvas = () => {
  const canvasRef = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const [originalPosition, setOriginalPosition] = useState({ left: 0, top: 0 });
  const {editor, onReady} =  useFabricJSEditor();
  editor?.canvas.setWidth(512);
  editor?.canvas.setHeight(512);
  
  useEffect(() => {
    if (!editor || !onReady) {
      return;
    }
  });
  
    // Load background image from state
  function bckgSet(url) {
    fabric.Image.fromURL(url, (img) => {

      img.set({
        scaleX: editor?.canvas.width / img.width,
        scaleY: editor?.canvas.height / img.height,
        hasControls: true,
        objectCaching: false,
        originX: 'left',
        originY: 'top',
        selectable: !isFixed,
        // clipPath: clipRect,
        lockUniScaling: true,
        customID: 'background',
    })

      editor?.canvas.centerObject(img);
      editor?.canvas.insertAt(img, 0);
    }, [url, isFixed]);
  };

  const handleImageUpload = e => {
    console.log('handleImageUpload');
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onload = function (event) {
      console.log(file);
      // setBackgroundImage('http://localhost:3000/' + file.webkitRelativePath + file.name);
      bckgSet(event.target.result);
      editor?.canvas.requestRenderAll();
    };

  };

  const handleValidation = () => {
    console.log(isFixed, 'handleValidation');
    if (!isFixed) {
      setIsFixed(true); // Image is fixed after validation
      console.log(isFixed);
    } else {
      setIsFixed(false); // Image is fixed after validation
      console.log('isFixed', isFixed);
    };
    editor.canvas.forEachObject(function (obj) {
      console.log(isFixed)
      if (obj.customID === 'background') {
        obj.set({
          selectable: isFixed,
          hasControls: isFixed,
          lockMovementX: !isFixed,
          lockMovementY: !isFixed,
          lockScalingX: !isFixed,
          lockScalingY: !isFixed,
        });
      }
    });
    editor?.canvas.requestRenderAll();
    console.log('handleValidationComplete');
  };
  function handleFormSubmit(event) {
    event.preventDefault();
    console.log('handleFormSubmit');
    event.preventDefault();

      const textInput = document.getElementById('textInput');
      const text = textInput.value;

      // Send the text as JSON to the /compose endpoint
      const response = fetch('/compose/userimg', {
       method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({ text })
      
      }).then((response) => {
        console.log(response);
        console.log('handleFormSubmitComplete');
        if (response) {
          return response;
        }
      })
      .then((response) => {
        // console.log(response);
        // console.log('Response:', response);
        // const UrlIfiedBlob = URL.createObjectURL(blobified);
        const Img_Url = 'http://localhost:3000/img'
        const userImg = new fabric.Image.fromURL(Img_Url, (img) => {
          img.set({
            // scaleX: editor?.canvas.width / img.width,
            // scaleY: editor?.canvas.height / img.height,
            hasControls: true,
            // objectCaching: false,
            // originX: 'left',
            // originY: 'top',
            // selectable: !isFixed,
            // // clipPath: clipRect,
            // lockUniScaling: true,
            // customID: 'userImg',
          })
          editor?.canvas.insertAt(img, 10);
          editor?.canvas.requestRenderAll();
        });
      });
      } 

  
  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleValidation}>Validate</button>
      <canvas ref={canvasRef} style={{zIndex: 1}}/>
      <FabricJSCanvas onReady={onReady} />
      <form id="composeForm">
        <label for="textInput">Enter Text:</label>
        <input type="text" id="textInput" name="text" required></input>
        <button type="submit" onClick={handleFormSubmit}>Compose</button>
      </form>

    </div>
  );
};
export default FabricCanvas;
