
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Wallet, 
  User, 
  Users, 
  Phone, 
  CreditCard, 
  DollarSign,
  Send
} from "lucide-react";
import { useAuth } from '@/hooks/use-auth';

// تعريف نموذج الفورم
const transferFormSchema = z.object({
  recipient: z.string().min(3, { message: "الرجاء إدخال اسم المستلم" }),
  recipientPhone: z.string().min(9, { message: "الرجاء إدخال رقم هاتف صحيح" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "الرجاء إدخال مبلغ صحيح أكبر من صفر",
  }),
  transferId: z.string().min(4, { message: "الرجاء إدخال رقم التحويل" }),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

export function TransferForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      recipient: "",
      recipientPhone: "",
      amount: "",
      transferId: "",
      notes: "",
    },
  });

  const onSubmit = async (data: TransferFormValues) => {
    setIsSubmitting(true);
    
    try {
      // محاكاة لعملية إرسال البيانات إلى الخادم
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("بيانات التحويل:", data);
      
      // عرض رسالة نجاح
      toast({
        title: "تم إرسال التحويل بنجاح",
        description: `تم إرسال مبلغ ${data.amount} بنجاح إلى ${data.recipient}`,
      });
      
      // إعادة تعيين الفورم
      form.reset();
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إجراء التحويل، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card/90 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          إنشاء تحويل جديد
        </CardTitle>
        <CardDescription>
          قم بإدخال بيانات المستلم والمبلغ لإجراء عملية تحويل جديدة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المستلم</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="أدخل اسم المستلم"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="recipientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم هاتف المستلم</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="أدخل رقم الهاتف"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="أدخل المبلغ"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      أدخل المبلغ بالدولار الأمريكي
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transferId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم التحويل</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="أدخل رقم التحويل"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أي ملاحظات إضافية (اختياري)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري التحويل..." : "إرسال التحويل"}
              <Send className="mr-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
