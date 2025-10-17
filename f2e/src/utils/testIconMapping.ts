// Test icon mapping utility
import type { IconName } from '../store/slices/sidebarDataSlice';

export const testIconMapping = () => {
  console.log('🧪 Testing Icon Mapping...');
  
  const availableIcons: IconName[] = [
    'Home', 'FileText', 'Contact', 'FileStack', 'FileVideo2',
    'FaNodeJs', 'FaReact', 'TbFileTypeCss', 'GrHtml5', 'PiDatabaseThin'
  ];
  
  const testCases = [
    'html', 'HTML', 'Html5', 'GrHtml5',
    'css', 'CSS', 'TbFileTypeCss',
    'javascript', 'js', 'react', 'FaReact',
    'nodejs', 'node', 'FaNodeJs',
    'database', 'db', 'PiDatabaseThin',
    'home', 'Home',
    'file', 'FileText',
    'video', 'FileVideo2',
    'course', 'FileStack',
    'contact', 'Contact',
    'unknown-icon'
  ];
  
  console.log('Available IconName types:', availableIcons);
  console.log('Testing icon strings:');
  
  testCases.forEach(iconString => {
    // This is a simplified version of the mapping logic
    const iconMap: Record<string, IconName> = {
      'home': 'Home',
      'filetext': 'FileText',
      'contact': 'Contact',
      'filestack': 'FileStack',
      'filevideo2': 'FileVideo2',
      'fanodejs': 'FaNodeJs',
      'fareact': 'FaReact',
      'tbfiletypecss': 'TbFileTypeCss',
      'grhtml5': 'GrHtml5',
      'pidatabasethin': 'PiDatabaseThin',
      'file': 'FileText',
      'courses': 'FileStack',
      'video': 'FileVideo2',
      'nodejs': 'FaNodeJs',
      'react': 'FaReact',
      'css': 'TbFileTypeCss',
      'html': 'GrHtml5',
      'database': 'PiDatabaseThin',
      'js': 'FaReact',
      'javascript': 'FaReact',
    };
    
    const lowerIcon = iconString.toLowerCase();
    const cleanIcon = lowerIcon.replace(/[-_\s]/g, '');
    const result = iconMap[iconString] || iconMap[lowerIcon] || iconMap[cleanIcon] || 'FileText';
    
    console.log(`"${iconString}" → ${result}`);
  });
  
  return { availableIcons, testCases };
};

// Export for browser console testing
declare global {
  interface Window {
    testIconMapping?: typeof testIconMapping;
  }
}

if (typeof window !== 'undefined') {
  window.testIconMapping = testIconMapping;
}