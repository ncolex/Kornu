import { Review, PersonProfile, UserProfile, ReviewCategory, ReputationLevel, WebCheckResult, InstagramSearchResult, RegisteredUser } from '../types';
import { fetchInstagramProfileData } from './instaStoriesApiService';

// --- SERVICIO DE BASE DE DATOS SIMULADO CON LOCALSTORAGE ---
// NOTA: Para simular la persistencia de datos sin un backend real,
// este servicio ahora utiliza el `localStorage` del navegador.
// Los datos de reseñas, perfiles y usuarios se guardarán entre sesiones.

// --- KEYS PARA LOCALSTORAGE ---
const PROFILES_KEY = 'cornuscore_profiles_db';
const REVIEWS_KEY = 'cornuscore_reviews_db';
const USERS_KEY = 'cornuscore_users_db';


// --- DATOS INICIALES (MOCK) ---
// Se usan solo si no hay nada en localStorage (primera visita).
const initialReviews: Review[] = [
  // ... reviews for 'ana perez' ...
  { id: 'rev1', category: ReviewCategory.Infidelity, text: "Me fue infiel con mi mejor amiga. Cero confianza.", score: -3, date: "2023-10-15T12:00:00Z", pseudoAuthor: "user123", confirmations: 12, personReviewed: 'Ana Perez', evidenceUrl: 'https://i.imgur.com/v6tcf17.png' },
  { id: 'rev2', category: ReviewCategory.Toxic, text: "Muy controladora y celosa. Revisaba mi celular a escondidas.", score: -2, date: "2023-08-20T12:00:00Z", pseudoAuthor: "user456", confirmations: 7, personReviewed: 'Ana Perez' },
  { id: 'rev3', category: ReviewCategory.Betrayal, text: "Contó secretos míos a todo nuestro grupo de amigos. Una traidora.", score: -3, date: "2024-01-05T12:00:00Z", pseudoAuthor: "user789", confirmations: 5, personReviewed: 'Ana Perez' },
  // ... reviews for 'carlos gomez' ...
  { id: 'rev4', category: ReviewCategory.Positive, text: "El amigo más leal que he tenido. Siempre está ahí para apoyarte.", score: 2, date: "2024-02-10T12:00:00Z", pseudoAuthor: "user321", confirmations: 25, personReviewed: 'Carlos Gomez' },
  { id: 'rev5', category: ReviewCategory.Positive, text: "Súper detallista y atento. La mejor pareja que he tenido.", score: 2, date: "2023-11-30T12:00:00Z", pseudoAuthor: "user654", confirmations: 18, personReviewed: 'Carlos Gomez' },
  // ... reviews for others for ranking ...
  { id: 'rev6', category: ReviewCategory.Theft, text: "Le presté dinero y nunca me lo devolvió, se desapareció.", score: -4, date: "2023-09-01T12:00:00Z", pseudoAuthor: "user987", confirmations: 3, personReviewed: 'Ricardo Diaz' },
  { id: 'rev7', category: ReviewCategory.Infidelity, text: "Me enteré que tenía una doble vida con otra familia.", score: -3, date: "2022-05-12T12:00:00Z", pseudoAuthor: "user111", confirmations: 9, personReviewed: 'Ricardo Diaz' },
  { id: 'rev8', category: ReviewCategory.Positive, text: "Una persona increíble, honesta y trabajadora.", score: 2, date: "2024-03-01T12:00:00Z", pseudoAuthor: "user222", confirmations: 15, personReviewed: 'Sofia Luna' },
  { id: 'rev10', category: ReviewCategory.Positive, text: "Muy amable y colaboradora en el trabajo.", score: 2, date: "2024-04-01T12:00:00Z", pseudoAuthor: "user444", confirmations: 8, personReviewed: 'Cintia Fernandez' },
  { id: 'rev11', category: ReviewCategory.Toxic, text: "A veces es un poco chismosa.", score: -1, date: "2024-03-15T12:00:00Z", pseudoAuthor: "user555", confirmations: 2, personReviewed: 'Cintia Fernandez' },
];

const initialProfiles: PersonProfile[] = [
  { id: 'prof1', identifiers: ['ana perez', 'anita.perez95', '1122334455'], country: 'Argentina', totalScore: -8, reputation: ReputationLevel.Risk, reviews: initialReviews.filter(r => r.personReviewed === 'Ana Perez') },
  { id: 'prof2', identifiers: ['carlos gomez', 'charlyg', '5544332211'], country: 'México', totalScore: 4, reputation: ReputationLevel.Positive, reviews: initialReviews.filter(r => r.personReviewed === 'Carlos Gomez') },
  { id: 'prof3', identifiers: ['ricardo diaz', 'richid'], country: 'Colombia', totalScore: -7, reputation: ReputationLevel.Risk, reviews: initialReviews.filter(r => r.personReviewed === 'Ricardo Diaz') },
  { id: 'prof4', identifiers: ['sofia luna', 'sofilu'], country: 'España', totalScore: 2, reputation: ReputationLevel.Positive, reviews: initialReviews.filter(r => r.personReviewed === 'Sofia Luna') },
  { id: 'prof5', identifiers: ['pedro navaja'], country: 'Perú', totalScore: -2, reputation: ReputationLevel.Warning, reviews: [{ id: 'rev9', category: ReviewCategory.Toxic, text: "Manipulador, te hace sentir culpable por todo.", score: -2, date: "2023-06-18T12:00:00Z", pseudoAuthor: "user333", confirmations: 4, personReviewed: 'Pedro Navaja' }] },
  { id: 'prof6', identifiers: ['Cintia Fernandez', 'sintiafer'], country: 'Chile', totalScore: 1, reputation: ReputationLevel.Positive, reviews: initialReviews.filter(r => r.personReviewed === 'Cintia Fernandez') },
];

const initialUsers: RegisteredUser[] = [
    { id: 'user_xyz', phone: 'google_user_123456', email: 'test@google.com', contributionScore: 125 },
    { id: 'user_abc', phone: '1122334455', email: 'user@example.com', passwordHash: 'hashed_password', contributionScore: 50 },
];

// --- FUNCIONES DE PERSISTENCIA ---
const loadData = <T>(key: string, initialData: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        } else {
            // Si no hay datos, inicializamos localStorage con los datos de prueba.
            window.localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
    } catch (error) {
        console.error(`Error al cargar datos desde localStorage (${key}):`, error);
        return initialData;
    }
};

const saveData = () => {
    try {
        window.localStorage.setItem(PROFILES_KEY, JSON.stringify(mockProfiles));
        window.localStorage.setItem(REVIEWS_KEY, JSON.stringify(mockReviews));
        window.localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
        console.log("Datos guardados en localStorage.");
    } catch (error) {
        console.error("Error al guardar datos en localStorage:", error);
    }
};

// --- "BASE DE DATOS" EN MEMORIA, CARGADA DESDE LOCALSTORAGE ---
let mockReviews: Review[] = loadData(REVIEWS_KEY, initialReviews);
let mockProfiles: PersonProfile[] = loadData(PROFILES_KEY, initialProfiles);
let mockUsers: RegisteredUser[] = loadData(USERS_KEY, initialUsers);


// --- Utility Function for Realistic and Consistent Profile Pics ---
const getDeterministicProfilePic = (username: string): string => {
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // This service provides realistic, consistent photos based on a seed.
    // It alternates between male and female avatars for variety.
    const gender = hash % 2 === 0 ? 'male' : 'female';
    const avatarId = hash % 70; // The service has about 70 avatars per gender
    return `https://xsgames.co/randomusers/assets/avatars/${gender}/${avatarId}.jpg`;
};

// MOCK SERVICE FUNCTIONS

const calculateReputation = (score: number): ReputationLevel => {
    if (score > 0) return ReputationLevel.Positive;
    if (score > -3) return ReputationLevel.Warning;
    return ReputationLevel.Risk;
};

const levenshteinDistance = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[a.length][b.length];
};

/**
 * Generates a simplified phonetic code for a Spanish string.
 * This helps match names that sound similar but are spelled differently.
 * e.g., "Cintia" and "Sintia" should produce the same code.
 * @param text The input string.
 * @returns A phonetic code.
 */
const spanishPhoneticEncoder = (text: string): string => {
    if (!text) return '';

    let s = text.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z]/g, ''); // Keep only letters

    if (!s) return '';

    // Phonetic conversions
    s = s.replace(/h/g, '')          // H is silent
         .replace(/[wv]/g, 'b')       // W, V -> B
         .replace(/z/g, 's')          // Z -> S
         .replace(/c([ei])/g, 's$1') // C before e, i -> S
         .replace(/[ckq]/g, 'k')       // C, K, Q -> K
         .replace(/g([ei])/g, 'j$1') // G before e, i -> J
         .replace(/x/g, 'j')          // X -> J (e.g., México)
         .replace(/ll/g, 'i')         // LL -> I (like 'y' sound)
         .replace(/y/g, 'i');         // Y -> I

    // Remove duplicate consecutive letters
    if (s.length > 1) {
        s = s.split('').filter((char, index, arr) => char !== arr[index - 1]).join('');
    }
    
    return s;
};

export const getProfileByQuery = async (query: string): Promise<PersonProfile | null> => {
  console.log(`Searching for: ${query}`);
  // Normalize query for simple matching
  const normalizedQuery = query.toLowerCase().trim().replace(/[\s._-]+/g, '');
  // Create phonetic code for advanced matching
  const phoneticQuery = spanishPhoneticEncoder(query);
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  if (!normalizedQuery) return null;

  let bestMatch: { profile: PersonProfile | null, score: number } = { profile: null, score: 0 };

  for (const profile of mockProfiles) {
    for (const id of profile.identifiers) {
      const normalizedId = id.toLowerCase().replace(/[\s._-]+/g, '');
      let scores: number[] = [];

      // Score 1: Perfect match (highest priority)
      if (normalizedId === normalizedQuery) {
        scores.push(100);
      } 
      
      // Score 2: Partial match (e.g., "anaperez" vs "anaperez95")
      if (normalizedId.includes(normalizedQuery) || normalizedQuery.includes(normalizedId)) {
        const lengthRatio = Math.min(normalizedId.length, normalizedQuery.length) / Math.max(normalizedId.length, normalizedQuery.length);
        scores.push(70 + (25 * lengthRatio));
      }

      // Score 3: Phonetic match
      const phoneticId = spanishPhoneticEncoder(id);
      if (phoneticQuery.length > 2 && phoneticId === phoneticQuery) {
          scores.push(80); // Phonetic match is quite strong
      }

      // Score 4: Fuzzy match (Levenshtein distance)
      const distance = levenshteinDistance(normalizedQuery, normalizedId);
      const similarity = 1 - (distance / Math.max(normalizedQuery.length, normalizedId.length));
      if (similarity > 0.75) {
        scores.push(40 + (30 * similarity)); // Score between 62.5 and 70
      }

      const currentScore = scores.length > 0 ? Math.max(...scores) : 0;
      
      if (currentScore > bestMatch.score) {
        bestMatch = { profile, score: currentScore };
      }
    }
  }
  
  console.log(`Best match for "${query}": ${bestMatch.profile?.identifiers[0]} with score ${bestMatch.score.toFixed(2)}`);

  // Return a profile only if the match score is reasonably high
  const MATCH_THRESHOLD = 60;
  const finalProfile = bestMatch.score >= MATCH_THRESHOLD ? bestMatch.profile : null;

    if (finalProfile && !finalProfile.instagramProfile) {
        // Find a suitable identifier to use as an Instagram username
        const instagramUsername = finalProfile.identifiers.find(id => !id.includes(' ') && isNaN(Number(id)));
        
        if (instagramUsername) {
            console.log(`Profile found. Attempting to fetch extended Instagram data for ${instagramUsername}`);
            const instaData = await fetchInstagramProfileData(instagramUsername);
            
            if (instaData) {
                // "Save" the data to our mock profile. In a real app, this would be a DB update.
                finalProfile.instagramProfile = {
                    avatarUrl: instaData.avatar,
                    fullName: instaData.fullname,
                    bio: instaData.biography,
                    publicPostsCount: instaData.posts_count,
                    fetchedAt: new Date().toISOString()
                };
                console.log("Successfully fetched and attached extended Instagram data.");
            }
        }
    }
    
  return finalProfile;
};

// Fix: Update submitReview to accept an optional pseudoAuthor and make reviewer contact info optional.
export const submitReview = async (reviewData: { personIdentifier: string, country: string, category: ReviewCategory, text: string, score: number, reviewerEmail?: string, reviewerInstagram?: string, reviewerPhone?: string, evidenceUrl?: string, pseudoAuthor?: string }): Promise<boolean> => {
    console.log("Submitting review:", reviewData);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const newReview: Review = {
        id: `rev${Date.now()}`,
        date: new Date().toISOString(),
        confirmations: 0,
        personReviewed: reviewData.personIdentifier,
        category: reviewData.category,
        text: reviewData.text,
        score: reviewData.score,
        pseudoAuthor: reviewData.pseudoAuthor || reviewData.reviewerInstagram || 'Anónimo', // Use provided author, fallback to instagram, then to anonymous
        evidenceUrl: reviewData.evidenceUrl
    };
    mockReviews.push(newReview);
    
    const normalizedIdentifier = reviewData.personIdentifier.toLowerCase().trim();
    let profile = mockProfiles.find(p => p.identifiers.some(id => id.toLowerCase() === normalizedIdentifier));
    
    if (profile) {
        profile.reviews.push(newReview);
        profile.totalScore += reviewData.score;
        profile.reputation = calculateReputation(profile.totalScore);
    } else {
        const newProfile: PersonProfile = {
            id: `prof${Date.now()}`,
            identifiers: [reviewData.personIdentifier],
            country: reviewData.country,
            reviews: [newReview],
            totalScore: reviewData.score,
            reputation: calculateReputation(reviewData.score),
        };
        mockProfiles.push(newProfile);
    }
    
    saveData();
    return true; // Simulate success
};

export const getRankings = async (): Promise<{ topNegative: PersonProfile[], topPositive: PersonProfile[] }> => {
    console.log("Fetching rankings");
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay

    const sortedProfiles = [...mockProfiles].sort((a, b) => a.totalScore - b.totalScore);
    
    const topNegative = sortedProfiles.slice(0, 5);
    const topPositive = sortedProfiles.slice().reverse().slice(0, 5);

    return { topNegative, topPositive };
};

export const registerUser = async (userData: { phone: string; email?: string; password?: string }): Promise<{ success: boolean; message: string; user?: RegisteredUser }> => {
    console.log("Registering user:", { phone: userData.phone, email: userData.email });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Check if phone or email already exists
    const existingUser = mockUsers.find(u => u.phone === userData.phone || (userData.email && u.email === userData.email));
    if (existingUser) {
        return { success: false, message: 'El número de teléfono o correo electrónico ya está registrado.' };
    }

    const newUser: RegisteredUser = {
        id: `user_${Math.random().toString(36).substring(2, 9)}`,
        phone: userData.phone,
        email: userData.email,
        // In a real app, you would hash the password here before storing
        passwordHash: userData.password ? `hashed_${userData.password}` : undefined,
        contributionScore: 0,
    };

    mockUsers.push(newUser);
    console.log("Current users:", mockUsers);
    
    saveData();
    return { success: true, message: 'Registro exitoso.', user: newUser };
};

export const loginUser = async (credentials: { phone: string; password?: string }): Promise<{ success: boolean; message: string; user?: RegisteredUser }> => {
    console.log("Attempting login for phone:", credentials.phone);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const user = mockUsers.find(u => u.phone === credentials.phone);

    if (!user) {
        return { success: false, message: 'El número de teléfono no está registrado.' };
    }

    // This handles users who registered via social media and don't have a password
    if (!user.passwordHash) {
        return { success: false, message: 'Esta cuenta fue registrada con un proveedor social. Por favor, inicia sesión con Google, Facebook o Instagram.' };
    }

    // In a real app, you would use a secure library like bcrypt to compare hashes.
    // For this mock, we use a simple string comparison.
    const expectedHash = `hashed_${credentials.password}`;
    if (user.passwordHash !== expectedHash) {
        return { success: false, message: 'La contraseña es incorrecta.' };
    }

    return { success: true, message: 'Inicio de sesión exitoso.', user };
};


export const getUserProfile = async (phone?: string): Promise<UserProfile> => {
    console.log("Fetching user profile for phone:", phone);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const dbUser = mockUsers.find(u => u.phone === phone);

    // This part for reviews is static for now, as there's no link between a user and the reviews they create in mock data
    const userReviews = mockReviews.filter(r => r.pseudoAuthor === 'user123' || r.pseudoAuthor === 'user456');
    return {
        id: dbUser?.id || 'user_xyz',
        pseudoUsername: dbUser?.phone ? `user***${dbUser.phone.slice(-4)}` : 'user123',
        contributionScore: dbUser?.contributionScore ?? 125,
        reviews: userReviews
    };
};

export const performWebChecks = async (query: string): Promise<WebCheckResult[]> => {
    console.log(`Performing web check for: ${query}`);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate a longer delay for web scraping/API calls

    // Simulate a potential failure for testing purposes
    if (query.toLowerCase().trim() === 'failcheck') {
        throw new Error("Simulated web check API failure.");
    }

    const results: WebCheckResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();
    const usernameQuery = normalizedQuery.replace(/[\s._-]+/g, '');
    const hash = normalizedQuery.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const isLikelyPhoneNumber = /^\+?[\d\s-]{7,}$/.test(query);
    
    // Add generic search engine links for all queries
    results.push({
        id: `web-google`,
        source: 'Google',
        title: `Buscar "${query}" en Google`,
        link: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Realiza una búsqueda general para encontrar información pública.`,
        status: 'info'
    });
    results.push({
        id: `web-facebook`,
        source: 'Facebook',
        title: `Buscar "${query}" en Facebook`,
        link: `https://www.facebook.com/search/top/?q=${encodeURIComponent(query)}`,
        snippet: `Busca perfiles, páginas y grupos en Facebook.`,
        status: 'info'
    });
    results.push({
        id: `web-tiktok`,
        source: 'TikTok',
        title: `Buscar "${query}" en TikTok`,
        link: `https://www.tiktok.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Busca perfiles y contenido en la plataforma de TikTok.`,
        status: 'info'
    });
    results.push({
        id: `web-onlyfans`,
        source: 'OnlyFans',
        title: `Buscar perfiles en OnlyFans (via Google)`,
        link: `https://www.google.com/search?q=site:onlyfans.com+"${encodeURIComponent(query)}"`,
        snippet: `Busca perfiles de OnlyFans usando una búsqueda especializada.`,
        status: 'info'
    });
    results.push({
        id: `web-cafecito`,
        source: 'Cafecito.app',
        title: `Verificar perfil en Cafecito.app`,
        link: `https://cafecito.app/${encodeURIComponent(usernameQuery)}`,
        snippet: `Verifica si existe un perfil directo en la plataforma Cafecito.`,
        status: 'info'
    });

    // Badoo check with found/not_found status
    if (hash % 3 === 0 && !isLikelyPhoneNumber) { // 1 in 3 chance of finding a profile
        results.push({
            id: `web-badoo`,
            source: 'Badoo',
            title: `Se encontró un perfil en Badoo`,
            link: `https://badoo.com/es/search/?q=${encodeURIComponent(query)}`,
            snippet: `Se detectó una coincidencia que requiere verificación manual.`,
            status: 'found',
            screenshotUrl: 'https://i.imgur.com/gfZiEol.png'
        });
    } else {
        results.push({
            id: `web-badoo`,
            source: 'Badoo',
            title: `No se encontraron perfiles en Badoo`,
            link: `#`,
            snippet: `La búsqueda automática no arrojó resultados claros en esta plataforma.`,
            status: 'not_found'
        });
    }

    results.push({
        id: `web-skokka`,
        source: 'Skokka',
        title: `Búsqueda de acompañantes en Skokka`,
        link: `https://www.skokka.com/buscar?q=${encodeURIComponent(query)}`,
        snippet: `Verifica si hay perfiles relacionados en sitios de acompañantes.`,
        status: 'info'
    });

    // Add simulated social media checks only if it's NOT likely a phone number
    if (!isLikelyPhoneNumber) {
        const tinderProfiles = (hash % 2); // 0 or 1
        if (tinderProfiles > 0) {
            results.unshift({
                id: `web-tinder-${hash}`,
                source: 'Tinder',
                title: `Posible perfil en apps de citas`,
                link: `#`,
                snippet: `Indicios de presencia en apps de citas (Tinder, etc.).`,
                status: 'found'
            });
        }
    }

    return results;
};

export const searchInstagramProfiles = async (query: string): Promise<InstagramSearchResult[]> => {
    console.log(`Searching Instagram for: ${query}`);
    await new Promise(resolve => setTimeout(resolve, 1800)); // Simulate a longer API call

    const originalQuery = query.toLowerCase().trim();
    const normalizedQuery = originalQuery.replace(/[\s._-]+/g, '');
    
    // --- Create comprehensive search variants ---
    const searchVariants = new Set<string>([originalQuery, normalizedQuery]);
    
    // Add variations with dots, underscores, and hyphens
    if (normalizedQuery.match(/^([a-zA-Z]+)(\d+)$/)) {
        const [_, namePart, numberPart] = normalizedQuery.match(/^([a-zA-Z]+)(\d+)$/);
        if (namePart && numberPart) {
            searchVariants.add(`${namePart}.${numberPart}`);
            searchVariants.add(`${namePart}_${numberPart}`);
            searchVariants.add(`${namePart}-${numberPart}`);
            searchVariants.add(`${namePart}${numberPart}`);
        }
    }
    
    // Add prefix variations (name only)
    const prefixMatch = originalQuery.match(/^([a-zA-Z]+)/);
    if (prefixMatch) {
        searchVariants.add(prefixMatch[1]);
    }

    // Add variations for existing separators
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

    // --- Update the mock profile data to use the deterministic function ---
    const allMockProfilesData = [
        { username: 'anita.perez95', fullName: 'Anita Pérez' },
        { username: 'ana_perez_art', fullName: 'Ana Pérez | Artista' },
        { username: 'charlyg', fullName: 'Carlos Gómez' },
        { username: 'sofilu', fullName: 'Sofia Luna' },
        { username: 'anaperez95', fullName: 'Ana Perez - Gamer' },
        // Use the user-provided, specific image for this one profile as requested
        { username: 'nicobattaglia.33', profilePicUrl: 'https://i.imgur.com/7Y25aL9.jpeg', fullName: 'Nico Battaglia' },
        { username: 'nicobattaglia_33', fullName: 'Nico Battaglia' },
        { username: 'nicobattaglia-33', fullName: 'Nico Battaglia' },
        { username: 'nicobattaglia', fullName: 'Nico B.' },
    ];

    const allMockProfiles: InstagramSearchResult[] = allMockProfilesData.map(p => ({
        ...p,
        // Use the specific URL if provided, otherwise generate one deterministically
        profilePicUrl: p.profilePicUrl || getDeterministicProfilePic(p.username),
    }));

    const foundProfiles = new Map<string, InstagramSearchResult>();

    allMockProfiles.forEach(p => {
        const normalizedUsername = p.username.toLowerCase().replace(/[\s._-]+/g, '');
        const originalUsername = p.username.toLowerCase();
        
        for (const variant of searchVariants) {
            // Check exact match with original username
            if (originalUsername === variant) {
                foundProfiles.set(p.username, p);
                break;
            }
            // Check normalized match
            else if (normalizedUsername.includes(variant.replace(/[\s._-]+/g, ''))) {
                foundProfiles.set(p.username, p);
                break;
            }
            // Check if variant is contained in original username
            else if (originalUsername.includes(variant)) {
                foundProfiles.set(p.username, p);
                break;
            }
        }
    });
    
    return Array.from(foundProfiles.values());
};