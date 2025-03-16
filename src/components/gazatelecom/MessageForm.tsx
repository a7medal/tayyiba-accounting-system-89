
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SendHorizonal, ArrowLeftRight, MessageCircle } from 'lucide-react';
import { useGazaTelecom, AccountType, MessageType } from './GazaTelecomContext';
import { useToast } from '@/components/ui/use-toast';

// تعريف نموذج التحقق من الصحة
const formSchema = z.object({
  serialNumber: z.string().min(1, { message: "الرقم التسلسلي مطلوب" }),
  amount: z.coerce.number().min(1, { message: "المبلغ يجب أن يكون أكبر من صفر" }),
  interest: z.coerce.number().min(0, { message: "الفائدة يجب أن تكون صفر أو أكبر" }),
  accountType: z.enum(['main', 'brina'], { required_error: "نوع الحساب مطلوب" }),
  messageType: z.enum(['incoming', 'outgoing'], { required_error: "نوع الرسالة مطلوب" }),
  note: z.string().optional(),
});

// استخراج النوع من نموذج التحقق من الصحة
type FormValues = z.infer<typeof formSchema>;

export function MessageForm() {
  const { addMessage } = useGazaTelecom();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // إعداد نموذج React Hook Form مع التحقق من الصحة
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serialNumber: '',
      amount: undefined,
      interest: 0,
      accountType: 'main',
      messageType: 'incoming',
      note: '',
    }
  });

  // مراقبة قيم الحقول
  const watchAccountType = watch('accountType');
  const watchMessageType = watch('messageType');

  // معالجة تقديم النموذج
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // إضافة الرسالة إلى النظام
      addMessage({
        amount: data.amount,
        accountType: data.accountType,
        messageType: data.messageType,
        serialNumber: data.serialNumber,
        interest: data.interest,
        note: data.note,
      });

      // عرض رسالة نجاح
      toast({
        title: "تمت العملية بنجاح",
        description: "تم إضافة الرسالة بنجاح إلى النظام",
      });

      // إعادة تعيين النموذج
      reset();
    } catch (error) {
      // عرض رسالة خطأ
      toast({
        title: "حدث خطأ",
        description: "فشل في إضافة الرسالة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
      console.error("Error adding message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          إضافة رسالة جديدة
        </CardTitle>
        <CardDescription>
          أدخل تفاصيل الرسالة الجديدة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="messageForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
                <Input
                  id="serialNumber"
                  placeholder="أدخل الرقم التسلسلي للرسالة"
                  {...register('serialNumber')}
                />
                {errors.serialNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.serialNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">المبلغ</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="أدخل المبلغ"
                  {...register('amount')}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="interest">الفائدة</Label>
                <Input
                  id="interest"
                  type="number"
                  placeholder="أدخل الفائدة"
                  {...register('interest')}
                />
                {errors.interest && (
                  <p className="text-sm text-red-500 mt-1">{errors.interest.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>نوع الحساب</Label>
                <RadioGroup
                  defaultValue="main"
                  value={watchAccountType}
                  onValueChange={(value) => setValue('accountType', value as AccountType)}
                  className="flex flex-col space-y-1 mt-2"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="main" id="accountTypeMain" />
                    <Label htmlFor="accountTypeMain" className="font-normal">الحساب الرئيسي</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="brina" id="accountTypeBrina" />
                    <Label htmlFor="accountTypeBrina" className="font-normal">حساب برينة</Label>
                  </div>
                </RadioGroup>
                {errors.accountType && (
                  <p className="text-sm text-red-500 mt-1">{errors.accountType.message}</p>
                )}
              </div>

              <div>
                <Label>نوع الرسالة</Label>
                <RadioGroup
                  defaultValue="incoming"
                  value={watchMessageType}
                  onValueChange={(value) => setValue('messageType', value as MessageType)}
                  className="flex flex-col space-y-1 mt-2"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="incoming" id="messageTypeIncoming" />
                    <Label htmlFor="messageTypeIncoming" className="font-normal">وارد</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="outgoing" id="messageTypeOutgoing" />
                    <Label htmlFor="messageTypeOutgoing" className="font-normal">صادر</Label>
                  </div>
                </RadioGroup>
                {errors.messageType && (
                  <p className="text-sm text-red-500 mt-1">{errors.messageType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="note">ملاحظات</Label>
                <Textarea
                  id="note"
                  placeholder="أدخل أي ملاحظات إضافية (اختياري)"
                  className="h-[104px]"
                  {...register('note')}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
        >
          إعادة تعيين
        </Button>
        <Button
          type="submit"
          form="messageForm"
          disabled={isSubmitting}
          className="gap-2"
        >
          {watchMessageType === 'incoming' ? (
            <>
              <ArrowLeftRight className="h-4 w-4" />
              استلام رسالة
            </>
          ) : (
            <>
              <SendHorizonal className="h-4 w-4" />
              إرسال رسالة
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
