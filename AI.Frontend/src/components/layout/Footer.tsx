import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-4 md:py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Assistant. All rights reserved.
          </p>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <a
            href="https://markestella.github.io/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer