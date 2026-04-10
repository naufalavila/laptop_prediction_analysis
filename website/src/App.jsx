import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [dropdowns, setDropdowns] = useState(null)
  const [form, setForm] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load dropdown options dari file JSON lokal
  useEffect(() => {
    fetch('/dropdowns.json')
      .then(res => res.json())
      .then(data => setDropdowns(data))
      .catch(err => {
        console.error('Gagal load dropdowns:', err)
        setError('Gagal load opsi spek. Pastikan dropdowns.json ada di folder public/')
      })
  }, [])

  // Handle perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target
    const numValue = parseFloat(value)
    setForm(prev => ({
      ...prev,
      [name]: isNaN(numValue) ? value : numValue
    }))
  }

  // Kirim ke backend & terima prediksi
  const handlePredict = async () => {
    // Validasi: semua field harus terisi
    const required = ['Category', 'OS', 'CPU_Tier', 'GPU_Type', 'RAM_GB', 'Screen_Size', 'Storage_GB', 'Weight_KG']
    const missing = required.filter(key => !form[key])
    
    if (missing.length > 0) {
      setError(`Isi dulu: ${missing.join(', ')}`)
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await axios.post('http://localhost:8000/predict', form)
      setResult(res.data.predicted_price)
    } catch (err) {
      setError('Gagal connect ke backend. Pastikan uvicorn jalan di port 8000')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!dropdowns) return (
    <div className="app-shell">
      <main className="page">
        <section className="state-card" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <div className="state-card__content">
            <p className="state-title">Memuat opsi spesifikasi…</p>
            <p className="state-subtitle">Menyiapkan form prediksi laptop.</p>
          </div>
        </section>
      </main>
    </div>
  )

  return (
    <div className="app-shell">
      <main className="page">
        <header className="page-header">
        </header>

        <section className="card">
          <div className="card-header">
            <h1 className="title">Laptop Price Estimator</h1>
            <p className="subtitle">
              Predict Laptop Prices Based on Specs You Input
            </p>
          </div>

          {/* Styling wrapper only; all existing logic remains unchanged */}
          <form
            className="card-body"
            onSubmit={(e) => {
              e.preventDefault()
              handlePredict()
            }}
          >
            <div className="form-grid">
              {/* Kategori */}
              {['Category', 'OS', 'CPU_Tier', 'GPU_Type'].map(field => (
                <div key={field} className="form-group">
                  <label className="label" htmlFor={field}>{field}</label>
                  <div className="control">
                    <select
                      id={field}
                      name={field}
                      onChange={handleChange}
                      value={form[field] || ''}
                      className="select"
                    >
                      <option value="">Pilih {field}</option>
                      {dropdowns[field]?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}

              {/* Angka */}
              {/* {['RAM_GB', 'Screen_Size', 'Storage_GB', 'Weight_KG'].map(field => (
                <div key={field} className="form-group">
                  <label>{field}</label>
                  <input 
                    type="number" 
                    name={field} 
                    onChange={handleChange} 
                    value={form[field] || ''}
                    placeholder={`Masukkan ${field}`}
                    step="0.1"
                  />
                </div>
              ))} */}

              {/* Angka (Dropdown) */}
              {['RAM_GB', 'Screen_Size', 'Storage_GB', 'Weight_KG'].map(field => (
                <div key={field} className="form-group">
                  <label className="label" htmlFor={field}>{field}</label>
                  <div className="control">
                    <select
                      id={field}
                      name={field}
                      onChange={handleChange}
                      value={form[field] !== undefined ? form[field] : ''}
                      className="select"
                    >
                      <option value="">Pilih {field}</option>
                      {dropdowns[field]?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="actions">
              <button onClick={handlePredict} disabled={loading} className="predict-btn">
                <span className="btn-content">
                  {loading && <span className="btn-spinner" aria-hidden="true" />}
                  <span>{loading ? 'Menghitung...' : 'Estimate Here'}</span>
                </span>
              </button>

              <p className="helper">
                Make sure all fields are filled in. The results will appear below in the form of a price estimation.
              </p>
            </div>

            {error && (
              <div className="alert alert--error" role="alert">
                <div className="alert__title">Error Occurred</div>
                <div className="alert__message">{error}</div>
              </div>
            )}

            {result && (
              <div className="result-card" aria-live="polite">
                <div className="result-card__header">
                  <h2 className="result-title">Price Prediction</h2>
                  <p className="result-subtitle">Estimation based on the chosen specs.</p>
                </div>
                <div className="result-card__body">
                  <p className="price">Rp {result.toLocaleString('id-ID')}</p>
                  <p className="result-note">
                    These values ​​are model predictions and may differ from actual market prices.
                  </p>
                </div>
              </div>
            )}
          </form>
        </section>

        <footer className="page-footer">
          <p className="footer-text">
            Primary <span className="dot" aria-hidden="true">•</span> <span className="muted">#454040</span>
            <span className="dot" aria-hidden="true">•</span>
            Accent <span className="dot" aria-hidden="true">•</span> <span className="muted">#605B51</span>
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App