'use client'

import Image, { type ImageProps } from 'next/image'

/** Lotus-specific image wrapper for local demo assets. */
export function LotusPetSpaImage(props: ImageProps) {
  return <Image {...props} />
}
