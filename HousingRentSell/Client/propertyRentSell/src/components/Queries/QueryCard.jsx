// import React, { useContext } from 'react'
// import { AuthContext } from '../../Helpers/AuthContext';
// import axios from 'axios';
// function QueryCard({ query, user }) {
//     const { setQueries, url } = useContext(AuthContext);
//     const handleQuerySubmit = (e) => {
//         e.preventDefault();
//         const formData = new FormData(e.target);
//         const data = {
//             queryId: query._id,
//             reply: formData.get('reply')
//         }
//         axios.post(`${url}/queryReply`, data, {
//             headers: {
//                 accessMemberToken: localStorage.getItem('accessMemberToken')
//             }
//         }).then((response) => {
//             if (response.data.error) {
//                 console.log(response.data.error);
//             }
//             else {
//                 console.log("replied");
//                 setQueries(response.data);
//             }
//         })
//     }
//     return (
//         <div className='flex h-fit px-5 py-5 rounded-xl mx-auto bg-[#fff9f5] w-[50rem] justify-between'>
//             <div className='w-[45%] flex flex-col gap-5'>
//                 <p className='font-bold text-xl text-center'>{query.from.username}</p>
//                 <p className='font-semibold text-lg text-center'>Query :-</p>
//                 <p className='text-justify overflow-y-scroll h-[10rem] px-3'>{query.query}</p>
//             </div>
//             <div className='w-[45%] flex justify-center items-center'>
//                 {!user ? (
//                     query.reply ?
//                         (
//                             <div className='flex flex-col gap-5 justify-start w-full'>
//                                 <p className='font-bold text-center h-[24px]'>Reply</p>
//                                 <p className='text-justify text-sm overflow-y-scroll h-[10rem] w-full py-4 px-2'>
//                                     {query.reply}
//                                 </p>
//                             </div>
//                         )
//                         :
//                         (
//                             <form onSubmit={handleQuerySubmit} action="POST" className='w-full flex flex-col gap-5'>
//                                 <textarea className='w-full rounded-xl px-3 py-1 border border-1 border-black' rows="8" name="reply" id="reply" placeholder='enter your reply here..'></textarea>
//                                 <button type="Submit" className='bg-black px-5 py-2 font-bold text-white w-full rounded-xl'>Reply</button>
//                             </form>
//                         )
//                 )
//                     :
//                     (
//                         query.reply ?
//                             (
//                                 <div className='flex flex-col gap-5 justify-start w-full'>
//                                     <p className='font-bold text-center h-[24px]'>Reply</p>
//                                     <p className='text-justify text-sm overflow-y-scroll h-[10rem] py-4 px-2'>
//                                         {query.reply}
//                                     </p>
//                                 </div>
//                             )
//                             :
//                             (
//                                 <div className='flex h-fit border-2 border-red-600 text-red-600 rounded px-8 py-4 text-3xl font-bold'>
//                                     Pending
//                                 </div>

//                             )
//                     )
//                 }

//             </div >
//         </div >
//     )
// }

// export default QueryCard



import React, { useContext } from 'react';
import { AuthContext } from '../../Helpers/AuthContext';
import axios from 'axios';

function QueryCard({ query, user }) {
    const { setQueries, url, alertType,
        setAlertType,
        alertMessage,
        setAlertMessage,
        alert,
        setAlert } = useContext(AuthContext);

    const handleQuerySubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            queryId: query._id,
            reply: formData.get('reply')
        };
        axios.post(`${url}/queryReply`, data, {
            headers: {
                accessMemberToken: localStorage.getItem('accessMemberToken')
            }
        }).then((response) => {
            if (response.data.error) {
                setAlert(true)
                setAlertType("error")
                setAlertMessage(response.data.error);
            } else {
                setQueries(response.data);
            }
        });
    };

    return (
        <div className="flex flex-col lg:flex-row h-fit px-5 py-5 gap-2 rounded-xl mx-auto bg-[#fff9f5] w-full lg:w-[50rem] justify-between">
            {/* Left Section - Query Info */}
            <div className="w-full lg:w-[45%] flex flex-col gap-5">
                <p className="font-bold text-xl text-center">{query.from.username}</p>
                <p className="font-semibold text-lg text-center">Query:</p>
                <p className="text-justify overflow-y-auto h-fit border border-1 border-black px-3">{query.query}</p>
            </div>

            {/* Right Section - Reply */}
            <div className="w-full lg:w-[45%] flex justify-center items-center">
                {!user ? (
                    query.reply ? (
                        <div className="flex flex-col gap-5 h-fit w-full">
                            <p className="font-bold text-center h-[24px]">Reply</p>
                            <p className="text-justify text-sm overflow-y-auto w-full border border-1 border-black h-fit py-4 px-2">
                                {query.reply}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleQuerySubmit} action="POST" className="w-full flex flex-col gap-5">
                            <textarea className="w-full rounded-xl px-3 py-1 border border-1 border-black" rows="8" name="reply" id="reply" placeholder="enter your reply here..."></textarea>
                            <button type="Submit" className="bg-black px-5 py-2 font-bold text-white w-full rounded-xl">Reply</button>
                        </form>
                    )
                ) : query.reply ? (
                    <div className="flex flex-col gap-5 w-full h-fit">
                        <p className="font-bold text-center h-[24px]">Reply</p>
                        <p className="text-justify text-sm overflow-y-auto w-full h-fit py-2 px-2 border border-1 border-black">
                            {query.reply}
                        </p>
                    </div>
                ) : (
                    <div className="flex h-fit border-2 border-red-600 text-red-600 rounded px-8 py-4 text-3xl font-bold">
                        Pending
                    </div>
                )}
            </div>
        </div>
    );
}

export default QueryCard;
