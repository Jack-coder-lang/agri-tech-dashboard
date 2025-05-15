import React from 'react';

const Card = ({ 
  title, 
  subtitle, 
  children, 
  headerAction, 
  footer,
  className = '',
  contentClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || headerAction) && (
        <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-900">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={`p-4 ${contentClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;