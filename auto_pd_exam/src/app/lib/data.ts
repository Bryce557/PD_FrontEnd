'use server'
import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js'
import { auth } from '../../../auth';

const key = process.env.DEFAULT!;
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function addPatient({ email, password }) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        await sql`
            INSERT INTO Patients (email, password)
            VALUES (${email}, ${hashedPassword})
        `;
    } catch(error) {
        console.error('Error with adding new patient', error);
        throw new Error('Failed to add new patient');
    }
}

export async function getID() {
    const session = await auth();
    if (!session || !session.user?.email) {
        console.error('No session or user email found in getID()');
        throw new Error('User is not authenticated');
    }
    try {
        const result = await sql`SELECT id from Patients WHERE Patients.email = ${session.user.email}`;
        console.log('In getID: ', result[0].id);
        return result[0].id;
    } catch(error) {
        console.error('Failed to find user with email provided');
        throw new Error('Failed to retreive ID');
    }
}

export async function uploadVideo(video, path) {
    try {   
        const userId = await getID();
        const supabase = createClient('https://xkrjlpnwdbknwwjvwpuj.supabase.co', key);
        const { data, error } = await supabase
            .storage
            .from('Videos')
            .upload(userId + '/' + path, video, {
                upsert: false
            })
        if (error) {
            console.error('Upload error');
            throw new Error('Video upload failed');
        }
    } catch(error) {
        console.error('uploadVideo() failed');
        throw new Error('Execution of uploadVideo() failed');
    }
}
