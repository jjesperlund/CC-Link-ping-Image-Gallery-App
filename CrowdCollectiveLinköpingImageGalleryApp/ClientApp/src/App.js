import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GalleryViewer } from "./components/GalleryViewer";
import { UploadImage } from "./components/UploadImage";
import { parseImages, getImageDimensions } from './helpers/ImageGalleryHelper';
import './custom.css';

class App extends Component {
  static displayName = App.name;

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isFetchingAllImages: true,
      isUploading: false,
      uploadCompleted: true,
      uploadErrorMessage: ''
    };
  }

  componentDidMount() {
    this.fetchAllImages();
  }

  async fetchAllImages() {
    const response = await fetch('imagegallery/downloadAllImages');
    const data = await response.json();

    let imagesDimensions = [];
    for (let i = 0; i < data.length; i++) {
      const dimensions = await getImageDimensions(data[i]);
      imagesDimensions.push(dimensions)
    }

    const images = parseImages(data, imagesDimensions);
    this.setState({ images: images, isFetchingAllImages: false });
  }

  async fetchImages(imageIds) {
    const ids = this.generateCommaSeparatedIdsString(imageIds);

    const response = await fetch('imagegallery/downloadImages?ids=' + ids);
    const data = await response.json();

    let imagesDimensions = [];
    for (let i = 0; i < data.length; i++) {
      const dimensions = await getImageDimensions(data[i]);
      imagesDimensions.push(dimensions)
    }

    const images = parseImages(data, imagesDimensions);
    const currentImages = this.state.images;
    this.setState({ images: currentImages.concat(images) });
  }

  uploadImages = async imagesBase64 => {    
    this.setState({ isUploading: true, uploadCompleted: false, uploadErrorMessage: '' });

    // Remove image source prefix to get only image byte data
    const imagesBytes = imagesBase64.map(
      imageBase64 => imageBase64.replace("data:image/jpeg;base64,", "")
    );

    const response = await fetch('imagegallery/addImages', {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imagesList: imagesBytes
      })
    });
    
    if (response.status !== 200) {
      this.setState({
        uploadErrorMessage: 'Failed to upload one or several images.',
        isUploading: false,
        uploadCompleted: true
      });
    } else {
      const responseBody = await response.json();
      this.setState({ isUploading: false, uploadCompleted: true, uploadErrorMessage: '' });
      setTimeout(this.onUploadCompleted(responseBody), 3000);
    }
  }

  onUploadCompleted = responseBody => {
      // TODO: Redirect to home page     
      
      const imageIds = responseBody.map(image => image.id);
      this.fetchImages(imageIds);
  }

  generateCommaSeparatedIdsString(imageIdList) {
    return imageIdList.join(',');
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
                isFetchingImages={this.state.isFetchingAllImages}
              />}
          />
          <Route
            path="/upload-image"
            element={
            <UploadImage uploadImages={this.uploadImages} />
            }
          />
        </Routes>
      </Layout>
    );
  }
}

export default App;