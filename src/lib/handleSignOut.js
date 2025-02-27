import { supabase } from '@/lib';

export const handleSignOut = async (router) => {
    await supabase.auth.signOut();
    router.push('/');
}