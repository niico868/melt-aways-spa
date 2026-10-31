import ba1 from "@/assets/ba1.png.asset.json";
import ba2 from "@/assets/ba2.png.asset.json";
import ba3 from "@/assets/ba3.png.asset.json";
import ba4 from "@/assets/ba4.png.asset.json";
import ba5 from "@/assets/ba5.png.asset.json";
import ba6 from "@/assets/ba6.png.asset.json";
import ba7 from "@/assets/ba7.png.asset.json";
import ba8 from "@/assets/ba8.png.asset.json";
import ba9 from "@/assets/ba9.png.asset.json";
import baNew1 from "@/assets/ba_new_1.png.asset.json";
import baNew2 from "@/assets/ba_new_2.png.asset.json";
import baNew3 from "@/assets/ba_new_3.png.asset.json";
import baNew4 from "@/assets/ba_new_4.png.asset.json";
import baNew5 from "@/assets/ba_new_5.png.asset.json";
import baNew6 from "@/assets/ba_new_6.png.asset.json";

export const BA_IMAGES = [ba1.url, ba2.url, ba3.url, ba4.url, ba5.url, ba6.url, ba7.url, ba8.url, ba9.url];
export const BA_NEW = [baNew1.url, baNew2.url, baNew3.url, baNew4.url, baNew5.url, baNew6.url];

export type GalleryItem = {
  src: string;
  category: string;
  sessions: string;
  timeframe: string;
};

// Group images into categories. Image assignments are estimates; the client
// can rearrange these as real categorisation is confirmed.
export const GALLERY: Record<string, GalleryItem[]> = {
  "Body Contouring Results": [
    { src: BA_IMAGES[6], category: "Body Contouring", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_IMAGES[1], category: "Body Contouring", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_IMAGES[4], category: "Body Contouring", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_NEW[0], category: "Body Contouring", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_NEW[3], category: "Body Contouring", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
  ],
  "Fat Melting Results": [
    { src: BA_IMAGES[0], category: "Fat Melting", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_IMAGES[3], category: "Fat Melting", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_NEW[1], category: "Fat Melting", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
  ],
  "Skin Tightening Results": [
    { src: BA_IMAGES[5], category: "Skin Tightening", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_IMAGES[7], category: "Skin Tightening", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_NEW[2], category: "Skin Tightening", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_NEW[4], category: "Skin Tightening", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
  ],
  "Stretch Mark Rejuvenation Results": [
    { src: BA_IMAGES[2], category: "Stretch Mark Rejuvenation", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
  ],
  "Facial Results": [
    { src: BA_IMAGES[8], category: "Facial", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
    { src: BA_NEW[5], category: "Facial", sessions: "Sessions: pending", timeframe: "Time between photos: pending" },
  ],
};