import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import TeamCard from './TeamCard';
import { AuthContext } from '../../Helpers/AuthContext';

function Team() {
  const { url } = useContext(AuthContext);
  const [allTeams, setTeams] = useState(null);

  useEffect(() => {
    axios.get(`${url}/teams`).then((response) => {
      if (!response.data.error) {
        setTeams(response.data);
      }
    });
  }, [url]);

  return (
    <div className='flex flex-col justify-center items-center gap-10 py-10'>
      <p className='font-bold text-3xl text-center'>
        HRS Team members
      </p>
      <div className='flex flex-row flex-wrap gap-5 justify-center items-center'>
        {allTeams && allTeams.map((member, i) => (
          <TeamCard member={member} key={i} />
        ))}
      </div>
    </div>
  );
}

export default Team;
