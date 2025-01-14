import { Config } from 'ziggy-js';

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    email_verified_at?: string;
    image?: string;
    role: number;
}

export interface Profile {
    birth_date: string;
    gender: string;
    religion: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

export interface Classroom {
    id: number;
    name: string;
}

export type PaginatedData< T = any> ={
    data: T[],
    links: Record<string, string>,
    meta: Meta
}

export type Meta = {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<Links>
    per_page: number;
    to: number;
    total: number;
}

export type Links = {
    url?: string;
    label: string;
    active: boolean;
}

export type Roadmap = {
    id: number;
    title: string;
    description: string;
    image: string;
    domain_id: number;
    domain_name: string;
    domain_details: string;
    created_at: string;
    updated_at: string;
    recommendation_score?: number;
}

export type Domain = {
    id: number;
    name: string;
    description: string;
}

export type Persona = {
    id: number;
    name: string;
    description: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    classrooms: Classroom[];
    ziggy: Config & { location: string };
};

export interface AdminDashboardProps extends PageProps {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    loginCount: number;
    registerCount: number;
    scienceStream: number;
    nonScienceStream: number;
    totalRoadmaps: number;
    roadmapsWithUser: number;
    completedTests?: number;
}

declare module '@inertiajs/core' {
  interface PageProps {
    auth: {
      user: User;
      profile?: Profile;
    }
  }
}
