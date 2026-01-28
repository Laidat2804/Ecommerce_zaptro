import React from "react";
import Carousel from "../components/Carousel";
import MidBanner from "../components/MidBanner";
import Features from "../components/Features";
import { useAOS } from "../hooks/useAOS";

const Home = () => {
  useAOS();

  return (
    <div>
      <Carousel />
      <MidBanner />
      <Features />
    </div>
  );
};

export default Home;
