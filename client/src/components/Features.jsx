import React from "react";
import { Truck, Lock, RotateCcw, Clock } from "lucide-react";

const features = [
  { icon: Truck, text: "Free Shipping", subtext: "On orders over $100" },
  { icon: Lock, text: "Secure Payment", subtext: "100% protected payments" },
  { icon: RotateCcw, text: "Easy Returns", subtext: "30-day return policy" },
  { icon: Clock, text: "24/7 Support", subtext: "Dedicated customer service" },
];
const Features = () => {
  return (
    <div className="bg-gray-100 py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <feature.icon
                  className="shrink-0 h-8 w-8 md:h-10 md:w-10 text-gray-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm md:text-base font-medium text-gray-900">
                    {feature.text}
                  </p>
                  <p className="mt-1 text-xs md:text-sm text-gray-500">
                    {feature.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Features;
