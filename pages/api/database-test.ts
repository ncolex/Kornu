import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../supabase/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test the Supabase connection by making a simple request
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase connection failed',
        details: error.message
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Supabase connection successful!',
      timestamp: new Date().toISOString(),
      data: data 
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
}