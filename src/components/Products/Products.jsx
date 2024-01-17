import React from "react";
import Img1 from "../../assets/product/app1.jpg";
import Img2 from "../../assets/product/app2.jpg";
import Img3 from "../../assets/product/app3.jpg";
import Img4 from "../../assets/product/syslist.jpg";
import Img5 from "../../assets/product/sysdtl.jpg";
import { FaStar } from "react-icons/fa6";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "PMP App Login",
    rating: 5.0,
    color: "white",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img2,
    title: "Users Home Page",
    rating: 4.5,
    color: "Red",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img3,
    title: "List of users properties",
    rating: 4.7,
    color: "brown",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img4,
    title: "Systems View",
    rating: 4.4,
    color: "Yellow",
    aosDelay: "200",
  },
  {
    id: 5,
    img: Img5,
    title: "Systems Detail",
    rating: 4.5,
    color: "Pink",
    aosDelay: "0",
  },
];

const Products = () => {
  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            About the PMP Mobile App....
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            PMP Mobile App
          </h1>
          <p data-aos="fade-up" className="text-xs text-gray-400">
            Information about PMP Properties in the palm of your hand. Get the
            app to see easy it is to view, edit and audit the informatoin that's
            important to you.
          </p>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                key={data.id}
                className="space-y-3"
              >
                <img
                  src={data.img}
                  alt=""
                  className="h-[400px] object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{data.title}</h3>
                  {/* <p className="text-sm text-gray-600">{data.color}</p>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{data.rating}</span>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center">
            <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
              View All Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
