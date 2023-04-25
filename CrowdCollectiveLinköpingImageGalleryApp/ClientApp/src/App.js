import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GalleryViewer } from "./components/GalleryViewer";
import { UploadImage } from "./components/UploadImage";
import { parseImages, getImageDimensions } from './helpers/ImageGalleryHelper';
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
      const dimensions = await getImageDimensions(data[i]);
      imagesDimensions.push(dimensions)
    }

    const images = parseImages(data, imagesDimensions);
    this.setState({ images: images, loading: false });
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
