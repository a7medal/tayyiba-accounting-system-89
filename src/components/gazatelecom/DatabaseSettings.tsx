
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatabaseService } from './services/DatabaseService';
import { SQLiteService } from './services/SQLiteService';
import { Database, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function DatabaseSettings() {
  const [dbType, setDbType] = useState<string>(localStorage.getItem('dbType') || 'sqlite');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsConnected(DatabaseService.isConnected());
  }, []);

  const handleDbTypeChange = (value: string) => {
    setDbType(value);
    localStorage.setItem('dbType', value);
    
    // إعادة تحميل الصفحة لتطبيق التغييرات
    toast({
      title: "تم تغيير نوع قاعدة البيانات",
      description: "سيتم إعادة تحميل الصفحة لتطبيق التغييرات...",
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      const connected = await DatabaseService.connect();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: "تم الاتصال بنجاح",
          description: "تم الاتصال بقاعدة البيانات بنجاح",
        });
      } else {
        toast({
          title: "فشل الاتصال",
          description: "تعذر الاتصال بقاعدة البيانات",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("خطأ في الاتصال:", error);
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء محاولة الاتصال بقاعدة البيانات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    DatabaseService.disconnect();
    setIsConnected(false);
    toast({
      title: "تم قطع الاتصال",
      description: "تم قطع الاتصال بقاعدة البيانات بنجاح",
    });
  };

  const handleExportDatabase = async () => {
    if (dbType === 'sqlite') {
      try {
        setIsLoading(true);
        const data = await SQLiteService.exportDatabase();
        
        if (data) {
          // إنشاء ملف للتنزيل
          const blob = new Blob([data], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gazatelecom_${new Date().toISOString().split('T')[0]}.db`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast({
            title: "تم تصدير قاعدة البيانات",
            description: "تم تصدير قاعدة البيانات بنجاح",
          });
        } else {
          throw new Error("لا توجد بيانات للتصدير");
        }
      } catch (error) {
        console.error("خطأ في تصدير قاعدة البيانات:", error);
        toast({
          title: "خطأ في التصدير",
          description: "حدث خطأ أثناء محاولة تصدير قاعدة البيانات",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "غير متاح",
        description: "تصدير قاعدة البيانات متاح فقط لقاعدة بيانات SQLite",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          إعدادات قاعدة البيانات
        </CardTitle>
        <CardDescription>
          إدارة اتصال وإعدادات قاعدة البيانات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="db-type">نوع قاعدة البيانات</Label>
          <Select value={dbType} onValueChange={handleDbTypeChange}>
            <SelectTrigger id="db-type">
              <SelectValue placeholder="اختر نوع قاعدة البيانات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">التخزين المحلي (للتجربة فقط)</SelectItem>
              <SelectItem value="sqlite">SQLite (موصى به)</SelectItem>
              <SelectItem value="remote">خادم بعيد (قريبًا)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p>{isConnected ? 'متصل' : 'غير متصل'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          {isConnected ? (
            <Button 
              variant="outline" 
              onClick={handleDisconnect}
              disabled={isLoading}
            >
              قطع الاتصال
            </Button>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isLoading}
              className="gap-1"
            >
              {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
              الاتصال بقاعدة البيانات
            </Button>
          )}
        </div>
        
        {dbType === 'sqlite' && (
          <Button 
            variant="secondary" 
            onClick={handleExportDatabase}
            disabled={isLoading || !isConnected}
            className="gap-1"
          >
            <Download className="h-4 w-4" />
            تصدير قاعدة البيانات
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
