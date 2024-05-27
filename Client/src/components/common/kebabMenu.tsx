import React, { useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

interface KebabMenuProps {
    options: { name: string, callback: () => void }[];
}

const KebabMenu: React.FC<KebabMenuProps> = ({ options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const modelRef = useRef<HTMLDivElement>(null);
    useClickOutside(modelRef, () => setIsOpen(false));

    return (
        <div className="relative inline-block text-left " ref={modelRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}

                className="inline-flex justify-center w-full rounded-md text-lg shadow-sm px-4 py-2 bg-inherit font-medium text-gray-700 focus:outline-none"
            >
                &#8942;
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    option.callback();
                                    setIsOpen(false);
                                }}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                role="menuitem"
                            >
                                {option.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default KebabMenu;
