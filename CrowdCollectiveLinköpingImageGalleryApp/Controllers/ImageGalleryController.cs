using Microsoft.AspNetCore.Mvc;
using CrowdCollectiveLinköpingImageGalleryApp.Services;
using CrowdCollectiveLinköpingImageGalleryApp.Models;
using Google.Apis.Drive.v3;

namespace CrowdCollectiveLinköpingImageGalleryApp.Controllers;

[ApiController]
[Route("[controller]")]
public class ImageGalleryController : ControllerBase
{
    [HttpGet]
    public List<byte[]> Get()
    {
        List<byte[]> images = new List<byte[]>();
        List<Image> imagesList = GoogleDriveService.GetImages();

        foreach (Image image in imagesList)
        {
            // TODO: Rule for when to not download:
            // Max downloads: 100 images,
            // CreatedAt must be greater than DateTime.Now - 1 month?
            images.Add(GoogleDriveService.DownloadImage(image).ToArray());
        }

        return images;
    }
}

