import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">GymLab</h3>
            <p className="text-gray-400 mb-4">
              Premium gymnastics equipment manufacturer providing top-quality products for athletes and facilities worldwide.
            </p>
            <a
              href="https://gymlab.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Visit gymlab.me →
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-gray-400 hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition">
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
                <Link href="#products" className="text-gray-400 hover:text-white transition">
                  Gymnastics Mats
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-gray-400 hover:text-white transition">
                  Balance Beams
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-gray-400 hover:text-white transition">
                  Uneven Bars
                </Link>
              </li>
              <li>
                <Link href="#products" className="text-gray-400 hover:text-white transition">
                  Vault Tables
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@gymlab.me</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Fitness Ave</li>
              <li>City, State 12345</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GymLab. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
