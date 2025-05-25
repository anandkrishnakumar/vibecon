'use client';

import { useState } from 'react';

import { Button } from '@mantine/core';

export default function Spin() {
    const [isSpinning, setIsSpinning] = useState(false);

    const handleClick = () => {
        setIsSpinning(!isSpinning);
    };

    return (
        <div className="flex justify-center items-center mt-4">
            <Button 
                variant="filled" 
                color={isSpinning ? 'red' : 'blue'}
                onClick={handleClick} 
                className="mb-4 rounded-lg shadow-lg"
                styles={{
                    root: {
                        '&:hover': {
                            backgroundColor: isSpinning ? '#dc2626' : '#1d4ed8'
                        }
                    }
                }}
            >
                {isSpinning ? 'Stop Spinning' : 'Start Spinning'}
            </Button>
        </div>
    );
}