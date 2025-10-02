import React, { useState } from 'react'
import axios from 'axios'
import FileUpload from '../components/FileUpload.jsx'
import FileDownload from '../components/FileDownload.jsx'

function EncryptPage() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [result, setResult] = useState({ encryptedAesKey: '', iv: '', encryptedFilePath: '' })

  const handleEncrypt = async () => {
    setError('')
    setSuccess('')
    setResult({ encryptedAesKey: '', iv: '', encryptedFilePath: '' })
    if (!file) {
      setError('Please select a file to encrypt.')
      return
    }
    try {
      setLoading(true)
      const form = new FormData()
      form.append('file', file)
      const res = await axios.post('/api/files/encrypt', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult({
        encryptedAesKey: res.data.encryptedAesKey,
        iv: res.data.iv,
        encryptedFilePath: res.data.encryptedFilePath,
      })
      setSuccess('File encrypted successfully.')
    } catch (e) {
      const apiErr = e?.response?.data
      setError(apiErr?.error ? `${apiErr.error}${apiErr.details ? `: ${apiErr.details}` : ''}` : 'Encryption failed')
    } finally {
      setLoading(false)
    }
  }

  const encryptedName = result.encryptedFilePath ? String(result.encryptedFilePath).split(/[\\\\/]/).pop() : ''
  const downloadHref = encryptedName ? `http://localhost:5000/${encryptedName}` : ''

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Encrypt File</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <FileUpload label="Choose file" onChange={setFile} />
        <button
          onClick={handleEncrypt}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? 'Encrypting…' : 'Encrypt File'}
        </button>

        {success && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-3">{success}</div>}
        {error && <div className="text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}

        {(result.encryptedAesKey || result.iv) && (
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium text-gray-700">Encrypted AES Key (base64)</div>
              <textarea
                className="w-full mt-1 text-sm p-2 border rounded"
                value={result.encryptedAesKey}
                readOnly
                rows={3}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">IV (base64)</div>
              <input className="w-full mt-1 text-sm p-2 border rounded" value={result.iv} readOnly />
            </div>
          </div>
        )}

        {downloadHref && (
          <FileDownload href={downloadHref} filename={file ? `${file.name}.enc` : undefined}>
            Download Encrypted File
          </FileDownload>
        )}
      </div>
    </div>
  )
}

export default EncryptPage


