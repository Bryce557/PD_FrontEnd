import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { Patient } from './src/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getPatient(email: string): Promise<Patient | undefined> {
    try {
        const patient = await sql<Patient[]>`SELECT * FROM patients WHERE email = ${email}`;
        return patient[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}
 
export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string(), password: z.string().min(4) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const patient = await getPatient(email);
                    if (!patient) return null;
                    
                    const passwordsMatch = password === patient.password;
    
                    if (passwordsMatch) return patient;
                }
                alert('Invalid credentails');
                return null;
            },
        }),
    ],
});