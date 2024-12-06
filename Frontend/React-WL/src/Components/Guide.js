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
                    intro: 'Welcome to your step-by-step guide to have the ultimate vacation'
                },
                {
                    element: '#destinationInput',
                    intro: 'Click the Home tab above to return to the main page, where you can get an overview of all the amazing features and explore what is new.'
                },
                {
                    element: '#getGuideButton',
                    intro: 'Visit the Itineraries tab to browse and find the best travel plans for your next adventure.'
                },
                {
                    element: '#resultDiv',
                    intro: 'Click the Activities tab to explore fun and exciting things to do during your trip.'
                },
                {
                  element: '#resultDiv',
                  intro: 'Click on Locations to browse detailed information about various destinations and find the perfect spot for your next adventure.'
                },
                {
                  element: '#resultDiv',
                  intro: 'And now you are ready for your next trip! Click Done to start!'
                }


            ],
            showStepNumbers: false, // Hide step numbers
            scrollToElement: true // Scroll to elements as needed
        }).start();
    }, []);

    return null; // This component doesn't render anything on its own
};

export default Guide;
