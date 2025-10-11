import React from 'react';
import { useSidebarRedux } from '../../../hooks/useSidebarRedux';

export const SidebarDebug: React.FC = () => {
  const sidebarState = useSidebarRedux();
  
  return (
    <div className="fixed top-4 right-4 bg-red-100 p-4 rounded shadow z-50 text-xs">
      <h3 className="font-bold">Sidebar Debug</h3>
      <div>open: {sidebarState.open ? 'true' : 'false'}</div>
      <div>isMobile: {sidebarState.isMobile ? 'true' : 'false'}</div>
      <div>openMobile: {sidebarState.openMobile ? 'true' : 'false'}</div>
      <button 
        onClick={sidebarState.toggle}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Toggle
      </button>
    </div>
  );
};