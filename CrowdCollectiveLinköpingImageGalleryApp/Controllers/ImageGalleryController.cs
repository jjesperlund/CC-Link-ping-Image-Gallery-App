using Microsoft.AspNetCore.Mvc;
using CrowdCollectiveLinköpingImageGalleryApp.Services;
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
        List<string> imageIds = GoogleDriveService.GetImageIds();

        foreach (string id in imageIds)
        {
            images.Add(GoogleDriveService.DownloadImage(id).ToArray());
        }

        return images;
    }
}

