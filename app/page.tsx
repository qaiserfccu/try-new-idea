import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="text-white py-20" style={{
        background: `linear-gradient(to right, var(--hero-gradient-from), var(--hero-gradient-to))`
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to GymLab
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Premium Gymnastics Equipment for Athletes and Facilities Worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#products"
                className="px-8 py-4 rounded-full font-semibold transition text-lg"
                style={{ backgroundColor: 'white', color: 'var(--primary)' }}
              >
                Shop Now
              </Link>
              <a
                href="https://gymlab.me"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-full font-semibold transition text-lg"
                style={{ 
                  backgroundColor: 'transparent',
                  border: '2px solid white',
                  color: 'white'
                }}
              >
                Visit gymlab.me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Why Choose GymLab?</h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>Quality, Innovation, and Excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Premium Quality</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Olympic-standard equipment designed for professional athletes and training facilities
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Safety First</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                All products meet international safety standards with rigorous testing protocols
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Fast Delivery</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Worldwide shipping with careful handling to ensure your equipment arrives in perfect condition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <ProductCatalog />

      {/* About Section */}
      <section id="about" className="py-20" style={{ backgroundColor: 'var(--background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>About GymLab</h2>
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                GymLab is a leading manufacturer of premium gymnastics equipment, dedicated to providing 
                athletes and facilities with the highest quality products for training and competition.
              </p>
              <p className="text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                With decades of experience in the industry, we understand the unique needs of gymnasts 
                and coaches. Our equipment is designed to enhance performance, ensure safety, and withstand 
                the rigors of intensive training.
              </p>
              <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
                From beginner to Olympic level, GymLab has the perfect equipment for every athlete&apos;s journey.
              </p>
              <a
                href="https://gymlab.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-full transition font-semibold"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white' 
                }}
              >
                Learn More at gymlab.me
              </a>
            </div>
            
            <div className="rounded-lg p-12 text-white" style={{
              background: `linear-gradient(to bottom right, var(--hero-gradient-from), var(--hero-gradient-to))`
            }}>
              <div className="text-center">
                <div className="text-7xl mb-6">🤸‍♀️</div>
                <h3 className="text-3xl font-bold mb-4">Trusted by Champions</h3>
                <p className="text-lg mb-6">
                  Our equipment is used by professional athletes and training facilities worldwide
                </p>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold">1000+</div>
                    <div className="text-sm">Facilities</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">50+</div>
                    <div className="text-sm">Countries</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">10K+</div>
                    <div className="text-sm">Athletes</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">25+</div>
                    <div className="text-sm">Years</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20" style={{ backgroundColor: 'var(--secondary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Get in Touch</h2>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>Have questions? We&apos;re here to help!</p>
          </div>
          
          <div className="max-w-2xl mx-auto rounded-lg shadow-lg p-8" style={{ backgroundColor: 'var(--card-bg)' }}>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ 
                    border: '1px solid var(--card-border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--text-primary)'
                  }}
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-3 rounded-full transition font-semibold text-lg"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white' 
                }}
              >
                Send Message
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>Or reach us directly:</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>info@gymlab.me</p>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
