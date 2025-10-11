import React from 'react';
import { useSidebarData } from '../../../hooks';
import { Button } from '../../atoms/Button';

export const SidebarDataManager: React.FC = () => {
  const { 
    user, 
    teams, 
    navMain, 
    updateUser, 
    addTeam, 
    removeTeam, 
    addNavItem, 
    setActiveNavItem 
  } = useSidebarData();

  // Example handlers
  const handleUpdateUser = () => {
    updateUser({
      name: 'Updated User',
      email: 'updated@example.com'
    });
  };

  const handleAddTeam = () => {
    const newTeam = {
      name: 'New Team',
      logo: "FileText" as const, // Use string icon name
      plan: 'New Plan',
      topic: '/new-topic'
    };
    addTeam(newTeam);
  };

  const handleAddNavItem = () => {
    const newNavItem = {
      title: 'Python',
      url: '#',
      icon: "PiDatabaseThin" as const, // Use string icon name
      items: [
        { title: 'Basics', url: '/dashboard/python/basics' },
        { title: 'Advanced', url: '/dashboard/python/advanced' }
      ]
    };
    addNavItem(newNavItem);
  };

  return (
    <div className="p-4 space-y-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold text-lg">Sidebar Data Manager</h3>
      
      <div className="space-y-2">
        <h4 className="font-semibold">Current User:</h4>
        <p className="text-sm">Name: {user.name}</p>
        <p className="text-sm">Email: {user.email}</p>
        <Button size="sm" onClick={handleUpdateUser}>
          Update User
        </Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Teams: {teams.length}</h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddTeam}>
            Add Team
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => removeTeam(teams[teams.length - 1]?.name)}
            disabled={teams.length === 0}
          >
            Remove Last Team
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold">Navigation Items: {navMain.length}</h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAddNavItem}>
            Add Nav Item
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setActiveNavItem('CSS')}
          >
            Set CSS Active
          </Button>
        </div>
      </div>

      <div className="text-xs text-gray-600 mt-4">
        <p>This component demonstrates how to manage sidebar data with Redux.</p>
        <p>All changes are persisted in the Redux store and automatically reflected in the sidebar.</p>
      </div>
    </div>
  );
};