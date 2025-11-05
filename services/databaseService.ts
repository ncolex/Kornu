import { getSupabase } from '../supabase/supabaseClient';
import { Review, PersonProfile, UserProfile, ReviewCategory, ReputationLevel, WebCheckResult, InstagramSearchResult, RegisteredUser } from '../types';
import { fetchInstagramProfileData } from './instaStoriesApiService';

// Helper function to get or create a person profile
const getOrCreatePersonProfile = async (identifier: string): Promise<PersonProfile> => {
  const supabase = getSupabase();
  // First, try to get the existing profile
  const { data: existingProfile, error: fetchError } = await supabase
    .from('person_profiles')
    .select('*')
    .eq('identifier', identifier)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
    console.error('Error fetching profile:', fetchError);
    throw fetchError;
  }

  if (existingProfile) {
    return existingProfile as unknown as PersonProfile;
  }

  // If no profile exists, create a new one
  const { data: newProfile, error: insertError } = await supabase
    .from('person_profiles')
    .insert([{ 
      identifier, 
      total_score: 0,
      review_count: 0,
      last_updated: new Date().toISOString()
    }])
    .select()
    .single();

  if (insertError) {
    console.error('Error creating profile:', insertError);
    throw insertError;
  }

  return newProfile as unknown as PersonProfile;
};

export const getProfileByQuery = async (query: string): Promise<PersonProfile | null> => {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('person_profiles')
      .select('*')
      .or(`identifier.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Map the database fields to the PersonProfile interface
    const profile: PersonProfile = {
      id: data.id,
      identifier: data.identifier || '',
      identifiers: data.identifiers || [data.identifier] || [],
      country: data.country || '',
      totalScore: data.total_score || 0,
      reviewCount: data.review_count || 0,
      reputation: calculateReputationLevel(data.total_score || 0),
      reviews: data.reviews || [],
      instagramProfile: data.instagram_profile || undefined
    };

    return profile;
  } catch (error) {
    console.error('Error in getProfileByQuery:', error);
    return null;
  }
};

export const submitReview = async (reviewData: { 
  personIdentifier: string, 
  country: string, 
  category: ReviewCategory, 
  text: string, 
  score: number, 
  reviewerEmail?: string, 
  reviewerInstagram?: string, 
  reviewerPhone?: string, 
  evidenceUrl?: string, 
  pseudoAuthor?: string 
}): Promise<boolean> => {
  const supabase = getSupabase();
  try {
    // Get or create the person profile
    const personProfile = await getOrCreatePersonProfile(reviewData.personIdentifier);

    // Insert the review
    const { data: newReview, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        person_identifier: reviewData.personIdentifier,
        country: reviewData.country,
        category: reviewData.category,
        text: reviewData.text,
        score: reviewData.score,
        reviewer_email: reviewData.reviewerEmail,
        reviewer_instagram: reviewData.reviewerInstagram,
        reviewer_phone: reviewData.reviewerPhone,
        evidence_url: reviewData.evidenceUrl,
        pseudo_author: reviewData.pseudoAuthor,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (reviewError) {
      console.error('Error submitting review:', reviewError);
      return false;
    }

    // Update the profile's total score and review count
    const updatedScore = (personProfile.totalScore || 0) + reviewData.score;
    const updatedReviewCount = (personProfile.reviewCount || 0) + 1;

    const { error: updateError } = await supabase
      .from('person_profiles')
      .update({ 
        total_score: updatedScore, 
        review_count: updatedReviewCount,
        last_updated: new Date().toISOString()
      })
      .eq('id', personProfile.id);

    if (updateError) {
      console.error('Error updating profile score:', updateError);
      // Even if updating the profile fails, the review was submitted, so return true
    }

    return true;
  } catch (error) {
    console.error('Error in submitReview:', error);
    return false;
  }
};

export const getRankings = async (): Promise<{ topNegative: PersonProfile[], topPositive: PersonProfile[] }> => {
  const supabase = getSupabase();
  try {
    // Get top negative profiles (lowest scores)
    const { data: topNegative, error: negativeError } = await supabase
      .from('person_profiles')
      .select('*')
      .neq('total_score', 0) // Only profiles with reviews
      .order('total_score', { ascending: true })
      .limit(10);

    if (negativeError) {
      console.error('Error fetching top negative profiles:', negativeError);
    }

    // Get top positive profiles (highest scores)
    const { data: topPositive, error: positiveError } = await supabase
      .from('person_profiles')
      .select('*')
      .neq('total_score', 0) // Only profiles with reviews
      .order('total_score', { ascending: false })
      .limit(10);

    if (positiveError) {
      console.error('Error fetching top positive profiles:', positiveError);
    }

    // Transform to PersonProfile interface
    const transformProfile = (dbProfile: any): PersonProfile => ({
      id: dbProfile.id,
      identifier: dbProfile.identifier || '',
      identifiers: dbProfile.identifiers || [dbProfile.identifier] || [],
      country: dbProfile.country || '',
      totalScore: dbProfile.total_score || 0,
      reviewCount: dbProfile.review_count || 0,
      reputation: calculateReputationLevel(dbProfile.total_score || 0),
      reviews: dbProfile.reviews || [],
      instagramProfile: dbProfile.instagram_profile || undefined
    });

    return { 
      topNegative: (topNegative || []).map(transformProfile), 
      topPositive: (topPositive || []).map(transformProfile) 
    };
  } catch (error) {
    console.error('Error in getRankings:', error);
    return { topNegative: [], topPositive: [] };
  }
};

export const registerUser = async (userData: { phone: string; email?: string; password?: string }): Promise<{ success: boolean; message: string; user?: RegisteredUser }> => {
  const supabase = getSupabase();
  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', userData.phone)
      .single();

    if (existingUser) {
      return { 
        success: false, 
        message: 'El número de teléfono ya está registrado.' 
      };
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        phone: userData.phone,
        email: userData.email,
        password: userData.password, // In a real app, this should be hashed
        contribution_score: 0,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error('Error registering user:', insertError);
      return { 
        success: false, 
        message: 'Error al registrar usuario. Inténtalo de nuevo.' 
      };
    }

    const registeredUser: RegisteredUser = {
      id: newUser.id,
      phone: newUser.phone,
      email: newUser.email,
      contributionScore: newUser.contribution_score || 0
    };

    return { 
      success: true, 
      message: 'Usuario registrado exitosamente.', 
      user: registeredUser
    };
  } catch (error) {
    console.error('Error in registerUser:', error);
    return { 
      success: false, 
      message: 'Error al registrar usuario. Inténtalo de nuevo.' 
    };
  }
};

export const loginUser = async (credentials: { phone: string; password?: string }): Promise<{ success: boolean; message: string; user?: RegisteredUser }> => {
  const supabase = getSupabase();
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', credentials.phone)
      .single();

    if (error) {
      console.error('Error during login:', error);
      return { 
        success: false, 
        message: 'Usuario no encontrado.' 
      };
    }

    // In a real app, you should verify the password hash here
    // For now, we'll just check if the user exists
    if (!user) {
      return { 
        success: false, 
        message: 'Usuario no encontrado.' 
      };
    }

    const registeredUser: RegisteredUser = {
      id: user.id,
      phone: user.phone,
      email: user.email,
      contributionScore: user.contribution_score || 0
    };

    return { 
      success: true, 
      message: 'Inicio de sesión exitoso.', 
      user: registeredUser
    };
  } catch (error) {
    console.error('Error in loginUser:', error);
    return { 
      success: false, 
      message: 'Error al iniciar sesión. Inténtalo de nuevo.' 
    };
  }
};

export const getUserProfile = async (phone?: string): Promise<UserProfile> => {
  const supabase = getSupabase();
  try {
    if (!phone) {
      // Return a default anonymous user profile
      return {
        id: 'anonymous',
        pseudoUsername: 'Usuario anónimo',
        contributionScore: 0,
        reviews: []
      };
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      // Return a default user profile
      return {
        id: 'anonymous',
        pseudoUsername: `user***${phone.slice(-4)}`,
        contributionScore: 0,
        reviews: []
      };
    }

    // Get user's reviews
    const { data: userReviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('*')
      .eq('reviewer_phone', phone);

    if (reviewsError) {
      console.error('Error fetching user reviews:', reviewsError);
    }

    return {
      id: user.id,
      pseudoUsername: `user***${phone.slice(-4)}`,
      contributionScore: user.contribution_score || 0,
      reviews: userReviews || []
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return {
      id: 'anonymous',
      pseudoUsername: phone ? `user***${phone.slice(-4)}` : 'Usuario anónimo',
      contributionScore: 0,
      reviews: []
    };
  }
};

export const performWebChecks = async (query: string): Promise<WebCheckResult[]> => {
  console.log(`Performing web check for: ${query} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 1500));

  const results: WebCheckResult[] = [];
  const normalizedQuery = query.toLowerCase().trim();
  const usernameQuery = normalizedQuery.replace(/[\s._-]+/g, '');
  const hash = normalizedQuery.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isLikelyPhoneNumber = /^\+?[\d\s-]{7,}$/.test(query);
  
  results.push({
    id: `web-google`,
    source: 'Google',
    title: `Buscar "${query}" en Google`,
    link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    snippet: `Realiza una búsqueda general para encontrar información pública.`,
    status: 'info'
  });

  return results;
};

export const searchInstagramProfiles = async (query: string): Promise<InstagramSearchResult[]> => {
  console.log(`Searching Instagram for: ${query} (mock)`);
  await new Promise(resolve => setTimeout(resolve, 1800));

  const originalQuery = query.toLowerCase().trim();
  const normalizedQuery = originalQuery.replace(/[\s._-]+/g, '');
  
  // --- Create comprehensive search variants ---
  const searchVariants = new Set<string>([originalQuery, normalizedQuery]);
  
  if (normalizedQuery.match(/^([a-zA-Z]+)(\d+)$/)) {
    const [_, namePart, numberPart] = normalizedQuery.match(/^([a-zA-Z]+)(\d+)$/);
    if (namePart && numberPart) {
      searchVariants.add(`${namePart}.${numberPart}`);
      searchVariants.add(`${namePart}_${numberPart}`);
      searchVariants.add(`${namePart}-${numberPart}`);
      searchVariants.add(`${namePart}${numberPart}`);
    }
  }
  
  const prefixMatch = originalQuery.match(/^([a-zA-Z]+)/);
  if (prefixMatch) {
    searchVariants.add(prefixMatch[1]);
  }

  if (originalQuery.includes('.')) {
    searchVariants.add(originalQuery.replace(/\./g, ''));
    searchVariants.add(originalQuery.replace(/\./g, '_'));
    searchVariants.add(originalQuery.replace(/\./g, '-'));
  } else if (originalQuery.includes('_')) {
    searchVariants.add(originalQuery.replace(/_/g, ''));
    searchVariants.add(originalQuery.replace(/_/g, '.'));
    searchVariants.add(originalQuery.replace(/_/g, '-'));
  } else if (originalQuery.includes('-')) {
    searchVariants.add(originalQuery.replace(/-/g, ''));
    searchVariants.add(originalQuery.replace(/-/g, '.'));
    searchVariants.add(originalQuery.replace(/-/g, '_'));
  }

  const getDeterministicProfilePic = (username: string): string => {
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gender = hash % 2 === 0 ? 'male' : 'female';
    const avatarId = hash % 70;
    return `https://xsgames.co/randomusers/assets/avatars/${gender}/${avatarId}.jpg`;
  };

  const allMockProfilesData = [
    { username: 'anita.perez95', fullName: 'Anita Pérez' },
    { username: 'ana_perez_art', fullName: 'Ana Pérez | Artista' },
    { username: 'charlyg', fullName: 'Carlos Gómez' },
    { username: 'sofilu', fullName: 'Sofia Luna' },
    { username: 'anaperez95', fullName: 'Ana Perez - Gamer' },
    { username: 'nicobattaglia.33', profilePicUrl: 'https://i.imgur.com/7Y25aL9.jpeg', fullName: 'Nico Battaglia' },
    { username: 'nicobattaglia_33', fullName: 'Nico Battaglia' },
    { username: 'nicobattaglia-33', fullName: 'Nico Battaglia' },
    { username: 'nicobattaglia', fullName: 'Nico B.' },
  ];

  const allMockProfiles: InstagramSearchResult[] = allMockProfilesData.map(p => ({
    ...p,
    profilePicUrl: p.profilePicUrl || getDeterministicProfilePic(p.username),
  }));

  const foundProfiles = new Map<string, InstagramSearchResult>();

  allMockProfiles.forEach(p => {
    const normalizedUsername = p.username.toLowerCase().replace(/[\s._-]+/g, '');
    const originalUsername = p.username.toLowerCase();
    
    for (const variant of searchVariants) {
      if (originalUsername === variant) {
        foundProfiles.set(p.username, p);
        break;
      }
      else if (normalizedUsername.includes(variant.replace(/[\s._-]+/g, ''))) {
        foundProfiles.set(p.username, p);
        break;
      }
      else if (originalUsername.includes(variant)) {
        foundProfiles.set(p.username, p);
        break;
      }
    }
  });
  
  return Array.from(foundProfiles.values());
};

// Helper function to calculate reputation level based on total score
const calculateReputationLevel = (score: number): ReputationLevel => {
  if (score > 0) return ReputationLevel.Positive;
  else if (score > -3) return ReputationLevel.Warning;
  else return ReputationLevel.Risk;
};
