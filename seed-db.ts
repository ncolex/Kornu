import { supabase } from './supabase/supabaseClient';

// Test data for negative profiles (high risk)
const negativeProfiles = [
  {
    identifier: 'juan.perez.scammer',
    identifiers: ['Juan Perez', 'juan.perez.scammer', '+5491123456789'],
    country: 'Argentina',
    total_score: -10,
    review_count: 3,
    reputation: 'RISK',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'maria.garcia.cheater',
    identifiers: ['Maria Garcia', 'maria.garcia.cheater', '+5491198765432'],
    country: 'Mexico',
    total_score: -8,
    review_count: 2,
    reputation: 'RISK',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'carlos.rivera.fraud',
    identifiers: ['Carlos Rivera', 'carlos.rivera.fraud', '+5491155566677'],
    country: 'Colombia',
    total_score: -12,
    review_count: 4,
    reputation: 'RISK',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'ana.lopez.betrayer',
    identifiers: ['Ana Lopez', 'ana.lopez.betrayer', '+5491188877766'],
    country: 'Spain',
    total_score: -7,
    review_count: 2,
    reputation: 'RISK',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'pedro.diaz.toxic',
    identifiers: ['Pedro Diaz', 'pedro.diaz.toxic', '+5491144455566'],
    country: 'Chile',
    total_score: -9,
    review_count: 3,
    reputation: 'RISK',
    last_updated: new Date().toISOString()
  }
];

// Test data for positive profiles (trustworthy)
const positiveProfiles = [
  {
    identifier: 'laura.santos.helpful',
    identifiers: ['Laura Santos', 'laura.santos.helpful', '+5491112345678'],
    country: 'Argentina',
    total_score: 10,
    review_count: 3,
    reputation: 'POSITIVE',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'diego.fuentes.reliable',
    identifiers: ['Diego Fuentes', 'diego.fuentes.reliable', '+5491199988877'],
    country: 'Mexico',
    total_score: 8,
    review_count: 2,
    reputation: 'POSITIVE',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'valentina.ruiz.kind',
    identifiers: ['Valentina Ruiz', 'valentina.ruiz.kind', '+5491133344455'],
    country: 'Colombia',
    total_score: 12,
    review_count: 4,
    reputation: 'POSITIVE',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'felipe.mendoza.honest',
    identifiers: ['Felipe Mendoza', 'felipe.mendoza.honest', '+5491166677788'],
    country: 'Spain',
    total_score: 7,
    review_count: 2,
    reputation: 'POSITIVE',
    last_updated: new Date().toISOString()
  },
  {
    identifier: 'camila.rodriguez.supportive',
    identifiers: ['Camila Rodriguez', 'camila.rodriguez.supportive', '+5491122233344'],
    country: 'Chile',
    total_score: 9,
    review_count: 3,
    reputation: 'POSITIVE',
    last_updated: new Date().toISOString()
  }
];

// Reviews for negative profiles
const negativeReviews = [
  {
    person_identifier: 'juan.perez.scammer',
    country: 'Argentina',
    category: 'THEFT',
    text: 'Robó dinero de la cooperativa y se negó a devolverlo.',
    score: -4,
    reviewer_email: 'test1@example.com',
    reviewer_instagram: '@test1',
    reviewer_phone: '+5491122233344',
    evidence_url: null,
    pseudo_author: 'ConcernedCitizen',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'juan.perez.scammer',
    country: 'Argentina',
    category: 'BETRAYAL',
    text: 'Traicionó la confianza de su mejor amigo al revelar secretos personales.',
    score: -3,
    reviewer_email: 'test2@example.com',
    reviewer_instagram: '@test2',
    reviewer_phone: '+5491133344455',
    evidence_url: null,
    pseudo_author: 'TruthSeeker',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'juan.perez.scammer',
    country: 'Argentina',
    category: 'TOXIC',
    text: 'Constantemente humillaba a sus compañeros de trabajo.',
    score: -2,
    reviewer_email: 'test3@example.com',
    reviewer_instagram: '@test3',
    reviewer_phone: '+5491144455566',
    evidence_url: null,
    pseudo_author: 'WorkColleague',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'maria.garcia.cheater',
    country: 'Mexico',
    category: 'INFIDELITY',
    text: 'Fue infiel a su pareja con múltiples personas durante su relación.',
    score: -3,
    reviewer_email: 'test4@example.com',
    reviewer_instagram: '@test4',
    reviewer_phone: '+5491155566677',
    evidence_url: null,
    pseudo_author: 'ExPartner',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'maria.garcia.cheater',
    country: 'Mexico',
    category: 'TOXIC',
    text: 'Tenía una personalidad muy tóxica, manipuladora y controladora.',
    score: -2,
    reviewer_email: 'test5@example.com',
    reviewer_instagram: '@test5',
    reviewer_phone: '+5491166677788',
    evidence_url: null,
    pseudo_author: 'CloseFriend',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'carlos.rivera.fraud',
    country: 'Colombia',
    category: 'THEFT',
    text: 'Estafó a varios inversionistas con un esquema piramidal.',
    score: -4,
    reviewer_email: 'test6@example.com',
    reviewer_instagram: '@test6',
    reviewer_phone: '+5491177788899',
    evidence_url: null,
    pseudo_author: 'InvestorVictim',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'carlos.rivera.fraud',
    country: 'Colombia',
    category: 'BETRAYAL',
    text: 'Defraudó la confianza de su familia al estafarlos también.',
    score: -3,
    reviewer_email: 'test7@example.com',
    reviewer_instagram: '@test7',
    reviewer_phone: '+5491188899900',
    evidence_url: null,
    pseudo_author: 'FamilyMember',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'carlos.rivera.fraud',
    country: 'Colombia',
    category: 'THEFT',
    text: 'Se robó equipos de la empresa donde trabajaba.',
    score: -4,
    reviewer_email: 'test8@example.com',
    reviewer_instagram: '@test8',
    reviewer_phone: '+5491199900011',
    evidence_url: null,
    pseudo_author: 'FormerCoworker',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'carlos.rivera.fraud',
    country: 'Colombia',
    category: 'TOXIC',
    text: 'Intimidaba y acosaba a sus subordinados.',
    score: -2,
    reviewer_email: 'test9@example.com',
    reviewer_instagram: '@test9',
    reviewer_phone: '+5491100011122',
    evidence_url: null,
    pseudo_author: 'WorkVictim',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'ana.lopez.betrayer',
    country: 'Spain',
    category: 'BETRAYAL',
    text: 'Reveló información confidencial de la empresa a la competencia.',
    score: -3,
    reviewer_email: 'test10@example.com',
    reviewer_instagram: '@test10',
    reviewer_phone: '+5491111122233',
    evidence_url: null,
    pseudo_author: 'Manager',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'ana.lopez.betrayer',
    country: 'Spain',
    category: 'BETRAYAL',
    text: 'Traicionó a su mejor amiga al salir con su ex novio.',
    score: -3,
    reviewer_email: 'test11@example.com',
    reviewer_instagram: '@test11',
    reviewer_phone: '+5491122233344',
    evidence_url: null,
    pseudo_author: 'FriendLoser',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'pedro.diaz.toxic',
    country: 'Chile',
    category: 'TOXIC',
    text: 'Era extremadamente controlador y celoso en la relación.',
    score: -2,
    reviewer_email: 'test12@example.com',
    reviewer_instagram: '@test12',
    reviewer_phone: '+5491133344455',
    evidence_url: null,
    pseudo_author: 'ExPartner2',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'pedro.diaz.toxic',
    country: 'Chile',
    category: 'TOXIC',
    text: 'Usaba manipulación emocional constantemente.',
    score: -2,
    reviewer_email: 'test13@example.com',
    reviewer_instagram: '@test13',
    reviewer_phone: '+5491144455566',
    evidence_url: null,
    pseudo_author: 'Counselor',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'pedro.diaz.toxic',
    country: 'Chile',
    category: 'BETRAYAL',
    text: 'Engañó sistemáticamente a su pareja.',
    score: -3,
    reviewer_email: 'test14@example.com',
    reviewer_instagram: '@test14',
    reviewer_phone: '+5491155566677',
    evidence_url: null,
    pseudo_author: 'Victim',
    created_at: new Date().toISOString()
  }
];

// Reviews for positive profiles
const positiveReviews = [
  {
    person_identifier: 'laura.santos.helpful',
    country: 'Argentina',
    category: 'POSITIVE',
    text: 'Fue de gran ayuda cuando tuve problemas económicos.',
    score: 2,
    reviewer_email: 'test15@example.com',
    reviewer_instagram: '@test15',
    reviewer_phone: '+5491166677788',
    evidence_url: null,
    pseudo_author: 'GratefulPerson',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'laura.santos.helpful',
    country: 'Argentina',
    category: 'POSITIVE',
    text: 'Siempre dispuesta a ayudar a los demás sin esperar nada a cambio.',
    score: 2,
    reviewer_email: 'test16@example.com',
    reviewer_instagram: '@test16',
    reviewer_phone: '+5491177788899',
    evidence_url: null,
    pseudo_author: 'Neighbor',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'laura.santos.helpful',
    country: 'Argentina',
    category: 'POSITIVE',
    text: 'Muy honesta y confiable en todos los aspectos.',
    score: 2,
    reviewer_email: 'test17@example.com',
    reviewer_instagram: '@test17',
    reviewer_phone: '+5491188899900',
    evidence_url: null,
    pseudo_author: 'Friend',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'diego.fuentes.reliable',
    country: 'Mexico',
    category: 'POSITIVE',
    text: 'Cumple siempre con sus compromisos y es muy responsable.',
    score: 2,
    reviewer_email: 'test18@example.com',
    reviewer_instagram: '@test18',
    reviewer_phone: '+5491199900011',
    evidence_url: null,
    pseudo_author: 'BusinessPartner',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'diego.fuentes.reliable',
    country: 'Mexico',
    category: 'POSITIVE',
    text: 'Excelente profesional, muy ético en su trabajo.',
    score: 2,
    reviewer_email: 'test19@example.com',
    reviewer_instagram: '@test19',
    reviewer_phone: '+5491100011122',
    evidence_url: null,
    pseudo_author: 'Client',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'valentina.ruiz.kind',
    country: 'Colombia',
    category: 'POSITIVE',
    text: 'Una persona maravillosa, siempre con una palabra amable.',
    score: 2,
    reviewer_email: 'test20@example.com',
    reviewer_instagram: '@test20',
    reviewer_phone: '+5491111122233',
    evidence_url: null,
    pseudo_author: 'CommunityMember',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'valentina.ruiz.kind',
    country: 'Colombia',
    category: 'POSITIVE',
    text: 'Voluntaria en múltiples causas benéficas.',
    score: 2,
    reviewer_email: 'test21@example.com',
    reviewer_instagram: '@test21',
    reviewer_phone: '+5491122233344',
    evidence_url: null,
    pseudo_author: 'CharityOrg',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'valentina.ruiz.kind',
    country: 'Colombia',
    category: 'POSITIVE',
    text: 'Muy solidaria y generosa con los demás.',
    score: 2,
    reviewer_email: 'test22@example.com',
    reviewer_instagram: '@test22',
    reviewer_phone: '+5491133344455',
    evidence_url: null,
    pseudo_author: 'Beneficiary',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'valentina.ruiz.kind',
    country: 'Colombia',
    category: 'POSITIVE',
    text: 'Excelente líder, motiva a los demás positivamente.',
    score: 2,
    reviewer_email: 'test23@example.com',
    reviewer_instagram: '@test23',
    reviewer_phone: '+5491144455566',
    evidence_url: null,
    pseudo_author: 'TeamMember',
    created as: new Date().toISOString()
  },
  {
    person_identifier: 'felipe.mendoza.honest',
    country: 'Spain',
    category: 'POSITIVE',
    text: 'Extremadamente honesto, incluso cuando le perjudica.',
    score: 2,
    reviewer_email: 'test24@example.com',
    reviewer_instagram: '@test24',
    reviewer_phone: '+5491155566677',
    evidence_url: null,
    pseudo_author: 'Customer',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'felipe.mendoza.honest',
    country: 'Spain',
    category: 'POSITIVE',
    text: 'Devolvió dinero que le habían dado por error.',
    score: 2,
    reviewer_email: 'test25@example.com',
    reviewer_instagram: '@test25',
    reviewer_phone: '+5491166677788',
    evidence_url: null,
    pseudo_author: 'Cashier',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'camila.rodriguez.supportive',
    country: 'Chile',
    category: 'POSITIVE',
    text: 'Muy empática y de gran apoyo en tiempos difíciles.',
    score: 2,
    reviewer_email: 'test26@example.com',
    reviewer_instagram: '@test26',
    reviewer_phone: '+5491177788899',
    evidence_url: null,
    pseudo_author: 'FriendInNeed',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'camila.rodriguez.supportive',
    country: 'Chile',
    category: 'POSITIVE',
    text: 'Excelente escucha y consejera, muy comprensiva.',
    score: 2,
    reviewer_email: 'test27@example.com',
    reviewer_instagram: '@test27',
    reviewer_phone: '+5491188899900',
    evidence_url: null,
    pseudo_author: 'Mentee',
    created_at: new Date().toISOString()
  },
  {
    person_identifier: 'camila.rodriguez.supportive',
    country: 'Chile',
    category: 'POSITIVE',
    text: 'Siempre dispuesta a ofrecer su tiempo para ayudar.',
    score: 2,
    reviewer_email: 'test28@example.com',
    reviewer_instagram: '@test28',
    reviewer_phone: '+5491199900011',
    evidence_url: null,
    pseudo_author: 'SupportGroup',
    created_at: new Date().toISOString()
  }
];

async function seedDatabase() {
  console.log('Starting to seed the database with test data...');

  try {
    // Insert negative profiles
    for (const profile of negativeProfiles) {
      const { error } = await supabase
        .from('person_profiles')
        .insert([profile]);
      
      if (error) {
        console.error('Error inserting negative profile:', error);
      } else {
        console.log(`Inserted negative profile: ${profile.identifier}`);
      }
    }

    // Insert positive profiles
    for (const profile of positiveProfiles) {
      const { error } = await supabase
        .from('person_profiles')
        .insert([profile]);
      
      if (error) {
        console.error('Error inserting positive profile:', error);
      } else {
        console.log(`Inserted positive profile: ${profile.identifier}`);
      }
    }

    // Insert negative reviews
    for (const review of negativeReviews) {
      const { error } = await supabase
        .from('reviews')
        .insert([review]);
      
      if (error) {
        console.error('Error inserting negative review:', error);
      } else {
        console.log(`Inserted negative review for: ${review.person_identifier}`);
      }
    }

    // Insert positive reviews
    for (const review of positiveReviews) {
      const { error } = await supabase
        .from('reviews')
        .insert([review]);
      
      if (error) {
        console.error('Error inserting positive review:', error);
      } else {
        console.log(`Inserted positive review for: ${review.person_identifier}`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// Run the seeding function
seedDatabase();
