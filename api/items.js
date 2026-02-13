import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // 1. Supabase 클라이언트 초기화
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )

  // 2. Body 데이터 안전하게 가져오기
  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { method } = req;

  try {
    if (method === 'GET') {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return res.status(200).json(data);
    } 

    if (method === 'POST') {
      const { text, completed } = payload;
      const { data, error } = await supabase
        .from('shopping_items')
        .insert([{ text, completed }])
        .select();
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (method === 'PATCH') {
      const { id, completed } = payload;
      const { error } = await supabase
        .from('shopping_items')
        .update({ completed })
        .eq('id', id);
      
      if (error) throw error;
      return res.status(200).send('Updated');
    }

    if (method === 'DELETE') {
      const { id } = payload;
      const { error } = await supabase
        .from('shopping_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return res.status(200).send('Deleted');
    }

    // 허용되지 않은 메서드 처리
    return res.status(405).send('Method Not Allowed');

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: error.message });
  }
}