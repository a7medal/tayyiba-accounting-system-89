
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGazaTelecom, AccountType, MessageType } from './GazaTelecomContext';
import { Message } from './models/MessageModel';
import { useToast } from '@/components/ui/use-toast';

// تعريف مخطط التحقق من البيانات باستخدام Zod
const formSchema = z.object({
  accountType: z.enum(['main', 'brina']),
  messageType: z.enum(['incoming', 'outgoing']),
  serialNumber: z.string().min(1, { message: 'الرقم التسلسلي مطلوب' }),
  amount: z.coerce.number().min(1, { message: 'المبلغ يجب أن يكون أكبر من 0' }),
  interest: z.coerce.number().min(0, { message: 'الفائدة يجب أن تكون 0 أو أكبر' }),
  note: z.string().optional(),
});

// نوع بيانات النموذج
type FormValues = z.infer<typeof formSchema>;

interface MessageFormProps {
  initialAccountType?: AccountType;
  initialMessageType?: MessageType;
  initialValues?: Message;
  isEdit?: boolean;
  onSuccess?: (data: FormValues) => void;
}

export function MessageForm({ 
  initialAccountType = 'main', 
  initialMessageType = 'outgoing',
  initialValues,
  isEdit = false,
  onSuccess
}: MessageFormProps) {
  const { addMessage, updateMessage } = useGazaTelecom();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // إعداد نموذج React Hook Form مع مكتبة Zod للتحقق
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ? {
      accountType: initialValues.accountType,
      messageType: initialValues.messageType,
      serialNumber: initialValues.serialNumber,
      amount: initialValues.amount,
      interest: initialValues.interest,
      note: initialValues.note || '',
    } : {
      accountType: initialAccountType,
      messageType: initialMessageType,
      serialNumber: '',
      amount: 0,
      interest: 0,
      note: '',
    },
  });
  
  // معالجة إرسال النموذج
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEdit && initialValues) {
        // تحديث رسالة موجودة
        const updatedMessage: Message = {
          ...initialValues,
          ...data,
        };
        updateMessage(updatedMessage);
        
        toast({
          title: "تم التحديث بنجاح",
          description: "تم تحديث الرسالة بنجاح",
        });
        
        if (onSuccess) {
          onSuccess(updatedMessage);
        }
      } else {
        // إضافة رسالة جديدة
        addMessage(data);
        
        toast({
          title: "تمت الإضافة بنجاح",
          description: "تمت إضافة الرسالة بنجاح",
        });
        
        // إعادة تعيين النموذج
        form.reset({
          accountType: data.accountType,
          messageType: data.messageType,
          serialNumber: '',
          amount: 0,
          interest: 0,
          note: '',
        });
        
        if (onSuccess) {
          onSuccess(data);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء معالجة الطلب",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'تعديل الرسالة' : 'إضافة رسالة جديدة'}</CardTitle>
        <CardDescription>
          {isEdit 
            ? 'قم بتعديل بيانات الرسالة الحالية' 
            : 'أدخل بيانات الرسالة الجديدة لإضافتها إلى النظام'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحساب</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isEdit}
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
                    <FormDescription>
                      اختر الحساب الذي تريد إدخال الرسالة له
                    </FormDescription>
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
                      disabled={isEdit}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الرسالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="outgoing">صادر</SelectItem>
                        <SelectItem value="incoming">وارد</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      حدد ما إذا كانت الرسالة صادرة أو واردة
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="serialNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرقم التسلسلي</FormLabel>
                  <FormControl>
                    <Input placeholder="أدخل الرقم التسلسلي للرسالة" {...field} />
                  </FormControl>
                  <FormDescription>
                    أدخل الرقم التسلسلي الفريد للرسالة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المبلغ (أوقية)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      أدخل مبلغ الرسالة بالأوقية
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
                    <FormLabel>الفائدة (أوقية)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      أدخل مبلغ الفائدة المقابل لهذه الرسالة
                    </FormDescription>
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
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل أي ملاحظات إضافية"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    يمكنك إضافة ملاحظات إضافية حول هذه الرسالة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'جاري المعالجة...' : isEdit ? 'تحديث الرسالة' : 'إضافة الرسالة'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
