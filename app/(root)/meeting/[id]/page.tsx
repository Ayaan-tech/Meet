'use client'
import React from 'react'
import {useUser} from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import MeetingSetup from '@/components/MeetingSetup'
import MeetingRoom from '@/components/MeetingRoom'
import { useGetCallById } from '@/hooks/useGetCallById'
import Loader from '@/components/Loader'
import { useParams } from 'next/navigation'
const Meeting = ({params} : {params : { id:string } }) => {
  const { id} = useParams();
  const {user , isLoaded} = useUser();
  const [isSetupComplete, setisSetupComplete  ] = React.useState(false);
  const {call ,isCallLoading} = useGetCallById(id || '');

  if(!isLoaded || isCallLoading) return <Loader/>
  return (
   <main className='h-screen w-full'>
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup setisSetupComplete={setisSetupComplete}/>
        ):(
          <MeetingRoom/>
        )}
      </StreamTheme>
    </StreamCall>
   </main>
  )
}

export default Meeting
