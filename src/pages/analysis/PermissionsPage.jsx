import SiteHeader from '../../components/SiteHeader'
import { DiamondButton } from '../../components/DiamondNav'
import { useNavigate } from 'react-router-dom'

function Squares() {
  return (
    <div className="ai-squares">
      <div className="ai-square" style={{ "--r": "12deg" }} />
      <div className="ai-square s2" style={{ "--r": "28deg" }} />
      <div className="ai-square s3" style={{ "--r": "44deg" }} />
    </div>
  )
}

export default function PermissionsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader section="INTRO" />

      <div className="ai-wrap">
        <div className="ai-top-row">
          <div className="ai-start-title">TO START ANALYSIS</div>
          <div className="ai-preview">
            <div className="ai-preview-label">Preview</div>
            <div className="ai-preview-box" />
          </div>
        </div>

        <div className="ai-block">
          <Squares />
          <div className="ai-block-inner">
            <img src="/icons/icon-camera.svg" alt="camera" width={180} height={180} className="ai-icon" />
            <div className="ai-label-top">ALLOW A.I.</div>
            <div className="ai-label-bottom">TO SCAN YOUR FACE</div>
          </div>
        </div>

        <div className="ai-block" style={{ marginTop: 140 }}>
          <Squares />
          <div className="ai-block-inner">
            <img src="/icons/icon-gallery.svg" alt="gallery" width={180} height={180} className="ai-icon" />
            <div className="ai-label-top">ALLOW A.I.</div>
            <div className="ai-label-bottom">ACCESS GALLERY</div>
          </div>
        </div>
      </div>

      <div className="back-fixed">
        <DiamondButton label="BACK" variant="white" onClick={() => navigate(-1)} />
      </div>

      <div className="right-fixed">
        <DiamondButton label="PROCEED" variant="black" onClick={() => navigate("/analysis/image")} />
      </div>
    </div>
  )
}

