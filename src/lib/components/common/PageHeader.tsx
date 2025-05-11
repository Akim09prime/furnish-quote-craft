
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-200 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {children && <div className="mt-4 md:mt-0 space-x-2">{children}</div>}
    </div>
  );
};

export default PageHeader;
