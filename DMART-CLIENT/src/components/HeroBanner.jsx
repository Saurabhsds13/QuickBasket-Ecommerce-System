import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[#F4F9F6]">
      {/* Decorative Wave Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-[rgba(76,175,80,0.1)] to-transparent 
        [mask-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 1440 320\\'><path fill=\\'black\\' d=\\'M0,192L80,170.7C160,149,320,107,480,117.3C640,128,800,192,960,208C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z\\'></path></svg>')] 
        [mask-repeat:no-repeat] [mask-position:bottom] pointer-events-none"
      ></div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side Text */}
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-black text-gray-800 leading-tight mb-4">
              Fresh Groceries, Delivered Fast
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Get your favorite groceries delivered to your doorstep in minutes.
              Enjoy the convenience of shopping from home with our wide
              selection of fresh produce, pantry staples, and more.
            </p>
            <button
              className="flex items-center justify-center bg-[#4CAF50] text-white font-bold text-lg rounded-lg py-3 px-8 hover:bg-opacity-90 transition-all duration-300 shadow-lg"
              onClick={() => navigate("/AllProducts")}
            >
              <span>Shop Now</span>
              <span className="material-symbols-outlined ml-2">
                arrow_forward
              </span>
            </button>
          </div>

          {/* Right Side Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              alt="Grocery delivery basket"
              className="w-full max-w-md rounded-lg shadow-2xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOMy2E0D-GlXUwEeux61kwEWoCcAhWEnNAtpj01amUmZ6EXn1Rb1R2NYmOxnGOQyalfLrWhvJHXiUdVoupNw9APPGekD4awEdjshA2qLm8jUExv1s0EgIbF5ylYoUf4h6-LaRKofkyNEyxoohYuNoNEFEM6d52njIAzQz-eOISzDn0oGG1JjXF9U733J4h2wiJaz_f-Jurly5rUygqMRjmY1sBBhUUo0TKmE_ornt33kxDJwfeOZS3u_o7KpSoWKJ5zy9tNhFNQq6m"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
