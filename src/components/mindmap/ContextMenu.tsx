import React, { useEffect, useRef } from 'react';

interface ContextMenuItem {
  label: string;
  icon: string;
  action: string;
  disabled?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  onClose: () => void;
  onItemClick: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  items,
  onClose,
  onItemClick,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 画面端での位置調整
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 200),
    y: Math.min(position.y, window.innerHeight - 150),
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px]"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      {items.map((item) => (
        <button
          key={item.action}
          onClick={() => {
            if (!item.disabled) {
              onItemClick(item.action);
              onClose();
            }
          }}
          disabled={item.disabled}
          className={`w-full px-4 py-2 text-left flex items-center space-x-3 hover:bg-pastel-lavender hover:bg-opacity-30 transition-colors ${
            item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-sm text-gray-700">{item.label}</span>
        </button>
      ))}
    </div>
  );
};