import React from 'react';
import * as Icons from 'react-icons/md'; // Material Design Icons

interface IconProps {
    icon: string;
    size?: string;
    className?: string;
}

const Icon: React.FC<IconProps> = ({ icon, size, className }) => {
    // Dynamically access icon from 'md' pack, assuming 'icon' is the name like 'MdSearch'
    // But docs say icon="Search".
    // Let's try to map or just use key access if possible, or mapping.
    // For simplicity, I'll default to specific icons or look them up.
    // A robust way is to use a map.

    // Implementation note: The docs imply names like 'Search', 'Add', 'Close', 'ArrowBack', 'Save', 'Edit', 'Delete'.
    // I will map them to Md icons.

    const iconMap: Record<string, React.ComponentType<any>> = {
        Search: Icons.MdSearch,
        Add: Icons.MdAdd,
        Close: Icons.MdClose,
        ArrowBack: Icons.MdArrowBack,
        Save: Icons.MdSave,
        Edit: Icons.MdEdit,
        Delete: Icons.MdDelete,
        SearchOff: Icons.MdSearchOff,
        Check: Icons.MdCheck
    };

    const IconComponent = iconMap[icon] || Icons.MdError;

    return <IconComponent size={size} className={className} />;
};

export default Icon;
