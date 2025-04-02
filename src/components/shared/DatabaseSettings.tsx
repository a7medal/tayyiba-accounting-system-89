
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Database, Upload, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AppDatabase } from "@/services/DatabaseService";

export function DatabaseSettings() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [dbType, setDbType] = useState<string>('local');

  // التحقق من حالة الاتصال بقاعدة البيانات عند تحميل المكون
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  // التحقق من حالة الاتصال بقاعدة البيانات
  const checkConnectionStatus = () => {
    const connected = AppDatabase.isConnected();
    setIsConnected(connected);
    
    // استرجاع نوع قاعدة البيانات من التخزين المحلي
    const savedDbType = localStorage.getItem('dbType');
    if (savedDbType) {
      setDbType(savedDbType);
    }
  };

  // إنشاء اتصال بقاعدة البيانات
  const handleConnectDb = async () => {
    try {
      const connected = await AppDatabase.connect();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: "تم الاتصال بنجاح",
          description: "تم الاتصال بقاعدة البيانات بنجاح",
        });
      } else {
        toast({
          title: "فشل الاتصال",
          description: "تعذر الاتصال بقاعدة البيانات، يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('خطأ في الاتصال بقاعدة البيانات:', error);
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء محاولة الاتصال بقاعدة البيانات",
        variant: "destructive",
      });
    }
  };

  // قطع الاتصال بقاعدة البيانات
  const handleDisconnectDb = () => {
    try {
      AppDatabase.disconnect();
      setIsConnected(false);
      
      toast({
        title: "تم قطع الاتصال",
        description: "تم قطع الاتصال بقاعدة البيانات بنجاح",
      });
    } catch (error) {
      console.error('خطأ في قطع الاتصال بقاعدة البيانات:', error);
      toast({
        title: "خطأ في قطع الاتصال",
        description: "حدث خطأ أثناء محاولة قطع الاتصال بقاعدة البيانات",
        variant: "destructive",
      });
    }
  };

  // تغيير نوع قاعدة البيانات
  const handleDbTypeChange = (value: string) => {
    setDbType(value);
    localStorage.setItem('dbType', value);
  };

  // تصدير قاعدة البيانات
  const handleExportDatabase = async () => {
    try {
      if (!isConnected) {
        toast({
          title: "غير متصل",
          description: "يرجى الاتصال بقاعدة البيانات أولا",
          variant: "destructive",
        });
        return;
      }
      
      // تصدير البيانات إلى ملف
      const exportData = JSON.stringify(localStorage);
      
      // إنشاء ملف للتنزيل
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // تنظيف
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
      
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير قاعدة البيانات بنجاح",
      });
    } catch (error) {
      console.error('خطأ في تصدير قاعدة البيانات:', error);
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء محاولة تصدير قاعدة البيانات",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          إعدادات قاعدة البيانات
        </CardTitle>
        <CardDescription>
          إدارة خيارات الاتصال بقاعدة البيانات وتخزين البيانات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium">حالة الاتصال</h3>
                <p className="text-sm text-muted-foreground">قاعدة البيانات حاليًا {isConnected ? 'متصلة' : 'غير متصلة'}</p>
              </div>
              <Switch 
                checked={isConnected} 
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleConnectDb();
                  } else {
                    handleDisconnectDb();
                  }
                }} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dbType">نوع قاعدة البيانات</Label>
              <Select value={dbType} onValueChange={handleDbTypeChange}>
                <SelectTrigger id="dbType">
                  <SelectValue placeholder="اختر نوع قاعدة البيانات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">تخزين محلي (Local Storage)</SelectItem>
                  <SelectItem value="indexed">قاعدة بيانات متصفح (IndexedDB)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                التخزين المحلي يتم حفظه في المتصفح ولا يتطلب اتصال بالإنترنت
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-medium">النسخ الاحتياطي والاستعادة</h3>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="justify-start" 
                onClick={handleExportDatabase}
                disabled={!isConnected}
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير قاعدة البيانات
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                disabled={!isConnected}
              >
                <Upload className="ml-2 h-4 w-4" />
                استيراد قاعدة البيانات
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                disabled={!isConnected}
              >
                <RefreshCw className="ml-2 h-4 w-4" />
                إعادة تعيين قاعدة البيانات
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              تنبيه: إعادة التعيين ستمحو جميع البيانات الحالية ولا يمكن التراجع عن هذا الإجراء
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
