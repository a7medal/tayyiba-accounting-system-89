
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [companyName, setCompanyName] = useState("شركة طيبة للمحاسبة");
  const [taxNumber, setTaxNumber] = useState("123456789");
  const [defaultCurrency, setDefaultCurrency] = useState("MRU");
  
  const handleSaveGeneral = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ الإعدادات العامة بنجاح",
    });
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ إعدادات المظهر بنجاح",
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "تم الحفظ",
      description: "تم حفظ إعدادات الإشعارات بنجاح",
    });
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="security">الأمان</TabsTrigger>
          <TabsTrigger value="currency">العملة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="card-glass rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">معلومات الشركة</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">اسم الشركة</Label>
                    <input
                      id="companyName"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                    <input
                      id="taxNumber"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">العملة والضرائب</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currency">العملة الافتراضية</Label>
                    <Select
                      value={defaultCurrency}
                      onValueChange={setDefaultCurrency}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="اختر العملة الافتراضية" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MRU">أوقية جديدة (MRU)</SelectItem>
                        <SelectItem value="MRO">أوقية قديمة (MRO)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="taxRate">معدل الضريبة (%)</Label>
                    <input
                      id="taxRate"
                      type="number"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      defaultValue="16"
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveGeneral}>حفظ الإعدادات</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="card-glass rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">المظهر</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block mb-1">الوضع الداكن</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الوضع الداكن للتطبيق</p>
                    </div>
                    <Switch 
                      checked={theme === 'dark'} 
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block mb-1">التنسيق العربي</Label>
                      <p className="text-sm text-muted-foreground">استخدام التنسيق العربي للأرقام والتواريخ</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block mb-1">الرسوم المتحركة</Label>
                      <p className="text-sm text-muted-foreground">تفعيل الرسوم المتحركة في واجهة المستخدم</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveAppearance}>حفظ الإعدادات</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="card-glass rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">إعدادات الإشعارات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block mb-1">إشعارات التطبيق</Label>
                      <p className="text-sm text-muted-foreground">إظهار إشعارات داخل التطبيق</p>
                    </div>
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={setNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="block mb-1">إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-base font-medium mb-2">إشعارات لـ:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="invoices"
                          defaultChecked
                          className="rounded text-primary focus:ring-primary"
                        />
                        <Label htmlFor="invoices">الفواتير الجديدة</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="payments"
                          defaultChecked
                          className="rounded text-primary focus:ring-primary"
                        />
                        <Label htmlFor="payments">المدفوعات المستلمة</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="reports"
                          defaultChecked
                          className="rounded text-primary focus:ring-primary"
                        />
                        <Label htmlFor="reports">التقارير الدورية</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications}>حفظ الإعدادات</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="card-glass rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">الأمان</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">كلمة المرور الحالية</Label>
                    <input
                      id="password"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                    <input
                      id="newPassword"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                    <input
                      id="confirmPassword"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <Button>تغيير كلمة المرور</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="currency">
          <div className="card-glass rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">إعدادات العملة</h3>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>العملة الافتراضية</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4 bg-background">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">MRU</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">الأوقية الجديدة</h4>
                            <p className="text-xs text-muted-foreground">أوقية موريتانية (MRU)</p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <p>تم إطلاقها في 2018</p>
                          <p className="text-muted-foreground">1 MRU = 10 MRO</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-background">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                            <span className="font-bold">MRO</span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">الأوقية القديمة</h4>
                            <p className="text-xs text-muted-foreground">أوقية موريتانية قديمة (MRO)</p>
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          <p>استخدمت قبل 2018</p>
                          <p className="text-muted-foreground">10 MRO = 1 MRU</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="exchangeRate">معدل التحويل (MRO إلى MRU)</Label>
                    <div className="flex items-center gap-2">
                      <input
                        id="exchangeRate"
                        type="number"
                        disabled
                        className="flex h-10 w-full max-w-56 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        value="0.1"
                      />
                      <span className="text-muted-foreground">(1 MRO = 0.1 MRU)</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="conversionExample">مثال على التحويل</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex gap-4 items-center">
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          placeholder="1000"
                        />
                        <span>MRO</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span>=</span>
                        <input
                          type="number"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          placeholder="100"
                        />
                        <span>MRU</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button>حفظ إعدادات العملة</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
