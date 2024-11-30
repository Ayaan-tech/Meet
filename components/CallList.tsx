'use client';
import { useGetCalls } from '@/hooks/useGetCalls';
import { CallRecording, Call } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import MeetingCard from './MeetingCard';

const CallList = ({ type }: { type: 'ended' | 'upcoming' | 'recordings' }) => {
    const router = useRouter();
    const { endedcalls, upcomingCalls, callrecordings } = useGetCalls(); // Removed `isLoading` as it wasn't used
    const [recordings, setRecordings] = useState<CallRecording[]>([]);

    const getCalls = () => {
        switch (type) {
            case 'ended':
                return endedcalls;
            case 'upcoming':
                return upcomingCalls;
            case 'recordings':
                return recordings;
            default:
                return [];
        }
    };

    const getNoCalls = () => {
        switch (type) {
            case 'ended':
                return 'No Previous Calls';
            case 'upcoming':
                return 'No Upcoming Calls';
            case 'recordings':
                return 'No Recordings';
            default:
                return '';
        }
    };

    useEffect(() => {
        const fetchRecordings = async () => {
            if (!callrecordings) return;

            const callData = await Promise.all(
                callrecordings.map((meeting) => meeting.queryRecordings?.())
            );

            const filteredRecordings = callData
                .filter((call) => call?.recordings?.length > 0)
                .flatMap((call) => call.recordings);

            setRecordings(filteredRecordings);
        };

        if (type === 'recordings') {
            fetchRecordings();
        }
    }, [type, callrecordings]);

    const calls = getCalls();
    const nocalls = getNoCalls();

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
            {calls && calls.length > 0 ? (
                calls.map((meeting: Call | CallRecording, index) => (
                    <MeetingCard
                        key={(meeting as Call).id || (meeting as CallRecording).start_time || index}
                        icon={
                            type === 'ended'
                                ? '/icons/previous.svg'
                                : type === 'upcoming'
                                ? '/icons/upcoming.svg'
                                : '/icons/recordings.svg'
                        }
                        title={
                            (meeting as Call).state?.custom?.description ||
                            (meeting as CallRecording).filename?.substring(0, 20) ||
                            'No Description'
                        }
                        date={
                            (meeting as Call).state?.startsAt?.toLocaleString() ||
                            (meeting as CallRecording).start_time?.toLocaleString()
                        }
                        isPreviousMeeting={type === 'ended'}
                        link={
                            type === 'recordings'
                                ? (meeting as CallRecording).url
                                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                        }
                        buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                        buttonText={type === 'recordings' ? 'Play' : 'Start'}
                        handleClick={
                            type === 'recordings'
                                ? () => router.push(`${(meeting as CallRecording).url}`)
                                : () => router.push(`/meeting/${(meeting as Call).id}`)
                        }
                    />
                ))
            ) : (
                <h1 className='text-2xl font-bold text-white'>{nocalls}</h1>
            )}
        </div>
    );
};

export default CallList;
