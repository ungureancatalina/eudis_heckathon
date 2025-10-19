import React, { useEffect, useState } from 'react';

interface TypingTextProps {
    text: string;
    speed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 80 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                i = 0;
                setDisplayedText('');
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return <span style={{ fontFamily: "'Orbitron', monospace", letterSpacing: '2px', fontSize: '48px', color: '#d9ec2f' }}>
        {displayedText}<span style={{opacity: 0.5}}>|</span></span>;
};

export default TypingText;
