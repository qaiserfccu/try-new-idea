import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-900 via-green-700 to-emerald-600 text-white py-20 overflow-hidden shader-effect">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              Welcome to ChiltanPure
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-purple-100">
              Organic & Natural Products for Your Health, Beauty, and Wellness
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#products"
                className="glass px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition text-lg"
              >
                Shop Now
              </Link>
              <a
                href="https://chiltanpure.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-dark border-2 border-purple-300 text-white px-8 py-4 rounded-full font-semibold hover:bg-purple-500/30 transition text-lg"
              >
                Visit chiltanpure.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose ChiltanPure?</h2>
            <p className="text-xl text-purple-200">100% Organic, ISO Certified, Trusted by Thousands</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl text-center p-6 hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">🌿</div>
              <h3 className="text-2xl font-bold mb-3 text-white">100% Organic</h3>
              <p className="text-purple-200">
                All products are ISO-certified organic with no synthetic additives or harmful chemicals
              </p>
            </div>
            
            <div className="glass-card rounded-2xl text-center p-6 hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Premium Quality</h3>
              <p className="text-purple-200">
                Over 1,500 unique products tested for quality and effectiveness by thousands of satisfied customers
              </p>
            </div>
            
            <div className="glass-card rounded-2xl text-center p-6 hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Fast Delivery & COD</h3>
              <p className="text-purple-200">
                Nationwide shipping with Cash on Delivery option. Order with confidence and convenience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <ProductCatalog />

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-4xl font-bold text-white mb-6">About ChiltanPure</h2>
              <p className="text-lg text-purple-200 mb-4">
                ChiltanPure is Pakistan&apos;s leading e-commerce store for organic and natural products, 
                dedicated to providing customers with the highest quality skincare, haircare, essential oils, 
                and wellness products.
              </p>
              <p className="text-lg text-purple-200 mb-4">
                With over 1,500 unique products, we are ISO-certified and committed to using only natural 
                ingredients without synthetic additives. Our mission is to promote healthy living through 
                organic and sustainable products.
              </p>
              <p className="text-lg text-purple-200 mb-6">
                From beauty essentials to health supplements, ChiltanPure has everything you need for a 
                natural and healthy lifestyle.
              </p>
              <a
                href="https://chiltanpure.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block purple-gradient text-white px-8 py-3 rounded-full hover:opacity-90 transition font-semibold"
              >
                Learn More at chiltanpure.com
              </a>
            </div>
            
            <div className="glass-card rounded-2xl shader-effect p-12 text-white">
              <div className="text-center">
                <div className="text-7xl mb-6">🌿</div>
                <h3 className="text-3xl font-bold mb-4">Trusted by Thousands</h3>
                <p className="text-lg mb-6 text-purple-100">
                  Our organic products are loved by customers across Pakistan and beyond
                </p>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold">1500+</div>
                    <div className="text-sm text-purple-200">Products</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">ISO</div>
                    <div className="text-sm text-purple-200">Certified</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">5000+</div>
                    <div className="text-sm text-purple-200">Reviews</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">100%</div>
                    <div className="text-sm text-purple-200">Organic</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-xl text-purple-200">Have questions? We&apos;re here to help!</p>
          </div>
          
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-300"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full purple-gradient text-white px-8 py-3 rounded-full hover:opacity-90 transition font-semibold text-lg"
              >
                Send Message
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-purple-200 mb-2">Or reach us directly:</p>
              <p className="text-white font-semibold">info@chiltanpure.com</p>
              <p className="text-white font-semibold">+92 (300) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
