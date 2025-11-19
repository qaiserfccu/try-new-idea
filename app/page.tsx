import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
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
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition text-lg"
              >
                Shop Now
              </Link>
              <a
                href="https://gymlab.me"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition text-lg"
              >
                Visit gymlab.me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GymLab?</h2>
            <p className="text-xl text-gray-600">Quality, Innovation, and Excellence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600">
                Olympic-standard equipment designed for professional athletes and training facilities
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Safety First</h3>
              <p className="text-gray-600">
                All products meet international safety standards with rigorous testing protocols
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-6xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600">
                Worldwide shipping with careful handling to ensure your equipment arrives in perfect condition
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <ProductCatalog />

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About GymLab</h2>
              <p className="text-lg text-gray-600 mb-4">
                GymLab is a leading manufacturer of premium gymnastics equipment, dedicated to providing 
                athletes and facilities with the highest quality products for training and competition.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                With decades of experience in the industry, we understand the unique needs of gymnasts 
                and coaches. Our equipment is designed to enhance performance, ensure safety, and withstand 
                the rigors of intensive training.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                From beginner to Olympic level, GymLab has the perfect equipment for every athlete&apos;s journey.
              </p>
              <a
                href="https://gymlab.me"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold"
              >
                Learn More at gymlab.me
              </a>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg p-12 text-white">
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
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-600">Have questions? We&apos;re here to help!</p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition font-semibold text-lg"
              >
                Send Message
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-2">Or reach us directly:</p>
              <p className="text-gray-900 font-semibold">info@gymlab.me</p>
              <p className="text-gray-900 font-semibold">+1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
