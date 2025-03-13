
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Info } from 'lucide-react';

export function TransferMap() {
  return (
    <div className="space-y-6">
      <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <Info className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-700 dark:text-amber-400">
          هذه الخريطة تمثيلية فقط. في الإصدار النهائي سيتم عرض خريطة تفاعلية حقيقية لتوزيع التحويلات.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">توزيع التحويلات جغرافياً</CardTitle>
          <CardDescription>
            عرض توزيع التحويلات على المناطق المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[500px] w-full border border-border rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            {/* هنا ستكون الخريطة التفاعلية الحقيقية */}
            <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Gaza_Strip_map.svg/800px-Gaza_Strip_map.svg.png')" }}></div>
            
            {/* تمثيل لنقاط التحويل */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className="h-8 w-8 text-red-500" />
                <Badge className="absolute -top-2 -right-2 bg-primary">15</Badge>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs shadow">
                  مدينة غزة
                </div>
              </div>
            </div>
            
            <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className="h-8 w-8 text-blue-500" />
                <Badge className="absolute -top-2 -right-2 bg-primary">8</Badge>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs shadow">
                  خان يونس
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/5 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className="h-8 w-8 text-green-500" />
                <Badge className="absolute -top-2 -right-2 bg-primary">12</Badge>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs shadow">
                  بيت لاهيا
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-1/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className="h-8 w-8 text-purple-500" />
                <Badge className="absolute -top-2 -right-2 bg-primary">10</Badge>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white dark:bg-gray-900 px-2 py-1 rounded text-xs shadow">
                  رفح
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">مدينة غزة</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">$3,200</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">خان يونس</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">$1,800</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">بيت لاهيا</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">$2,500</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">رفح</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">10</div>
                <p className="text-xs text-muted-foreground">$2,100</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
