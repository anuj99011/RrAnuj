/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import MatchPredictor from './components/MatchPredictor';

export default function App() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] py-12 px-4 selection:bg-rr-pink selection:text-white">
      {/* Subtle texture or grid background could go here */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#1B224E 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} 
      />
      
      <main className="relative z-10">
        <MatchPredictor />
      </main>
    </div>
  );
}

