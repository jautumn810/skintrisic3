import SiteHeader from '../../components/SiteHeader'
import { DiamondButton } from '../../components/DiamondNav'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { loadAI } from '../../lib/storage'

function sortScores(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([label, val]) => ({ label, pct: (val * 100).toFixed(2), raw: val }))
}

function ArcMeter({ value = 0.0 }) {
  const size = 720
  const stroke = 18
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = c * value
  const gap = c - dash

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: 740 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#cfcfcf" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#111"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${gap}`}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  )
}

export default function DemographicsPage() {
  const navigate = useNavigate()
  const [ai, setAi] = useState(null)
  const [actualRace, setActualRace] = useState("")
  const [actualAge, setActualAge] = useState("")
  const [actualGender, setActualGender] = useState("")

  useEffect(() => {
    setAi(loadAI())
  }, [])

  const { raceList, ageList, genderList } = useMemo(() => {
    const race = ai?.data?.race ?? {}
    const age = ai?.data?.age ?? {}
    const gender = ai?.data?.gender ?? {}
    return { raceList: sortScores(race), ageList: sortScores(age), genderList: sortScores(gender) }
  }, [ai])

  useEffect(() => {
    if (!actualRace && raceList.length) setActualRace(raceList[0].label)
    if (!actualAge && ageList.length) setActualAge(ageList[0].label)
    if (!actualGender && genderList.length) setActualGender(genderList[0].label)
  }, [raceList, ageList, genderList, actualRace, actualAge, actualGender])

  if (!ai?.data) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader section="INTRO" />
        <div style={{ paddingTop: 180, maxWidth: 980, margin: "0 auto", paddingLeft: 28, paddingRight: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 900 }}>A.I. ANALYSIS</div>
          <div style={{ marginTop: 18, color: "rgba(0,0,0,0.6)" }}>
            No demographics data found yet. Upload an image or take a selfie first.
          </div>
          <button
            type="button"
            onClick={() => navigate("/analysis/image")}
            style={{ marginTop: 18, padding: "10px 14px", background: "#111", color: "#fff", border: "none", fontWeight: 900 }}
          >
            GO TO IMAGE STEP
          </button>
        </div>
      </div>
    )
  }

  const raceTop = raceList[0]
  const confidenceValue = raceTop ? raceTop.raw : 0.0

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader section="INTRO" />

      <div className="dem-wrap" style={{ paddingTop: 140 }}>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.02em" }}>A.I. ANALYSIS</div>
        <div className="dem-h1">DEMOGRAPHICS</div>
        <div className="dem-sub">PREDICTED RACE &amp; AGE</div>

        <div className="dem-cards">
          <div className="dem-card black">
            <div className="topline">{actualRace || "-"}</div>
            <div className="bottomline">RACE</div>
          </div>

          <div className="dem-card">
            <div className="topline" style={{ color: "rgba(0,0,0,0.8)" }}>{actualAge || "-"}</div>
            <div className="bottomline" style={{ color: "rgba(0,0,0,0.85)" }}>AGE</div>
          </div>

          <div className="dem-card">
            <div className="topline" style={{ color: "rgba(0,0,0,0.8)" }}>{(actualGender || "-").toUpperCase()}</div>
            <div className="bottomline" style={{ color: "rgba(0,0,0,0.85)" }}>SEX</div>
          </div>
        </div>

        <div className="dem-arc-block">
          <ArcMeter value={confidenceValue} />
          <div className="dem-arc-instruction">If A.I. estimate is wrong, select the correct one.</div>
        </div>

        <div className="dem-table" style={{ marginTop: 18 }}>
          <div className="dem-table-head">
            <div>RACE</div>
            <div style={{ textAlign: "right" }}>A.I. CONFIDENCE</div>
          </div>

          {raceList.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`dem-row ${actualRace === opt.label ? "selected" : ""}`}
              style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}
              onClick={() => setActualRace(opt.label)}
            >
              <div className="dem-left">
                <div className="dem-radio" />
                <div>{opt.label}</div>
              </div>
              <div className="dem-right">{opt.pct}%</div>
            </button>
          ))}
        </div>

        <div className="dem-table" style={{ marginTop: 18 }}>
          <div className="dem-table-head">
            <div>AGE</div>
            <div style={{ textAlign: "right" }}>A.I. CONFIDENCE</div>
          </div>

          {ageList.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`dem-row ${actualAge === opt.label ? "selected" : ""}`}
              style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}
              onClick={() => setActualAge(opt.label)}
            >
              <div className="dem-left">
                <div className="dem-radio" />
                <div>{opt.label}</div>
              </div>
              <div className="dem-right">{opt.pct}%</div>
            </button>
          ))}
        </div>

        <div className="dem-table" style={{ marginTop: 18 }}>
          <div className="dem-table-head">
            <div>GENDER</div>
            <div style={{ textAlign: "right" }}>A.I. CONFIDENCE</div>
          </div>

          {genderList.map((opt) => (
            <button
              key={opt.label}
              type="button"
              className={`dem-row ${actualGender === opt.label ? "selected" : ""}`}
              style={{ width: "100%", textAlign: "left", border: "none", cursor: "pointer" }}
              onClick={() => setActualGender(opt.label)}
            >
              <div className="dem-left">
                <div className="dem-radio" />
                <div>{opt.label}</div>
              </div>
              <div className="dem-right">{opt.pct}%</div>
            </button>
          ))}
        </div>
      </div>

      <div className="dem-bottom-nav">
        <DiamondButton label="BACK" variant="white" onClick={() => navigate(-1)} />
        <DiamondButton label="HOME" variant="white" onClick={() => navigate("/")} />
      </div>
    </div>
  )
}

