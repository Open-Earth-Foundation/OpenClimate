export const handleImageSrc = (rawImage) => {
  let bytes = new Uint8Array(rawImage)
  bytes = Buffer.from(rawImage).toString('base64')

  // Check the MIME type
  let result = null
  if (atob(bytes).charAt(0) === 'i')
    result = `data:image/png;base64,${atob(bytes)}`
  else if (atob(bytes).charAt(0) === '/')
    result = `data:image/jpeg;base64,${atob(bytes)}`
  else if (atob(bytes).charAt(0) === 'R')
    result = `data:image/gif;base64,${atob(bytes)}`
  else if (atob(bytes).charAt(0) === 'U')
    result = `data:image/webp;base64,${atob(bytes)}`
  else result = atob(bytes)
  return result
}

// Format seconds
export function formatSeconds(secs) {
  function pad(n) {
    return n < 10 ? '0' + n : n
  }

  var h = Math.floor(secs / 3600)
  var m = Math.floor(secs / 60) - h * 60
  var s = Math.floor(secs - h * 3600 - m * 60)

  // return pad(h) +":"+ pad(m) +":"+ pad(s);
  return pad(m) + ':' + pad(s)
}
