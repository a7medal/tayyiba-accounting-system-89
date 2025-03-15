
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
  ArrowUpToLine, 
  ArrowDownToLine,
  Hash,
  Wallet,
  CreditCard,
  FileText,
  Save
} from "lucide-react";
import { useGazaTelecom, AccountType, MessageType } from './GazaTelecomContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// تعريف نموذج الفورم
const messageFormSchema = z.object({
  accountType: z.enum(['main', 'brina'], {
    required_error: "الرجاء اختيار الحساب",
  }),
  messageType: z.enum(['incoming', 'outgoing'], {
    required_error: "الرجاء اختيار نوع الرسالة",
  }),
  serialNumber: z.string().min(1, { message: "الرجاء إدخال الرقم التسلسلي" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "الرجاء إدخال مبلغ صحيح أكبر من صفر",
  }),
  interest: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "الرجاء إدخال قيمة الفائدة (يمكن أن تكون صفر)",
  }),
  note: z.string().optional(),
});

type MessageFormValues = z.infer<typeof messageFormSchema>;

export function MessageForm() {
  const { toast } = useToast();
  const { addMessage } = useGazaTelecom();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      accountType: 'main',
      messageType: 'outgoing',
      serialNumber: "",
      amount: "",
      interest: "0",
      note: "",
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    setIsSubmitting(true);
    
    try {
      // إضافة الرسالة الجديدة
      addMessage({
        accountType: data.accountType as AccountType,
        messageType: data.messageType as MessageType,
        serialNumber: data.serialNumber,
        amount: Number(data.amount),
        interest: Number(data.interest),
        note: data.note,
      });
      
      // عرض رسالة نجاح
      toast({
        title: "تم إضافة الرسالة بنجاح",
        description: `تم إضافة رسالة ${data.messageType === 'outgoing' ? 'صادرة' : 'واردة'} بمبلغ ${Number(data.amount).toLocaleString()} أوقية بنجاح`,
      });
      
      // إعادة تعيين الفورم مع الحفاظ على نوع الحساب ونوع الرسالة
      form.reset({
        accountType: data.accountType,
        messageType: data.messageType,
        serialNumber: "",
        amount: "",
        interest: "0",
        note: "",
      });
    } catch (error) {
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من إضافة الرسالة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          إضافة رسالة جديدة
        </CardTitle>
        <CardDescription>
          قم بإدخال بيانات الرسالة لإضافتها إلى السجل
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحساب</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الحساب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="main">الحساب الرئيسي</SelectItem>
                        <SelectItem value="brina">حساب برينة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="messageType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الرسالة</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الرسالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="outgoing">
                          <div className="flex items-center">
                            <ArrowUpToLine className="h-4 w-4 mr-2 text-green-500" />
                            صادرة
                          </div>
                        </SelectItem>
                        <SelectItem value="incoming">
                          <div className="flex items-center">
                            <ArrowDownToLine className="h-4 w-4 mr-2 text-red-500" />
                            واردة
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الرقم التسلسلي</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="أدخل الرقم التسلسلي للرسالة"
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
                        <Wallet className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="أدخل مبلغ الرسالة"
                          className="pr-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      أدخل المبلغ بالأوقية الموريتانية
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفائدة</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="أدخل قيمة الفائدة"
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل أي ملاحظات إضافية (اختياري)"
                      className="min-h-20"
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
              {isSubmitting ? "جاري الحفظ..." : "حفظ الرسالة"}
              <Save className="mr-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
