export enum Department {
  IT = "IT",        // تقنية معلومات
  SE = "SE",       // هندسة برمجيات
  COM = "COM",   // هندسة اتصالات
  IMSE = "IMSE",   // هندسة صناعية
  CND = "CND",   // هندسة شبكات
  MRE = "MRE"    // هندسة ميكاترونكس
}

export const departmentLabels: Record<Department, string> = {
  [Department.IT]: "تقنية معلومات",
  [Department.SE]: "هندسة برمجيات",
  [Department.COM]: "هندسة اتصالات",
  [Department.IMSE]: "هندسة صناعية",
  [Department.CND]: "هندسة شبكات",
  [Department.MRE]: "هندسة ميكاترونكس"
};

export interface Category {
  id: string;
  name: string;
}