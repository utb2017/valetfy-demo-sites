import type { ImageLoaderProps } from 'next/image'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'dhbdckgkc'

/** SEO-friendly Cloudinary public IDs for Woof Wash demo site assets. */
export const WOOF_WASH_IMAGES = {
  hero: 'woof-wash/mobile-dog-grooming-austin-tx-travis-county-hero',
  ecoFriendly: 'woof-wash/eco-friendly-dog-grooming-austin-tx-travis-county',
  stressFree: 'woof-wash/stress-free-dog-grooming-austin-tx-travis-county',
  mobileGroomer: 'woof-wash/mobile-dog-groomer-travis-county-austin-tx',
  pricingBanner: 'woof-wash/dog-grooming-prices-austin-tx-travis-county',
  fullGroom: 'woof-wash/full-groom-dog-austin-tx-travis-county',
  bath: 'woof-wash/dog-bath-service-austin-tx-travis-county',
  addOns: 'woof-wash/grooming-add-ons-austin-tx-travis-county',
  about: 'woof-wash/about-woof-wash-dog-grooming-austin-tx-travis-county',
  logo: 'woof-wash/logo',
} as const

/** Cloudinary version pins bust CDN cache after asset replacements. */
export const WOOF_WASH_IMAGE_VERSIONS: Partial<
  Record<keyof typeof WOOF_WASH_IMAGES, number>
> = {
  pricingBanner: 1782767807,
}

type WoofWashImageOptions = {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'scale' | 'limit'
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco'
  version?: number
}

/** Build a Lighthouse-friendly Cloudinary delivery URL (f_auto, q_auto). */
export function woofWashImageUrl(publicId: string, options: WoofWashImageOptions = {}) {
  const transforms: string[] = ['f_auto', `q_${options.quality ?? 'auto'}`]

  if (options.width) transforms.push(`w_${options.width}`)
  if (options.height) transforms.push(`h_${options.height}`)
  if (options.crop) transforms.push(`c_${options.crop}`)

  const transform = transforms.join(',')
  const versionSegment = options.version ? `/v${options.version}` : ''
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transform}${versionSegment}/${publicId}`
}

function versionForPublicId(publicId: string): number | undefined {
  for (const [key, id] of Object.entries(WOOF_WASH_IMAGES) as Array<
    [keyof typeof WOOF_WASH_IMAGES, string]
  >) {
    if (id === publicId) return WOOF_WASH_IMAGE_VERSIONS[key]
  }
  return undefined
}

/** Next.js Image loader — responsive widths + auto format/quality from Cloudinary. */
export function woofWashImageLoader({ src, width }: ImageLoaderProps) {
  return woofWashImageUrl(src, {
    width,
    crop: 'fill',
    quality: 'auto',
    version: versionForPublicId(src),
  })
}
