const CLOUDINARY_BASE = "https://res.cloudinary.com/dhbdckgkc/image/upload";

function cloudinaryImage(transform: string, publicId: string) {
  return `${CLOUDINARY_BASE}/${transform}/${publicId}`;
}

export const LOTUS_IMAGES = {
  logo: cloudinaryImage(
    "f_auto,q_auto:good,c_limit,w_360",
    "lotus-pet-spa-mobile/logo-white.png"
  ),
  hero: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_1120,h_630,g_auto",
    "lotus-pet-spa-mobile/hero-logo.png"
  ),
  heroAlt: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_920,h_1150,g_auto",
    "lotus-pet-spa-mobile/april-with-dogs.png"
  ),
  features: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_920,h_690,g_auto",
    "lotus-pet-spa-mobile/feature-dog-after-grooming.png"
  ),
  reviewRenardo: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_800,h_600,g_auto",
    "lotus-pet-spa-mobile/review-renardo.png"
  ),
  reviewRuth: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_800,h_600,g_auto",
    "lotus-pet-spa-mobile/review-ruth-pipey.png"
  ),
  reviewMary: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_800,h_600,g_auto",
    "lotus-pet-spa-mobile/review-mary-candy.png"
  ),
  reviewCathy: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_800,h_600,g_auto",
    "lotus-pet-spa-mobile/review-cathy-lucy.jpg"
  ),
  reviewLinda: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_800,h_600,g_auto",
    "lotus-pet-spa-mobile/review-linda.jpg"
  ),
  reviewDena: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_800,h_600,g_auto",
    "lotus-pet-spa-mobile/review-dena-charley.jpg"
  ),
  ogImage: cloudinaryImage(
    "f_auto,q_auto:good,c_fill,w_1200,h_630,g_auto",
    "lotus-pet-spa-mobile/hero-logo.png"
  ),
} as const;
