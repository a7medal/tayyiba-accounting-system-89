
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserTable } from '@/components/users/UserTable';
import { UserForm } from '@/components/users/UserForm';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

// بيانات مؤقتة للمستخدمين (ستُستبدل بقاعدة بيانات لاحقًا)
const initialUsers: User[] = [
  {
    id: '1',
    name: 'محمد عبد الله',
    email: 'mohamed@example.com',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    name: 'فاطمة أحمد',
    email: 'fatima@example.com',
    role: 'manager',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '3',
    name: 'عبد الرحمن محمد',
    email: 'abdelrahman@example.com',
    role: 'accountant',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '4',
    name: 'خديجة محمود',
    email: 'khadija@example.com',
    role: 'viewer',
    isActive: false,
    createdAt: new Date().toISOString()
  }
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'viewer',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, newUser]);
    toast({
      title: "تم إضافة المستخدم",
      description: `تم إضافة ${newUser.name} بنجاح`,
    });
  };

  const handleUpdateUser = (userData: Partial<User>) => {
    if (!userData.id) return;

    setUsers(users.map(user => 
      user.id === userData.id ? { ...user, ...userData } : user
    ));
    toast({
      title: "تم تحديث المستخدم",
      description: `تم تحديث بيانات ${userData.name} بنجاح`,
    });
  };

  const handleDeleteUser = (id: string) => {
    const userToDelete = users.find(user => user.id === id);
    if (!userToDelete) return;

    setUsers(users.filter(user => user.id !== id));
    toast({
      title: "تم حذف المستخدم",
      description: `تم حذف ${userToDelete.name} بنجاح`,
      variant: "destructive",
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleSubmit = (userData: Partial<User>) => {
    if (editingUser) {
      handleUpdateUser(userData);
    } else {
      handleCreateUser(userData);
    }
    setIsOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
        <Button onClick={() => {
          setEditingUser(null);
          setIsOpen(true);
        }}>إضافة مستخدم جديد</Button>
      </div>

      <div className="mb-6 card-glass rounded-xl p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="البحث عن مستخدم..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDeleteUser}
      />
      
      <UserForm
        open={isOpen}
        onOpenChange={setIsOpen}
        initialData={editingUser}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
