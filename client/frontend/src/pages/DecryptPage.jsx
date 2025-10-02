import React, { useState } from 'react'
import axios from 'axios'
import FileUpload from '../components/FileUpload.jsx'
import FileDownload from '../components/FileDownload.jsx'

function DecryptPage() {
  const [file, setFile] = useState(null)
  const [encryptedAesKey, setEncryptedAesKey] = useState('')
  const [iv, setIv] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [decryptedFilePath, setDecryptedFilePath] = useState('')

  const handleDecrypt = async () => {
    setError('')
    setSuccess('')
    setDecryptedFilePath('')
    if (!file || !encryptedAesKey || !iv) {
      setError('Please provide file, encrypted AES key, and IV.')
      return
    }
    try {
      setLoading(true)
      const form = new FormData()
      form.append('file', file)
      form.append('encryptedAesKey', encryptedAesKey.trim())
      form.append('iv', iv.trim())

      const res = await axios.post('/api/files/decrypt', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setDecryptedFilePath(res.data.decryptedFilePath)
      setSuccess('File decrypted successfully.')
    } catch (e) {
      const apiErr = e?.response?.data
      setError(apiErr?.error ? `${apiErr.error}${apiErr.details ? `: ${apiErr.details}` : ''}` : 'Decryption failed')
    } finally {
      setLoading(false)
    }
  }

  const decryptedName = decryptedFilePath ? String(decryptedFilePath).split(/[\\\\/]/).pop() : ''
  const downloadHref = decryptedName ? `http://localhost:5000/${decryptedName}` : ''

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Decrypt File</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <FileUpload label="Choose encrypted file" onChange={setFile} />

        <div>
          <label className="text-sm font-medium text-gray-700">Encrypted AES Key (base64)</label>
          <textarea
            className="w-full mt-1 text-sm p-2 border rounded"
            value={encryptedAesKey}
            onChange={(e) => setEncryptedAesKey(e.target.value)}
            rows={3}
            placeholder="Paste base64 RSA-encrypted AES key"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">IV (base64)</label>
          <input
            className="w-full mt-1 text-sm p-2 border rounded"
            value={iv}
            onChange={(e) => setIv(e.target.value)}
            placeholder="Paste base64 IV"
          />
        </div>

        <button
          onClick={handleDecrypt}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Decrypting…' : 'Decrypt File'}
        </button>

        {success && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-3">{success}</div>}
        {error && <div className="text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

        {downloadHref && (
          <FileDownload href={downloadHref} filename={file ? `decrypted_${file.name}` : undefined}>
            Download Decrypted File
          </FileDownload>
        )}
      </div>
    </div>
  )
}

export default DecryptPage


