'use client'
import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';



const MeetingSetup = ({ setisSetupComplete }: { setisSetupComplete: (value: boolean) => void }) => {
    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
    const call = useCall();

    if (!call) {
        throw new Error('UseCall must be used within StreamCall component');
    }

    const handleJoinMeeting = () => {
        try {
            call.join();
            setisSetupComplete(true); // Update state to redirect to the Meeting Room
        } catch (error) {
            console.error("Error joining the call: ", error);
        }
    };

    React.useEffect(() => {
        if (isMicCamToggledOn) {
            call?.camera.disable();
            call?.microphone.disable();
        } else {
            call?.camera.enable();
            call?.microphone.enable();
        }
    }, [isMicCamToggledOn, call]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold">Setup</h1>
            <VideoPreview />
            <div className="flex h-16 items-center justify-center gap-3">
                <label className="flex items-center justify-center gap-2 font-medium">
                    <input
                        type="checkbox"
                        checked={isMicCamToggledOn}
                        onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
                    />
                    Join with Camera and Mic Off
                </label>
                <DeviceSettings />
            </div>
            <Button
                className="rounded-md bg-green-500 px-4 py-2.5"
                onClick={handleJoinMeeting}
            >
                Join Meeting
            </Button>
        </div>
    );
};

export default MeetingSetup;
