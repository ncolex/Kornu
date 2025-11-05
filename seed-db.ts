import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { getSupabase } from './supabase/supabaseClient.ts';

const supabase = getSupabase();

async function seedDatabase() {
  console.log('Starting to seed the database with test data...');

  try {
    // Test data for profiles
    const profiles = [
      // Negative
      { identifiers: ['Juan Perez', 'juan.perez.scammer', '+5491123456789'], country: 'Argentina', total_score: -10, reputation: 'RISK' },
      { identifiers: ['Maria Garcia', 'maria.garcia.cheater', '+5491198765432'], country: 'Mexico', total_score: -8, reputation: 'RISK' },
      { identifiers: ['Carlos Rivera', 'carlos.rivera.fraud', '+5491155566677'], country: 'Colombia', total_score: -12, reputation: 'RISK' },
      { identifiers: ['Ana Lopez', 'ana.lopez.betrayer', '+5491188877766'], country: 'Spain', total_score: -7, reputation: 'RISK' },
      { identifiers: ['Pedro Diaz', 'pedro.diaz.toxic', '+5491144455566'], country: 'Chile', total_score: -9, reputation: 'RISK' },
      // Positive
      { identifiers: ['Laura Santos', 'laura.santos.helpful', '+5491112345678'], country: 'Argentina', total_score: 10, reputation: 'POSITIVE' },
      { identifiers: ['Diego Fuentes', 'diego.fuentes.reliable', '+5491199988877'], country: 'Mexico', total_score: 8, reputation: 'POSITIVE' },
      { identifiers: ['Valentina Ruiz', 'valentina.ruiz.kind', '+5491133344455'], country: 'Colombia', total_score: 12, reputation: 'POSITIVE' },
      { identifiers: ['Felipe Mendoza', 'felipe.mendoza.honest', '+5491166677788'], country: 'Spain', total_score: 7, reputation: 'POSITIVE' },
      { identifiers: ['Camila Rodriguez', 'camila.rodriguez.supportive', '+5491122233344'], country: 'Chile', total_score: 9, reputation: 'POSITIVE' },
    ];

    // Insert profiles and get their IDs
    const insertedProfiles = [];
    for (const profile of profiles) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting profile:', error);
      } else {
        console.log(`Inserted profile: ${profile.identifiers[0]}`);
        insertedProfiles.push(data);
      }
    }

    // Test data for reviews
    const reviews = [
      // Negative
      { profile_id: insertedProfiles[0].id, category: 'THEFT', text: 'Robó dinero de la cooperativa y se negó a devolverlo.', score: -4, pseudo_author: 'ConcernedCitizen', reviewer_contact_info: { email: 'test1@example.com', instagram: '@test1', phone: '+5491122233344' } },
      { profile_id: insertedProfiles[0].id, category: 'BETRAYAL', text: 'Traicionó la confianza de su mejor amigo al revelar secretos personales.', score: -3, pseudo_author: 'TruthSeeker', reviewer_contact_info: { email: 'test2@example.com', instagram: '@test2', phone: '+5491133344455' } },
      { profile_id: insertedProfiles[0].id, category: 'TOXIC', text: 'Constantemente humillaba a sus compañeros de trabajo.', score: -2, pseudo_author: 'WorkColleague', reviewer_contact_info: { email: 'test3@example.com', instagram: '@test3', phone: '+5491144455566' } },
      { profile_id: insertedProfiles[1].id, category: 'INFIDELITY', text: 'Fue infiel a su pareja con múltiples personas durante su relación.', score: -3, pseudo_author: 'ExPartner', reviewer_contact_info: { email: 'test4@example.com', instagram: '@test4', phone: '+5491155566677' } },
      { profile_id: insertedProfiles[1].id, category: 'TOXIC', text: 'Tenía una personalidad muy tóxica, manipuladora y controladora.', score: -2, pseudo_author: 'CloseFriend', reviewer_contact_info: { email: 'test5@example.com', instagram: '@test5', phone: '+5491166677788' } },
      // Positive
      { profile_id: insertedProfiles[5].id, category: 'POSITIVE', text: 'Fue de gran ayuda cuando tuve problemas económicos.', score: 2, pseudo_author: 'GratefulPerson', reviewer_contact_info: { email: 'test15@example.com', instagram: '@test15', phone: '+5491166677788' } },
      { profile_id: insertedProfiles[5].id, category: 'POSITIVE', text: 'Siempre dispuesta a ayudar a los demás sin esperar nada a cambio.', score: 2, pseudo_author: 'Neighbor', reviewer_contact_info: { email: 'test16@example.com', instagram: '@test16', phone: '+5491177788899' } },
      { profile_id: insertedProfiles[6].id, category: 'POSITIVE', text: 'Cumple siempre con sus compromisos y es muy responsable.', score: 2, pseudo_author: 'BusinessPartner', reviewer_contact_info: { email: 'test18@example.com', instagram: '@test18', phone: '+5491199900011' } },
      { profile_id: insertedProfiles[7].id, category: 'POSITIVE', text: 'Una persona maravillosa, siempre con una palabra amable.', score: 2, pseudo_author: 'CommunityMember', reviewer_contact_info: { email: 'test20@example.com', instagram: '@test20', phone: '+5491111122233' } },
      { profile_id: insertedProfiles[8].id, category: 'POSITIVE', text: 'Extremadamente honesto, incluso cuando le perjudica.', score: 2, pseudo_author: 'Customer', reviewer_contact_info: { email: 'test24@example.com', instagram: '@test24', phone: '+5491155566677' } },
    ];

    // Insert reviews
    for (const review of reviews) {
      const { error } = await supabase
        .from('reviews')
        .insert([review]).select();
      
      if (error) {
        console.error('Error inserting review:', error);
      } else {
        console.log(`Inserted review for profile_id: ${review.profile_id}`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

// Run the seeding function
seedDatabase();