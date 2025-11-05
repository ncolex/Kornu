import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../db/client';
import { ReviewCategory } from '../../../types';

interface Review {
  id: number;
  profile_id: number;
  category: string;
  text: string;
  score: number;
  date: string;
  pseudo_author: string;
  confirmations: number;
  evidence_url?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { personIdentifier, country, category, text, score, reviewerEmail, reviewerInstagram, reviewerPhone, evidenceUrl } = req.body;

    if (!personIdentifier || !country || !category || !text || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // First, check if profile exists
      let profileResult = await pool.query(
        'SELECT id FROM profiles WHERE $1 = ANY(identifiers)',
        [personIdentifier]
      );

      let profileId: number;

      if (profileResult.rows.length === 0) {
        // Create new profile if it doesn't exist
        const newProfileResult = await pool.query(
          'INSERT INTO profiles (identifiers, country, total_score, reputation) VALUES ($1, $2, $3, $4) RETURNING id',
          [[personIdentifier], country, score, 'UNKNOWN']
        );
        profileId = newProfileResult.rows[0].id;
      } else {
        profileId = profileResult.rows[0].id;
        
        // Update profile total score
        await pool.query(
          'UPDATE profiles SET total_score = total_score + $1 WHERE id = $2',
          [score, profileId]
        );
      }

      // Insert the review
      const reviewerContactInfo = {
        email: reviewerEmail,
        instagram: reviewerInstagram,
        phone: reviewerPhone
      };

      const insertReviewQuery = `
        INSERT INTO reviews (
          profile_id, category, text, score, pseudo_author, evidence_url, reviewer_contact_info
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `;

      const result = await pool.query<Review>(insertReviewQuery, [
        profileId,
        category,
        text,
        score,
        reviewerInstagram || 'Anónimo',
        evidenceUrl,
        reviewerContactInfo
      ]);

      // Update profile reputation based on total score
      const profileScoreResult = await pool.query('SELECT total_score FROM profiles WHERE id = $1', [profileId]);
      const totalScore = profileScoreResult.rows[0].total_score;
      
      let reputation: string;
      if (totalScore > 0) reputation = 'POSITIVE';
      else if (totalScore > -3) reputation = 'WARNING';
      else reputation = 'RISK';
      
      await pool.query('UPDATE profiles SET reputation = $1 WHERE id = $2', [reputation, profileId]);

      res.status(200).json({ success: true, review: result.rows[0] });
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
