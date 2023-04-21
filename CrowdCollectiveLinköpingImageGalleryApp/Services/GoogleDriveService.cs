using System;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Google.Apis.Download;

namespace CrowdCollectiveLinköpingImageGalleryApp.Services
{
	public static class GoogleDriveService
    {
        private const string DRIVE_FOLDER_ID = "1K3RgYIJcUsq5hZGI9HlcGvlTVG_HH5WV";

        public static DriveService _driveClient = GetClient();

        public static DriveService GetClient()
        {
            string credenitalsJSONPath = $"google-drive-service-account-secret.json";

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

        // Return list of image IDs in the Google Drive DRIVE_FOLDER_ID folder
        public static List<string> GetImageIds()
        {
            var request = _driveClient.Files.List();
            request.PageSize = 1000;
            request.Q = $"'{DRIVE_FOLDER_ID}' in parents";
            request.Fields = "files(name,id,size)";
            var results = request.Execute();

            List<string> fileIds = new List<string>();

            foreach (var driveFile in results.Files)
            {
                fileIds.Add(driveFile.Id);
            }

            return fileIds;
        }

        public static MemoryStream DownloadImage(string imageId)
        {
            try
            { 
                var request = _driveClient.Files.Get(imageId);
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
                                    Console.WriteLine($"Download of {imageId} complete.");
                                    break;
                                }
                            case DownloadStatus.Failed:
                                {
                                    Console.WriteLine($"Download of {imageId} failed.");
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

    }
}

