import React, { Component } from 'react';
import Button from '@mui/material/Button';
import FilterIcon from '@mui/icons-material/Filter';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { FileUploader } from "react-drag-drop-files";

import { getImageBytes, getImageDimensions, parseImages } from '../helpers/ImageGalleryHelper'

export class UploadImage extends Component {

  constructor(props) {
    super(props);

    this.supportedFileTypes = ["JPG", "JPEG", "PNG"];
    this.maxImageSizeInMegabytes = 30;

    this.state = { selectedImages: [], selectionCompleted: false };
  }

  handleChange = images => {
    const promises = Object.values(images).map(async image => {
      return new Promise(async resolve => {
        const imageBase64 = await getImageBytes(image);
        resolve(imageBase64);
      });
    });

    Promise.all(promises).then((imagesBase64) => {
      this.setState({
        selectedImages: imagesBase64,
        selectionCompleted: true
      });
    });
  }

  uploadSelectedImages = () => {
    this.props.uploadImages(this.state.selectedImages);
  }

  displaySelectedImages() {
    return this.state.selectedImages.map((image, index) => {
      return <img src={image} key={index} width="40" />
    });
  }

  render() {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} style={{ height: '3em' }} />
          <Grid item xs={12}>
            <Typography align='center'>
              <FileUploader
                handleChange={this.handleChange}
                name="file"
                types={this.supportedFileTypes}
                multiple={true}
                maxSize={this.maxImageSizeInMegabytes}
                label={""}
                style={{ height: '20em' }}
                children={
                  <Box
                    sx={{
                      width: 500,
                      height: 300,
                      backgroundColor: '#d0cec6',
                      '&:hover': {
                        border: '1px solid black',
                        cursor: 'pointer'
                      },
                      border: '1px dashed black',
                      borderRadius: 5
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} style={{ textAlign: 'center', paddingTop: '15%' }}>
                        <FilterIcon color='primary' style={{ transform: 'scale(2)' }}/>
                      </Grid>
                      <Grid item xs={12} style={{ paddingTop: '5%' }}>
                        <Typography align='center' variant='h6' >
                          Drag & Drop
                        </Typography>
                        <Typography align='center' variant='h6' >
                          or <Button variant='outlined'>browse</Button>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} style={{ paddingTop: '6%' }}>
                        {this.displaySelectedImages()}
                      </Grid>
                    </Grid>
                  </Box>
                  
                }
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align='center' variant='h6' style={{ paddingTop: '3%' }}>
              <Button
                variant="contained"
                disabled={this.state.selectedImages.length === 0}
                endIcon={<SendIcon />}
                onClick={this.uploadSelectedImages}
              >
                Upload
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    );    
  }
}
