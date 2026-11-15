import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-team">Verge</span>
        <span className="footer-copy">© {new Date().getFullYear()} Verge. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer
