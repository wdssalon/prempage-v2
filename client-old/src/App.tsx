import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fetchHealth, type HealthResponse } from './api/health'

function App() {
  const [count, setCount] = useState(0)
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetchHealth(controller.signal)
      .then((payload) => {
        setHealth(payload)
        setHealthError(null)
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }

        setHealth(null)
        setHealthError(error instanceof Error ? error.message : String(error))
      })

    return () => controller.abort()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((previous) => previous + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>client/src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <section className="card">
        <h2>Backend Health</h2>
        {healthError ? (
          <p>Error fetching health: {healthError}</p>
        ) : health ? (
          <>
            <p>
              Status: <strong>{health.status}</strong>
            </p>
            <p>
              Service: {health.service.name} v{health.service.version}
            </p>
            <p>
              Message: {health.message ?? 'No message provided'}
            </p>
            <p>
              Uptime:{' '}
              {typeof health.uptime_seconds === 'number'
                ? `${health.uptime_seconds.toFixed(1)}s`
                : 'Unavailable'}
            </p>
            <p>
              Timestamp:{' '}
              {health.timestamp
                ? new Date(health.timestamp).toLocaleString()
                : 'No timestamp provided'}
            </p>
          </>
        ) : (
          <p>Loading health information…</p>
        )}
      </section>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
