import React, { useEffect } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css'; // Import the CSS for styling

const Guide = () => {
    useEffect(() => {
        // Initialize the guide
        introJs().setOptions({
            steps: [
                {
                    element: '#userIdInput',
                    intro: 'Enter your User ID to get started.'
                },
                {
                    element: '#destinationInput',
                    intro: 'Enter the destination of your vacation.'
                },
                {
                    element: '#getGuideButton',
                    intro: 'Click this button to view your vacation guide.'
                },
                {
                    element: '#resultDiv',
                    intro: 'Here you will see the step-by-step guide for your vacation.'
                }
            ],
            showStepNumbers: false, // Hide step numbers
            scrollToElement: true // Scroll to elements as needed
        }).start();
    }, []);

    return null; // This component doesn't render anything on its own
};

export default Guide;
