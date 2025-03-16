
import React from 'react';

interface LetterheadProps {
  size?: 'a4' | 'a5';
  includeContact?: boolean;
}

export function Letterhead({ size = 'a4', includeContact = true }: LetterheadProps) {
  const logoPath = '/lovable-uploads/e5554b5c-e82d-452f-9a5d-884565624233.png';
  const logoWhitePath = '/lovable-uploads/11948740-df68-471d-91e9-3130754f5342.png';
  
  return (
    <div className={`tayba-letterhead ${size === 'a5' ? 'tayba-letterhead-a5' : ''}`}>
      <img 
        src={logoPath} 
        alt="طيبة المدينة تلكوم" 
        className="logo mx-auto mb-3"
        style={{ maxWidth: size === 'a5' ? '100px' : '150px' }}
      />
      <h1 className="text-center text-primary">طيبة المدينة تلكوم</h1>
      {includeContact && (
        <div className="text-center text-sm text-muted-foreground">
          <p>رقم الهاتف: 22371138 / 41101138</p>
          <p>البريد الإلكتروني: taybaelmedintelecom@gmail.com</p>
        </div>
      )}
    </div>
  );
}

export function PrintHeader({ 
  title, 
  size = 'a4', 
  documentNumber 
}: { 
  title: string; 
  size?: 'a4' | 'a5'; 
  documentNumber?: string; 
}) {
  return (
    <div className="print-header">
      <Letterhead size={size} />
      <div className="mt-4 pb-2 border-b border-gray-300">
        <h2 className="text-xl font-bold text-center">{title}</h2>
        {documentNumber && (
          <p className="text-center text-sm mt-2">رقم المستند: {documentNumber}</p>
        )}
      </div>
    </div>
  );
}
