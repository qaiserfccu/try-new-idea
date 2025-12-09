import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="glass-dark border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">ChiltanPure</h3>
            <p className="text-purple-200 mb-4">
              Pakistan&apos;s leading e-commerce store for organic and natural products. ISO-certified quality you can trust.
            </p>
            <a
              href="https://chiltanpure.com?bg_ref=XEUldZfjcO"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Visit chiltanpure.com →
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-purple-200 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-purple-200 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-purple-200 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-purple-200 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#products" className="text-purple-200 hover:text-white transition">
                  Skincare
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-purple-200 hover:text-white transition">
                  Haircare
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-purple-200 hover:text-white transition">
                  Essential Oils
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-purple-200 hover:text-white transition">
                  Food & Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2 text-purple-200">
              <li>Email: info@chiltanpure.com</li>
              <li>Phone: +92 (300) 123-4567</li>
              <li>Address: Lahore, Pakistan</li>
              <li>COD Available Nationwide</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-purple-300">
          <p>&copy; {new Date().getFullYear()} ChiltanPure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
