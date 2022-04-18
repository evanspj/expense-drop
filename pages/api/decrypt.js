import CryptoJS from 'crypto-js'

export default function handler (req, res) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  const bytes = CryptoJS.AES.decrypt(req.body.data, ENCRYPTION_KEY)
  const decryptedTransactions = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))

  res.status(200).json({ decryptedTransactions })
}
