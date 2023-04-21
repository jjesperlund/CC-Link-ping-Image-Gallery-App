import React, { Component } from 'react';

export class Gallery extends Component {
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
        <img src={`data:image/jpeg;base64,${imagesList[0]}`} />
      );
    }
  }

  async fetchImages() {
      const response = await fetch('imagegallery');
      const data = await response.json();
      this.setState({ images: data, loading: false });
  }
}
