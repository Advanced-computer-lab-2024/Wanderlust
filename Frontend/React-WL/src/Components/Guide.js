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
                    intro: 'In the home tab you where you land when you first visit,it’s designed to give you a warm welcome and help you easily find what you’re looking for.'
                },
                {
                    element: '#getGuideButton',
                    intro: 'The Itineraries page is where you can explore various travel plans and packages to help you organize your trips and make the most out of your visit.'
                },
                {
                    element: '#resultDiv',
                    intro: 'The Activities page is where you can discover and explore various fun and exciting things to do during your visit.'
                },
                {
                  element: '#resultDiv',
                  intro: 'The Locations page is your gateway to discovering amazing places to visit and explore on your trip!'
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
