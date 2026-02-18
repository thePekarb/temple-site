import { createClient } from '@supabase/supabase-js';

// 1. Вставляем URL прямо сюда (в кавычках, я его уже написал)
const supabaseUrl = 'https://kjtjukcokwmjpgjlyjyf.supabase.co';

// 2. ВАЖНО: Вставьте сюда свой длинный ключ (anon public)
// Он начинается на sb_publishable_...
// Вставьте его внутри кавычек, вместо текста "ВСТАВЬТЕ_КЛЮЧ_СЮДА"
const supabaseKey = 'sb_publishable_sBlXu_Up-4_NDZyemgJFBw_WL1jdLUT';

export const supabase = createClient(supabaseUrl, supabaseKey);