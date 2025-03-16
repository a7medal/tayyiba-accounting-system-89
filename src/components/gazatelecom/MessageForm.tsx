
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
  MessageSquareText, 
  ArrowUp, 
  ArrowDown, 
  Hash, 
  DollarSign,
  Percent,
  Send
} from "lucide-react";
import { useGazaTelecom, AccountType } from './GazaTelecomContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Schema for message form validation
const messageFormSchema = z.object({
  accountType: z.enum(['main', 'brina']),
  messageType: z.enum(['outgoing', 'incoming']),
  serialNumber: z.string().min(1, { message: "الرجاء إدخال الرقم التسلسلي" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "الرجاء إدخال مبلغ صحيح أكبر من صفر",
  }),
  interest: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "الرجاء إدخال فائدة صحيحة",
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
      serialNumber: '',
      amount: '',
      interest: '',
      note: '',
    },
  });

  const onSubmit = async (data: MessageFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add the message
      addMessage({
        accountType: data.accountType as AccountType,
        messageType: data.messageType as 'outgoing' | 'incoming',
        serialNumber: data.serialNumber,
        amount: Number(data.amount),
        interest: Number(data.interest),
        note: data.note,
      });
      
      // Show success message
      toast({
        title: "تم إضافة الرسالة بنجاح",
        description: `تم إضافة رسالة ${data.messageType === 'outgoing' ? 'صادرة' : 'واردة'} إلى ${data.accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'}`,
      });
      
      // Reset the form
      form.reset({
        accountType: data.accountType,
        messageType: data.messageType,
        serialNumber: '',
        amount: '',
        interest: '',
        note: '',
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
    <Card className="border-border bg-card/90 backdrop-blur-sm shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          إضافة رسالة جديدة
        </CardTitle>
        <CardDescription>
          قم بإدخال بيانات الرسالة الجديدة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs 
              defaultValue="main"
              onValueChange={(value) => form.setValue('accountType', value as AccountType)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="main">الحساب الرئيسي</TabsTrigger>
                <TabsTrigger value="brina">حساب برينة</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
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
                        <SelectItem value="outgoing" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <ArrowUp className="h-4 w-4 text-green-600" />
                            <span>صادر</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="incoming" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <ArrowDown className="h-4 w-4 text-red-600" />
                            <span>وارد</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الرقم التسلسلي</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="أدخل الرقم التسلسلي"
                            className="pr-9"
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
                          <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="أدخل المبلغ"
                            className="pr-9"
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
                  name="interest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الفائدة</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            inputMode="numeric"
                            placeholder="أدخل الفائدة"
                            className="pr-9"
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
                        placeholder="أي ملاحظات إضافية (اختياري)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة الرسالة"}
              <Send className="mr-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
