
export function getImageBytes (file) {
  return new Promise(resolve => {
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    reader.onload = () => {
      const baseURL = reader.result;
      resolve(baseURL);
    };
  });
};

export function parseImages(imageBytesList, imagesDimensions) {
  // Parse byte array of images to gallery format
  return imageBytesList.map((imageBytes, index) => {
    const imageSrc = "data:image/jpeg;base64," + imageBytes;
    const imageAspectRatio = imagesDimensions[index].height / imagesDimensions[index].width;
    return {
      src: imageSrc,
      width: 2,
      height: 2 * imageAspectRatio
    }
  });
}

export function getImageDimensions(imageSrc) {
  return new Promise (function (resolved, rejected) {
    let i = new Image()
    i.onload = function(){
      resolved({ width: i.width, height: i.height })
    };
    i.src = "data:image/jpeg;base64," + imageSrc;
  })
} 