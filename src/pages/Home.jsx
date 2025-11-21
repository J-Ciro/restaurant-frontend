import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Página principal - Landing page profesional del restaurante
 */
function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  // Detectar scroll para efecto parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderNow = () => {
    navigate('/order');
  };

  return (
    <div className="relative w-full bg-background-light dark:bg-background-dark">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-3xl text-primary">restaurant</span>
              <h1 className="text-xl font-bold text-[#181311] dark:text-white">
                Delicious Kitchen
              </h1>
            </div>
            <button
              onClick={handleOrderNow}
              className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition-all"
            >
              Order Now
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section con Parallax */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <img
            src="/smash-burger-que-es.jpg"
            alt="Delicious Burger"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 
            className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            Delicious Kitchen
          </h2>
          <p 
            className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Freshly Made, Just for You
          </p>
          <p 
            className="text-lg mb-10 max-w-2xl mx-auto text-gray-300 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            Experience culinary excellence with our expertly crafted dishes, 
            made with the freshest locally sourced ingredients.
          </p>
          <button
            onClick={handleOrderNow}
            className="bg-primary text-white font-bold px-10 py-4 rounded-xl text-lg shadow-2xl hover:bg-primary/90 hover:scale-105 transition-all animate-fade-in-up"
            style={{ animationDelay: '0.8s' }}
          >
            Order Now
          </button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h3 className="text-4xl md:text-5xl font-bold text-[#181311] dark:text-white mb-4">
              Our Story
            </h3>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-[#896f61] dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              At Delicious Kitchen, we believe in the power of great food to bring people together. 
              Every dish is crafted with passion, using only the finest ingredients to create 
              unforgettable culinary experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Dishes Section */}
      <section className="py-20 bg-background-light dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#181311] dark:text-white mb-4">
              Featured Dishes
            </h3>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-[#896f61] dark:text-gray-400">
              Explore our signature creations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Dish 1 - Burger */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img
                  src="/smash-burger-que-es.jpg"
                  alt="Smash Burger"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold mb-2">Smash Burger</h4>
                    <p className="text-sm text-gray-200">
                      Juicy beef patty with melted cheese, fresh veggies, and our special sauce
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-xl font-bold text-[#181311] dark:text-white">Smash Burger</h4>
                <p className="text-primary font-semibold">$20,000</p>
              </div>
            </div>

            {/* Dish 2 - Pasta */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img
                  src="/pastas-carbonara.webp"
                  alt="Creamy Carbonara"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold mb-2">Creamy Carbonara</h4>
                    <p className="text-sm text-gray-200">
                      Traditional Italian pasta with crispy bacon, eggs, and parmesan
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-xl font-bold text-[#181311] dark:text-white">Creamy Carbonara</h4>
                <p className="text-primary font-semibold">$30,000</p>
              </div>
            </div>

            {/* Dish 3 - Salad */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img
                  src="/Ensalada-pollo-vinagreta-limon.webp"
                  alt="Caesar Salad"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold mb-2">Caesar Salad</h4>
                    <p className="text-sm text-gray-200">
                      Fresh greens with grilled chicken, lemon vinaigrette, and croutons
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-xl font-bold text-[#181311] dark:text-white">Caesar Salad</h4>
                <p className="text-primary font-semibold">$18,000</p>
              </div>
            </div>

            {/* Dish 4 - Pizza */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <img
                  src="/tomato-mozzarella-pizza.webp"
                  alt="Margherita Pizza"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold mb-2">Margherita Pizza</h4>
                    <p className="text-sm text-gray-200">
                      Classic pizza with fresh mozzarella, tomatoes, and basil
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h4 className="text-xl font-bold text-[#181311] dark:text-white">Margherita Pizza</h4>
                <p className="text-primary font-semibold">$28,000</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleOrderNow}
              className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-primary/90 hover:scale-105 transition-all"
            >
              View Full Menu
            </button>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-[#181311] dark:text-white mb-4">
              Expert Culinary Team
            </h3>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-[#896f61] dark:text-gray-400 max-w-3xl mx-auto">
              Our talented chefs bring years of experience and passion to every dish. 
              Trained in the finest culinary traditions, they create exceptional dining experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Chef 1 */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/chef-cooking-kitchen-while-wearing-professional-attire.jpg"
                  alt="Master Chef"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h4 className="text-2xl font-bold mb-2">Expert Culinary Artists</h4>
                    <p className="text-gray-200 mb-4">
                      Our chefs master the art of flavor, combining traditional techniques 
                      with modern innovation to create unforgettable dishes.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">star</span>
                      <span className="text-sm">Michelin-Trained Excellence</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chef 2 */}
            <div className="group">
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/chef-cooking-kitchen-while-wearing-professional-attire (1).jpg"
                  alt="Professional Chef"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h4 className="text-2xl font-bold mb-2">Passionate Professionals</h4>
                    <p className="text-gray-200 mb-4">
                      Dedicated to perfection, our team ensures every meal is crafted 
                      with precision, care, and the finest ingredients.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">restaurant</span>
                      <span className="text-sm">Award-Winning Team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 rounded-xl bg-background-light dark:bg-gray-900 transform hover:scale-105 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">verified</span>
              </div>
              <h4 className="text-xl font-bold text-[#181311] dark:text-white mb-2">
                Certified Excellence
              </h4>
              <p className="text-[#896f61] dark:text-gray-400">
                All our chefs are certified professionals with years of culinary expertise
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-background-light dark:bg-gray-900 transform hover:scale-105 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">eco</span>
              </div>
              <h4 className="text-xl font-bold text-[#181311] dark:text-white mb-2">
                Fresh Ingredients
              </h4>
              <p className="text-[#896f61] dark:text-gray-400">
                We source only the finest local and organic ingredients daily
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-background-light dark:bg-gray-900 transform hover:scale-105 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">favorite</span>
              </div>
              <h4 className="text-xl font-bold text-[#181311] dark:text-white mb-2">
                Made with Love
              </h4>
              <p className="text-[#896f61] dark:text-gray-400">
                Every dish is prepared with passion and attention to detail
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Amazing Food?
          </h3>
          <p className="text-xl mb-10 text-white/90">
            Order now and taste the difference that passion and quality make
          </p>
          <button
            onClick={handleOrderNow}
            className="bg-white text-primary font-bold px-12 py-4 rounded-xl text-lg shadow-2xl hover:bg-gray-100 hover:scale-105 transition-all"
          >
            Order Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#181311] dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-3xl text-primary">restaurant</span>
                <h4 className="text-xl font-bold">Delicious Kitchen</h4>
              </div>
              <p className="text-gray-400">
                Freshly Made, Just for You
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">Phone: +123-423-1261</p>
              <p className="text-gray-400">Email: info@deliciouskitchen.com</p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Hours</h4>
              <p className="text-gray-400 mb-2">Mon - Fri: 11am - 10pm</p>
              <p className="text-gray-400">Sat - Sun: 10am - 11pm</p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Delicious Kitchen. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;