import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

async function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.src = url
  })
}

async function getCroppedBlob(imageSrc, pixelCrop) {
  const image  = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const size   = Math.min(pixelCrop.width, pixelCrop.height, 400)
  canvas.width  = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, size, size)

  return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88))
}

export default function AvatarCropper({ imageSrc, onSave, onCancel, loading }) {
  const [crop,        setCrop]        = useState({ x: 0, y: 0 })
  const [zoom,        setZoom]        = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedArea(croppedPixels)
  }, [])

  const handleSave = async () => {
    if (!croppedArea) return
    const blob = await getCroppedBlob(imageSrc, croppedArea)
    onSave(blob)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div dir="rtl" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid #2a2a2a',
      }}>
        <button onClick={onCancel}
          style={{ background: 'none', border: 'none', color: '#a98a7d', fontSize: 15, cursor: 'pointer', fontFamily: 'Inter', fontWeight: 600 }}>
          ביטול
        </button>
        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 17, color: '#ffb693', margin: 0 }}>
          ערוך תמונת פרופיל
        </p>
        <div style={{ width: 48 }} />
      </div>

      {/* Crop area */}
      <div style={{ position: 'relative', flex: 1 }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: '#131313' },
            cropAreaStyle: { border: '3px solid #ff6b00', boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)' },
          }}
        />
      </div>

      {/* Zoom slider */}
      <div dir="rtl" style={{ padding: '20px 24px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="material-symbols-outlined" style={{ color: '#a98a7d', fontSize: 20 }}>zoom_out</span>
        <input
          type="range" min={1} max={3} step={0.05} value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#ff6b00' }}
        />
        <span className="material-symbols-outlined" style={{ color: '#a98a7d', fontSize: 20 }}>zoom_in</span>
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: '#5a4136', margin: '0 0 8px' }}>
        גרור כדי להזיז · הגדל כדי לשנות גודל
      </p>

      {/* Save button */}
      <div style={{ padding: '12px 24px 32px' }}>
        <button onClick={handleSave} disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: loading ? '#353534' : '#ff6b00',
            color: loading ? '#9a8a80' : '#561f00',
            fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(255,107,0,0.4)',
          }}>
          {loading ? 'מעלה תמונה...' : 'הוספה'}
        </button>
      </div>
    </div>
  )
}
