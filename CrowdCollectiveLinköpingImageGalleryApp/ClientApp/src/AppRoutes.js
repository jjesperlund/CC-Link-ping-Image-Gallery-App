import { Gallery } from "./components/Gallery";
import { UploadImage } from "./components/UploadImage";

const AppRoutes = [
  {
    index: true,
    element: <Gallery />
  },
  {
    path: '/upload-image',
    element: <UploadImage />
  }
];

export default AppRoutes;
