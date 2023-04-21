import { GalleryViewer } from "./components/GalleryViewer";
import { UploadImage } from "./components/UploadImage";

const AppRoutes = [
  {
    index: true,
    element: <GalleryViewer />
  },
  {
    path: '/upload-image',
    element: <UploadImage />
  }
];

export default AppRoutes;
