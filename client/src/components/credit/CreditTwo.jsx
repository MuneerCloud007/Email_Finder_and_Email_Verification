import React, { useState } from 'react';
import { FaCoins } from 'react-icons/fa';

const CreditPoints = ({points,plan}) => {

    return (
        <div className="flex items-center space-x-2 bg-blue-100 p-2 rounded-full shadow-md">
            <FaCoins className="text-yellow-500" />
            <span className="text-sm font-semibold text-gray-800">{points} points</span>
        </div>
    );
};

export default CreditPoints;
