export interface User {
  uid: string,
  email: string,
  name: string,
  department: string,
  role: 'USER_ROLE'|'ADMIN_ROLE',
  password?: string
}
