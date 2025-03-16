
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Message, AccountType, MessageType } from './models/MessageModel';
import { formatDate } from './utils/ChartUtils';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (message: Partial<Message>) => void;
  message: Message | null;
  accountType: AccountType;
  selectedDate: string;
}

export function MessageDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  message, 
  accountType,
  selectedDate
}: MessageDialogProps) {
  const [messageType, setMessageType] = useState<MessageType>('outgoing');
  const [serialNumber, setSerialNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [interest, setInterest] = useState('');
  const [note, setNote] = useState('');
  
  // Load message data when editing an existing message
  useEffect(() => {
    if (message) {
      setMessageType(message.messageType);
      setSerialNumber(message.serialNumber);
      setAmount(message.amount.toString());
      setInterest(message.interest.toString());
      setNote(message.note || '');
    } else {
      // Default values for new message
      setMessageType('outgoing');
      setSerialNumber('');
      setAmount('');
      setInterest('');
      setNote('');
    }
  }, [message]);
  
  const handleSave = () => {
    // Validate fields
    if (!serialNumber.trim()) {
      alert('الرجاء إدخال الرقم التسلسلي');
      return;
    }
    
    if (!amount.trim() || isNaN(Number(amount))) {
      alert('الرجاء إدخال مبلغ صحيح');
      return;
    }
    
    if (!interest.trim() || isNaN(Number(interest))) {
      alert('الرجاء إدخال فائدة صحيحة');
      return;
    }
    
    // Save message data
    onSave({
      messageType,
      serialNumber,
      amount: Number(amount),
      interest: Number(interest),
      note: note.trim() || undefined
    });
    
    // Reset form
    setMessageType('outgoing');
    setSerialNumber('');
    setAmount('');
    setInterest('');
    setNote('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {message ? 'تعديل رسالة' : 'إضافة رسالة جديدة'}
            {selectedDate && ` - ${formatDate(selectedDate)}`}
          </DialogTitle>
          <DialogDescription>
            {message 
              ? 'قم بتعديل بيانات الرسالة ثم اضغط على حفظ' 
              : 'قم بإدخال بيانات الرسالة الجديدة ثم اضغط على حفظ'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="account-type" className="text-right">
              الحساب
            </Label>
            <div className="col-span-3">
              <Input 
                id="account-type" 
                value={accountType === 'main' ? 'الحساب الرئيسي' : 'حساب برينة'} 
                disabled 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="message-type" className="text-right">
              نوع الرسالة
            </Label>
            <Select 
              value={messageType} 
              onValueChange={(value) => setMessageType(value as MessageType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="اختر نوع الرسالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outgoing">صادر</SelectItem>
                <SelectItem value="incoming">وارد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serial-number" className="text-right">
              الرقم التسلسلي
            </Label>
            <Input
              id="serial-number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              المبلغ
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interest" className="text-right">
              الفائدة
            </Label>
            <Input
              id="interest"
              type="number"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              ملاحظات
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="col-span-3"
              placeholder="ملاحظات إضافية (اختياري)"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={handleSave}>حفظ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
