import React from 'react'
import NavBar from '../components/navBar';
import Front from '../components/AboutUs/Front';
import Stats from '../components/home/Stats';
import FounderNote from '../components/AboutUs/FounderNote';
import Team from '../components/AboutUs/Team';
import Footer from '../components/footer';
function AboutUs() {
  return (
    <div className='bg-[#ffffff]'>
      <div className='container mx-auto px-4'>
        <Front />
        <Stats />
        <FounderNote />
        <Team />
      </div>
    </div>
  );
}

export default AboutUs;
