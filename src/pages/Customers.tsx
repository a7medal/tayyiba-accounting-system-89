
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Customers() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">العملاء</h1>
      <Card>
        <CardHeader>
          <CardTitle>إدارة العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <p>سيتم إضافة محتوى صفحة العملاء قريباً</p>
        </CardContent>
      </Card>
    </div>
  );
}
