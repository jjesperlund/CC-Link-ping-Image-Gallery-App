
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
      height: 2 * imageAspectRatio,
      key: generate_uuidv4()
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

export function generateUniqueRandomNumberList(quantity, maxValue){
  const set = new Set()
  while(set.size < quantity) {
    set.add(Math.floor(Math.random() * maxValue) + 1)
  }
  return set;
}

function generate_uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
  function(c) {
     var uuid = Math.random() * 16 | 0, v = c == 'x' ? uuid : (uuid & 0x3 | 0x8);
     return uuid.toString(16);
  });
}