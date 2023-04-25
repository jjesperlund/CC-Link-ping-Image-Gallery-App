import React, { Component } from 'react';
import Gallery from "react-photo-gallery";

export class GalleryViewer extends Component {
  render() {
    const { images, isFetchingImages } = this.props;

    if (isFetchingImages) {
      return (<p>Loading...</p>)
    } else {
      return (
        <div>
          <Gallery photos={images} />
        </div>
      );
    }
  }
}
