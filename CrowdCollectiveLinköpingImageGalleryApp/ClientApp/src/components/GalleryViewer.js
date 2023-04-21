import React, { Component } from 'react';
import Gallery from "react-photo-gallery";

export class GalleryViewer extends Component {
  constructor(props) {
    super(props);
    this.state = { images: [], loading: true };
  }

  componentDidMount() {
    this.fetchImages();
  }
  render() {
    const isFetchingData = this.state.loading;
    const imagesList = this.state.images;

    if (isFetchingData) {
      return (<p>Loading...</p>)
    } else {
      return (
        <div>
          <Gallery photos={imagesList} />
        </div>
      );
    }
  }

  async fetchImages() {
      const response = await fetch('imagegallery');
      const data = await response.json();

      let imagesDimensions = [];
      for (let i = 0; i < data.length; i++) {
        const dimensions = await this.getImageDimensions(data[i]);
        imagesDimensions.push(dimensions)
      }

      const images = this.parseImages(data, imagesDimensions);
      this.setState({ images: images, loading: false });
  }

  parseImages(imageBytesList, imagesDimensions) {
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
  
  getImageDimensions(imageSrc) {
    return new Promise (function (resolved, rejected) {
      var i = new Image()
      i.onload = function(){
        resolved({ width: i.width, height: i.height })
      };
      i.src = "data:image/jpeg;base64," + imageSrc;
    })
  } 
}
