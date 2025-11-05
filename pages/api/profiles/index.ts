import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../supabase/supabaseClient';
import { ReviewCategory, ReputationLevel, PersonProfile } from '../../../types';

// Handler for getting profiles by query
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
      // Search for profiles based on identifier
      let { data: profiles, error } = await supabase
        .from('person_profiles')
        .select('*')
        .or(`identifier.ilike.%${query}%,identifiers.cs.{${query}}`) // Search in both identifier and identifiers array
        .limit(10);

      if (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
      }

      if (!profiles || profiles.length === 0) {
        return res.status(200).json(null);
      }

      // Get reviews for the found profile(s)
      const profile = profiles[0];
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('person_identifier', profile.identifier)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        // Continue without reviews rather than failing the whole request
      }

      const profileWithReviews = {
        ...profile,
        reviews: reviews || [],
        // Convert database reputation to frontend enum
        reputation: profile.reputation as ReputationLevel
      };

      res.status(200).json(profileWithReviews);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else if (req.method === 'POST') {
    // Handler for creating a new profile
    const { identifiers, country, identifier } = req.body;

    if (!identifier && (!identifiers || !Array.isArray(identifiers) || identifiers.length === 0)) {
      return res.status(400).json({ error: 'At least one identifier is required' });
    }

    try {
      const newIdentifier = identifier || (Array.isArray(identifiers) ? identifiers[0] : identifiers);

      const { data: result, error } = await supabase
        .from('person_profiles')
        .insert([{ 
          identifier: newIdentifier,
          identifiers: identifiers || [newIdentifier],
          country: country || '',
          total_score: 0,
          review_count: 0,
          reputation: 'UNKNOWN' as ReputationLevel,
          last_updated: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
      }

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error creating profile:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
