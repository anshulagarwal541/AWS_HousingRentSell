// import React from 'react'

// function Boxes({image, text}) {
    
//   return (
    
//     <div className='bg-[#fbeee6] p-10 rounded-2xl w-1/2 flex flex-col gap-10'>
//         <img src={image} alt="" className='w-1/6' />
//         <p className='font-bold text-2xl'>
//             {text}
//         </p>
//     </div>
//   )
// }

// export default Boxes;


import React from 'react';

function Boxes({ image, text }) {
  return (
    <div className='bg-[#fbeee6] p-6 sm:p-8 md:p-10 rounded-2xl w-full sm:w-3/4 md:w-1/2 flex flex-col gap-6 sm:gap-8 md:gap-10 items-center'>
      <img src={image} alt="Box Image" className='w-1/4 sm:w-1/6' />
      <p className='font-bold text-lg sm:text-xl md:text-2xl text-center'>
        {text}
      </p>
    </div>
  );
}

export default Boxes;
