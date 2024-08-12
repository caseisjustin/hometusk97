import { Role } from '@prisma/client';

export class User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  phone: string;
  avatar?: string;
  role: Role;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: string;
  created_at: Date;
  last_edited_at: Date;
  isActive: boolean;
}
