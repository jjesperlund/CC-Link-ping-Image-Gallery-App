import React, { Component } from 'react';
import Gallery from "react-photo-gallery";
import { generateUniqueRandomNumberList } from '../helpers/ImageGalleryHelper';

export class GalleryViewer extends Component {

  constructor(props) {
    super(props);
    this.state = { galleryImages: [] };
    this.intervalTime = 5000; // 5 seconds
    this.numImagesInGallery = 5;

    clearInterval(this.updateGalleryImages)
  }

  componentDidMount() {
    setInterval(this.updateGalleryImages, this.intervalTime);
  }

  updateGalleryImages = () => {
    const images = this.props.images;
    const numImages = images.length;

    if (numImages <= this.numImagesInGallery) {
      this.setState({ galleryImages: images });
      return;
    } 

    // Fill array with random values between 0 to numImages
    const imageIndexes =
      generateUniqueRandomNumberList(this.numImagesInGallery, images.length - 1);

    let imagesToDisplay = [];
    imageIndexes.forEach(index => {
      imagesToDisplay.push(images[index]);
    })

    this.setState({ galleryImages: imagesToDisplay });
  }

  render() {
    const { isFetchingImages } = this.props;

    if (isFetchingImages) {
      return (<p>Loading...</p>)
    } else {
      return (
        <div>
          <Gallery photos={this.state.galleryImages} key={Date.now()} />
        </div>
      );
    }
  }
}
