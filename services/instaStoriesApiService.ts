// This is a mock response structure based on the prompt's requirements.
interface InstaStoriesApiResponse {
    status: 'ok' | 'fail';
    message?: string;
    result?: {
        avatar: string; // Corresponds to avatarUrl
        fullname: string; // Corresponds to fullName
        biography: string; // Corresponds to bio
        posts_count: number; // Corresponds to publicPostsCount
    };
}

// Function to generate Instagram profile picture URL from username
// This simulates fetching the actual Instagram profile image
const getInstagramProfileImageUrl = (username: string): string => {
    // In a real implementation, this would call the Instagram API
    // For now, we'll create a URL using a service that provides Instagram profile images
    // This is a fallback method when we don't have specific image data
    return `https://instagram.com/${username}/avatar`;
};

// Mock database of Insta-Stories.ru responses
const mockInstaStoriesDb: Record<string, InstaStoriesApiResponse> = {
    'anita.perez95': {
        status: 'ok',
        result: {
            avatar: 'https://i.imgur.com/8b1eWCk.jpg', // A deterministic but different image
            fullname: 'Ana P. (Público)',
            biography: 'Amante de los viajes y la fotografía 📸✈️. Viviendo la vida al máximo. No DM.',
            posts_count: 154
        }
    },
    'charlyg': {
        status: 'ok',
        result: {
            avatar: 'https://i.imgur.com/sC5vJ4p.jpg',
            fullname: 'Carlos "Charly" Gómez',
            biography: 'Entrenador personal y entusiasta del fitness. Ayudando a la gente a alcanzar sus metas 💪.',
            posts_count: 321,
        }
    },
    'nicobattaglia.33': {
        status: 'ok',
        result: {
            avatar: 'https://i.imgur.com/7Y25aL9.jpeg', // Specific image for this user
            fullname: 'Nico Battaglia',
            biography: 'Software developer and tech enthusiast 🧑‍💻. Sharing my journey in tech.',
            posts_count: 42,
        }
    },
    'nicobattaglia_33': {
        status: 'ok',
        result: {
            avatar: 'https://i.imgur.com/7Y25aL9.jpeg', // Same image as above for consistency
            fullname: 'Nico Battaglia',
            biography: 'Software developer and tech enthusiast 🧑‍💻. Sharing my journey in tech.',
            posts_count: 42,
        }
    },
    'nicobattaglia': {
        status: 'ok',
        result: {
            avatar: 'https://i.imgur.com/7Y25aL9.jpeg', // Same image as above for consistency
            fullname: 'Nico B.',
            biography: 'Tech professional with interests in software development.',
            posts_count: 25,
        }
    },
    'unknownuser123': {
        status: 'fail',
        message: 'User not found.'
    }
};

/**
 * Fetches public profile data from a mock Insta-Stories.ru API.
 * @param username The Instagram username to fetch.
 * @returns A promise that resolves to the profile data or null if not found/private/error.
 */
export const fetchInstagramProfileData = async (username: string): Promise<InstaStoriesApiResponse['result'] | null> => {
    console.log(`[InstaStories API] Fetching profile for: ${username}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const normalizedUsername = username.toLowerCase().trim();
    const response = mockInstaStoriesDb[normalizedUsername];

    if (response && response.status === 'ok' && response.result) {
        console.log(`[InstaStories API] Found data for: ${username}`);
        return response.result;
    }
    
    console.log(`[InstaStories API] No public data for: ${username}. Reason: ${response?.message || 'Not in mock DB'}`);
    return null;
};

/**
 * Alternative method to fetch Instagram profile image directly
 * This simulates what would happen with a real Instagram API integration
 */
export const fetchInstagramProfileImage = async (username: string): Promise<string | null> => {
    console.log(`[Instagram Image API] Fetching profile image for: ${username}`);
    // In a real implementation, this would make an actual API call to fetch Instagram profile image
    // Due to Instagram's API restrictions, this would typically require a backend service
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    // This is where we would use a real API service or backend proxy to get the Instagram profile image
    // For demo purposes, we'll return the same image for known profiles
    try {
        // In a real implementation, this would call our backend API that acts as a proxy to Instagram
        // For now, we'll return the same image for known profiles
        const normalizedUsername = username.toLowerCase().trim();
        
        // Check if this username exists in our mock database
        const profileData = mockInstaStoriesDb[normalizedUsername];
        if (profileData && profileData.status === 'ok' && profileData.result) {
            return profileData.result.avatar;
        }
        
        // If not in our mock DB, return null to indicate no profile image available
        return null;
    } catch (error) {
        console.error(`Error fetching Instagram profile image for ${username}:`, error);
        return null;
    }
};
