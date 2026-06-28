import React from 'react'

function MessageCard({message}) {
  return (
    <div className=' py-5 px-10 bg-[#fff9f6] rounded-xl border border-1 border-black w-[25rem]'>
        {message}
    </div>
  )
}

export default MessageCard