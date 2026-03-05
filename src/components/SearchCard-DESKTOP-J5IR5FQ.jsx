import { useState } from 'react'

function SearchCard({ onSearch, onLocation }) {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(city)
  }

  return (
    <div className="search-card">
      <form onSubmit={handleSubmit} className="search-form">
        <label htmlFor="cityInput" className="visually-hidden">
          Nome da cidade
        </label>
        <input
          id="cityInput"
          type="text"
          className="search-input"
          placeholder="Digite o nome da cidade..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary">
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="btn-text">Buscar</span>
        </button>
      </form>
      <div className="divider">
        <span className="divider-text">ou</span>
      </div>
      <button type="button" onClick={onLocation} className="btn btn-outline">
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span>Usar Minha Localização</span>
      </button>
    </div>
  )
}

export default SearchCard
