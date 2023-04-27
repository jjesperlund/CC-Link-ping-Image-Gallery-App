using System;
namespace CrowdCollectiveLinköpingImageGalleryApp.Models
{
	public class Image
	{
		public string? Name { get; set; }

		public string Id { get; set; }

		public long? SizeInBytes { get; set; }

		public DateTime? CreatedAt { get; set; }

		public Image(string id)
		{
			Id = id;
		}

        public Image(string name, string id, long? size, DateTime? createdAt)
		{
			Name = name;
			Id = id;
			SizeInBytes = size;
			CreatedAt = createdAt;
        }			
	}
}

