export interface Snap {
  id: string;
  src: string;
  gridSrc?: string;
  lightboxSrc?: string;
  alt: string;
  location: string;
  clickedBy: string;
  width: number;
  height: number;
  capturedAt?: string;
}
