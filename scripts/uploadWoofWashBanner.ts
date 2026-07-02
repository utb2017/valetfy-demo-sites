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

const file = 'C:/smallbizpreview/sites/woof-wash/assets/4-services-wide-4-update.png'
const public_id = 'woof-wash/dog-grooming-prices-austin-tx-travis-county'
const tags = 'woof-wash,dog-grooming,austin-tx,travis-county,pricing'

const timestamp = Math.floor(Date.now() / 1000)
const paramsToSign = `invalidate=true&overwrite=true&public_id=${public_id}&tags=${tags}&timestamp=${timestamp}`
const signature = crypto.createHash('sha1').update(paramsToSign + apiSecret).digest('hex')
const boundary = `----CloudinaryForm${Date.now()}`
const fileData = fs.readFileSync(file)

const parts: Buffer[] = [
  Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="banner.png"\r\nContent-Type: image/png\r\n\r\n`,
  ),
  fileData,
  Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\n${public_id}\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="tags"\r\n\r\n${tags}\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="overwrite"\r\n\r\ntrue\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="invalidate"\r\n\r\ntrue\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="timestamp"\r\n\r\n${timestamp}\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="api_key"\r\n\r\n${apiKey}\r\n`),
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="signature"\r\n\r\n${signature}\r\n`),
  Buffer.from(`--${boundary}--\r\n`),
]
const body = Buffer.concat(parts)

async function main() {
await new Promise<void>((resolve, reject) => {
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
        const json = JSON.parse(data) as {
          secure_url?: string
          bytes?: number
          version?: number
          error?: { message: string }
        }
        if (json.error) reject(new Error(json.error.message))
        else {
          console.log('OK', public_id, json.bytes, 'bytes', 'v' + json.version)
          console.log(json.secure_url)
          resolve()
        }
      })
    },
  )
  req.on('error', reject)
  req.write(body)
  req.end()
})
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
