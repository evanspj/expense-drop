import CryptoJS from 'crypto-js'

export default function handler (req, res) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
  const encryptedTransactions = CryptoJS.AES.encrypt(JSON.stringify(req.body), ENCRYPTION_KEY).toString()

  res.status(200).json({ encryptedTransactions })
}
