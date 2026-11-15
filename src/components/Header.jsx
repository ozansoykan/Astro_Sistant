import './Header.css'

function Logo() {
  return (
    <svg className="header-logo" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="7" fill="currentColor" />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        transform="rotate(-25 16 16)"
      />
    </svg>
  )
}

function Header({ search, onSearchChange }) {
  return (
    <header className="header">
      <div className="header-inner">
        <a className="header-brand" href="/">
          <Logo />
          <span className="header-name">AstroSistant</span>
        </a>

        <input
          className="header-search"
          type="search"
          placeholder="Search astronauts or craft..."
          aria-label="Search astronauts"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  )
}

export default Header
