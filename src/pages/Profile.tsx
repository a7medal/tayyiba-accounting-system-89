
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/users/UserProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Lock, UserCog } from 'lucide-react';

export default function Profile() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الملف الشخصي</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الملف الشخصي</CardTitle>
              <CardDescription>
                قم بإدارة معلومات ملفك الشخصي هنا
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfile />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الأمان</CardTitle>
              <CardDescription>
                إدارة إعدادات الأمان وكلمة المرور
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-medium">تغيير كلمة المرور</h3>
                  <p className="text-sm text-muted-foreground">
                    ننصح بتغيير كلمة المرور بشكل دوري للحفاظ على أمان حسابك
                  </p>
                </div>
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      كلمة المرور الحالية
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      كلمة المرور الجديدة
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className="h-10 px-3 py-2 rounded-md border border-input bg-background"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    حفظ التغييرات
                  </button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                تحكم في كيفية استلام الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2 space-x-reverse">
                  <div className="flex flex-col">
                    <span className="font-medium">إشعارات البريد الإلكتروني</span>
                    <span className="text-sm text-muted-foreground">
                      استلام إشعارات عبر البريد الإلكتروني
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between space-x-2 space-x-reverse">
                  <div className="flex flex-col">
                    <span className="font-medium">إشعارات داخل التطبيق</span>
                    <span className="text-sm text-muted-foreground">
                      عرض الإشعارات داخل التطبيق
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between space-x-2 space-x-reverse">
                  <div className="flex flex-col">
                    <span className="font-medium">إشعارات العمليات المالية</span>
                    <span className="text-sm text-muted-foreground">
                      إشعارات حول المعاملات المالية والفواتير
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between space-x-2 space-x-reverse">
                  <div className="flex flex-col">
                    <span className="font-medium">إشعارات تذكيرية</span>
                    <span className="text-sm text-muted-foreground">
                      تذكيرات بالمواعيد والمهام
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
