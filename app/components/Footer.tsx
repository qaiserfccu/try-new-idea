import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--text-primary)', color: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary)' }}>GymLab</h3>
            <p className="mb-4 opacity-75">
              Premium gymnastics equipment manufacturer providing top-quality products for athletes and facilities worldwide.
            </p>
            <a
              href="https://gymlab.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
              style={{ color: 'var(--primary)' }}
            >
              Visit gymlab.me →
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="opacity-75 hover:opacity-100 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#products" className="opacity-75 hover:opacity-100 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#about" className="opacity-75 hover:opacity-100 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="opacity-75 hover:opacity-100 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#products" className="opacity-75 hover:opacity-100 transition">
                  Gymnastics Mats
                </Link>
              </li>
              <li>
                <Link href="#products" className="opacity-75 hover:opacity-100 transition">
                  Balance Beams
                </Link>
              </li>
              <li>
                <Link href="#products" className="opacity-75 hover:opacity-100 transition">
                  Uneven Bars
                </Link>
              </li>
              <li>
                <Link href="#products" className="opacity-75 hover:opacity-100 transition">
                  Vault Tables
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 opacity-75">
              <li>Email: info@gymlab.me</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Fitness Ave</li>
              <li>City, State 12345</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center opacity-75" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p>&copy; {new Date().getFullYear()} GymLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
