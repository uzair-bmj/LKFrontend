import React from 'react';
import useTheme from '../context/theme'; // Import the custom hook

export default function ThemeBtn() {
    const { themeMode, lightTheme, darkTheme } = useTheme();

    return (
        <div className="flex items-center">
            {/* Sun icon for light mode */}
            <i
                className={`fa-solid fa-sun cursor-pointer ${themeMode === 'light' ? 'text-yellow-500' : 'text-gray-400'}`}
                onClick={lightTheme}
                title="Light Mode"
            ></i>

            {/* Moon icon for dark mode */}
            <i
                className={`fa-solid fa-moon cursor-pointer ${themeMode === 'dark' ? 'text-blue-500' : 'text-gray-400'}`}
                onClick={darkTheme}
                title="Dark Mode"
            ></i>
        </div>
    );
}
