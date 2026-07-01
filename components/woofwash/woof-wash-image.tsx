'use client'

import Image, { type ImageProps } from 'next/image'

import { woofWashImageLoader } from '@/lib/woofwash/cloudinary'

type WoofWashImageProps = Omit<ImageProps, 'loader'> & {
  /** Cloudinary public ID (e.g. woof-wash/mobile-dog-grooming-austin-tx-travis-county-hero). */
  src: string
}

export function WoofWashImage(props: WoofWashImageProps) {
  return <Image loader={woofWashImageLoader} {...props} />
}
