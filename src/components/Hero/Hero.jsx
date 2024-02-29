import React from "react";
import Image1 from "../../assets/hero/lbg1.jpg";
import Image2 from "../../assets/hero/ot1.jpg";
import Image3 from "../../assets/hero/mcc1.jpg";
import Slider from "react-slick";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "The Galaxy Long Beach",
    description:
      "The Galaxy Towers condos are located 2999 E Ocean Blvd in Long Beach and is one of the most iconic buildings in the Long Beach area.  Originally built in 1967, the building unique design was revolutionary during it's time",
  },
  {
    id: 2,
    img: Image2,
    title: "The Ocean Towers ",
    description:
      "Ocean Towers in Santa Monica is undisputedly one of the most sought after oceanfront high rise buildings on the entire west coast. Set on the northern end of Ocean Avenue this premier building can be seen from the shores of Malibu all the way down to Palos Verdes. In 2001 Ocean Towers went through a complete renovation and was remodeled from the ground up.",
  },
  {
    id: 3,
    img: Image3,
    title: "Marina City Club",
    description:
      "Marina City Club is home to 600 condominiums and wonderful amenities. These amenities included: Racquet Sports such as Tennis, Paddle Tennis and & Racquet Ball; a Fitness Center with Group Classes and beautiful Lockers home to indoor Jacuzzi, Sauna and steam room; two restaurants, various Social Activites and also Private Events.",
  },
];

const Hero = ({ handleLogoutPopup }) => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200 ">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-pmp_primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold"
                  >
                    {data.title}
                  </h1>
                  <p
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="100"
                    className="text-sm"
                  >
                    {data.description}
                  </p>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                  >
                    <button
                      onClick={handleLogoutPopup}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Login
                    </button>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="rounded-lg w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] mx-auto "
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
