import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GalleryViewer } from "./components/GalleryViewer";
import { UploadImage } from "./components/UploadImage";
import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = { images: [], loading: true };
  }

  componentDidMount() {
    this.fetchImages();
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
    let i = new Image()
    i.onload = function(){
      resolved({ width: i.width, height: i.height })
    };
    i.src = "data:image/jpeg;base64," + imageSrc;
  })
} 

  render() {
    return (
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <GalleryViewer
                images={this.state.images}
                isFetchingImages={this.state.loading}
              />}
          />
          <Route path="/upload-image" element={<UploadImage />} />
        </Routes>
      </Layout>
    );
  }
}
