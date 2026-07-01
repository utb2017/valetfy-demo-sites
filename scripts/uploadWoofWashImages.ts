import fs from 'node:fs'
import crypto from 'node:crypto'
import https from 'node:https'

const cloudinaryUrl = process.env.CLOUDINARY_URL
if (!cloudinaryUrl) {
  console.error('CLOUDINARY_URL is required')
  process.exit(1)
}

const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/)
if (!match) {
  console.error('Invalid CLOUDINARY_URL')
  process.exit(1)
}

const [, apiKey, apiSecret, cloudName] = match

const uploads = [
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/1-hero-Image.png',
    public_id: 'woof-wash/mobile-dog-grooming-austin-tx-travis-county-hero',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,hero',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/2-eco-friendly-2.png',
    public_id: 'woof-wash/eco-friendly-dog-grooming-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,eco-friendly',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/2-stress-free-2.png',
    public_id: 'woof-wash/stress-free-dog-grooming-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,stress-free',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/3-to-your-door-3.png',
    public_id: 'woof-wash/mobile-dog-groomer-travis-county-austin-tx',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,mobile',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/4-services-wide-4-update.png',
    public_id: 'woof-wash/dog-grooming-prices-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,pricing',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/5-avatar-5.png',
    public_id: 'woof-wash/full-groom-dog-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,full-groom',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/6-avatar-6.png',
    public_id: 'woof-wash/dog-bath-service-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,bath',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/7-avatar-7.png',
    public_id: 'woof-wash/grooming-add-ons-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,add-ons',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/8-we-dog-people-8.png',
    public_id: 'woof-wash/about-woof-wash-dog-grooming-austin-tx-travis-county',
    tags: 'woof-wash,dog-grooming,austin-tx,travis-county,about',
  },
  {
    file: 'C:/smallbizpreview/sites/woof-wash/assets/logo.svg',
    public_id: 'woof-wash/logo',
    tags: 'woof-wash,logo',
  },
] as const

function uploadOne({
  file,
  public_id,
  tags,
}: {
  file: string
  public_id: string
  tags: string
}) {
  return new Promise<{ public_id: string; secure_url: string; bytes: number; format: string }>(
    (resolve, reject) => {
      const timestamp = Math.floor(Date.now() / 1000)
      const paramsToSign = `overwrite=true&public_id=${public_id}&tags=${tags}&timestamp=${timestamp}`
      const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex')
      const boundary = `----CloudinaryForm${Date.now()}`
      const fileData = fs.readFileSync(file)
      const ext = file.endsWith('.svg') ? 'svg' : 'png'
      const contentType = ext === 'svg' ? 'image/svg+xml' : 'image/png'

      const parts: Buffer[] = [
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${public_id.split('/').pop()}.${ext}"\r\nContent-Type: ${contentType}\r\n\r\n`,
        ),
        fileData,
        Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\n${public_id}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="tags"\r\n\r\n${tags}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\ntrue\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`),
        Buffer.from(`--${boundary}--\r\n`),
      ]
      const body = Buffer.concat(parts)

      const req = https.request(
        {
          hostname: 'api.cloudinary.com',
          path: `/v1_1/${cloudName}/image/upload`,
          method: 'POST',
          headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length,
          },
        },
        (res) => {
          let data = ''
          res.on('data', (chunk) => {
            data += chunk
          })
          res.on('end', () => {
            try {
              const json = JSON.parse(data) as {
                secure_url?: string
                bytes?: number
                format?: string
                error?: { message: string }
              }
              if (json.error) reject(new Error(json.error.message))
              else
                resolve({
                  public_id,
                  secure_url: json.secure_url ?? '',
                  bytes: json.bytes ?? 0,
                  format: json.format ?? '',
                })
            } catch {
              reject(new Error(data))
            }
          })
        },
      )
      req.on('error', reject)
      req.write(body)
      req.end()
    },
  )
}

async function main() {
  for (const upload of uploads) {
    const result = await uploadOne(upload)
    console.log(`OK ${result.public_id} (${result.format}, ${result.bytes} bytes)`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
