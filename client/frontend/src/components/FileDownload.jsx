import React from 'react'

function FileDownload({ href, filename, children }) {
  if (!href) return null
  return (
    <a
      href={href}
      download={filename}
      className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
    >
      {children || 'Download'}
    </a>
  )
}

export default FileDownload


