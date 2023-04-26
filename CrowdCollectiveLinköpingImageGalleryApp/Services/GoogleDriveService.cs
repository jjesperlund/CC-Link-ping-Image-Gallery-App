using System;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Google.Apis.Download;
using CrowdCollectiveLinköpingImageGalleryApp.Models;
using System.Collections;
using System.Collections.Generic;
using Google.Apis.Upload;
using Microsoft.AspNetCore.Http;

namespace CrowdCollectiveLinköpingImageGalleryApp.Services
{
	public static class GoogleDriveService
    {
        private const string DRIVE_FOLDER_ID = "1K3RgYIJcUsq5hZGI9HlcGvlTVG_HH5WV";

        private static DriveService _driveClient = GetClient();



        public static DriveService GetClient()
        {
            string credenitalsJSONPath = $"Config/google-drive-service-account-secret.json";

            using (var stream = new FileStream(credenitalsJSONPath, FileMode.Open, FileAccess.Read))
            {
                var credentials = GoogleCredential.FromStream(stream);

                if (credentials != null)
                {
                    if (credentials.IsCreateScopedRequired)
                    {
                        string[] scopes = { DriveService.Scope.Drive };
                        credentials = credentials.CreateScoped(scopes);
                    }

                    var service = new DriveService(new BaseClientService.Initializer()
                    {
                        HttpClientInitializer = credentials,
                        ApplicationName = "cc-linkoping-image-gallery",
                    });

                    return service;
                }
            }
            return null;
        }

        // Return list of Images in the Google Drive DRIVE_FOLDER_ID folder
        public static List<Image> GetImages()
        {
            var request = _driveClient.Files.List();
            request.PageSize = 1000;
            request.Q = $"'{DRIVE_FOLDER_ID}' in parents";
            request.Fields = "files(name,id,size,createdTime)";
            var results = request.Execute();

            List<Image> images = new List<Image>();

            foreach (var driveFile in results.Files)
            {
                images.Add(new Image(driveFile.Name, driveFile.Id, driveFile.Size, driveFile.CreatedTime));
            }

            return images;
        }

        public static MemoryStream DownloadImage(Image image)
        {
            try
            { 
                var request = _driveClient.Files.Get(image.Id);
                var stream = new MemoryStream();

                // Add a handler which will be notified on progress changes.
                // It will notify on each chunk download and when the
                // download is completed or failed.
                request.MediaDownloader.ProgressChanged +=
                    progress =>
                    {
                        switch (progress.Status)
                        {
                            case DownloadStatus.Downloading:
                                {
                                    Console.WriteLine(progress.BytesDownloaded);
                                    break;
                                }
                            case DownloadStatus.Completed:
                                {
                                    Console.WriteLine($"Download of {image.Id} complete.");
                                    break;
                                }
                            case DownloadStatus.Failed:
                                {
                                    Console.WriteLine($"Download of {image.Id} failed.");
                                    break;
                                }
                        }
                    };

                    request.Download(stream);

                return stream;
            }
            catch (Exception e)
            {
                // TODO(developer) - handle error appropriately
                if (e is AggregateException)
                {
                    Console.WriteLine("Credential Not found");
                }
                else
                {
                    throw;
                }
            }

            return null;
        }

        public static List<Image> UploadImages(List<string> imagesBase64)
        {
            List<Image> uploadedImages = new List<Image>();

            foreach (string imageBase64 in imagesBase64)
            {
                byte[] imageBytes = Convert.FromBase64String(imageBase64);
                Image result = UploadImage(imageBytes);
                uploadedImages.Add(result);
            }

            return uploadedImages;
        }

        private static Image UploadImage(byte[] imageBytes)
        {
            try
            { 
                var fileMetadata = new Google.Apis.Drive.v3.Data.File()
                {
                    Name = "uploaded_image_" + GenerateUniqueId(),
                    Parents = new List<string> { DRIVE_FOLDER_ID }
                };

                MemoryStream stream = new MemoryStream(imageBytes);

                // Create a new file, with metadata and stream.
                var request = _driveClient.Files.Create(fileMetadata, stream, "image/jpeg");
                request.Fields = "name,id,size,createdTime";
                var results = request.Upload();

                if (results.Status == UploadStatus.Failed)
                {
                    Console.WriteLine($"GoogleDriveSerive.UploadImage: Error uploading file: {results.Exception.Message}");
                }

                return new Image(
                    request.ResponseBody.Name,
                    request.ResponseBody.Id,
                    request.ResponseBody?.Size,
                    request.ResponseBody?.CreatedTime);
            }
            catch (Exception e)
            {
                Console.WriteLine($"GoogleDriveSerive.UploadImage: Error uploading file");
                return null;
            }
        }

        private static string GenerateUniqueId()
        {
            return Guid.NewGuid().ToString();
        }
    }
}

