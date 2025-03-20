import { shufflePopulation } from "../../lib/shufflePopulation";

/* Update this code to simulate a simple disease model! */

/* For this simulation, you should model a *real world disease* based on some real information about it.
*
* Options are:
* - Mononucleosis, which has an extremely long incubation period.
*
* - The flu: an ideal model for modeling vaccination. The flu evolves each season, so you can model
    a new "season" of the flu by modeling what percentage of the population gets vaccinated and how
    effective the vaccine is.
* 
* - An emerging pandemic: you can model a new disease (like COVID-19) which has a high infection rate.
*    Try to model the effects of an intervention like social distancing on the spread of the disease.
*    You can model the effects of subclinical infections (people who are infected but don't show symptoms)
*    by having a percentage of the population be asymptomatic carriers on the spread of the disease.
*
* - Malaria: a disease spread by a vector (mosquitoes). You can model the effects of the mosquito population
    (perhaps having it vary seasonally) on the spread of the disease, or attempt to model the effects of
    interventions like bed nets or insecticides.
*
* For whatever illness you choose, you should include at least one citation showing what you are simulating
* is based on real world data about a disease or a real-world intervention.
*/

/**
 * Authors: 
 * 
 * What we are simulating: Joshua S chat GPT exstensive help 
 * Bubonic plauge
 * What we are attempting to model from the real world:
 * Death rate and showing vectors such as the fleas on rats that infected people 
 * What we are leaving out of our model:
 * 
 * What elements we have to add:
 * Death counter (already made) vectors such as fleas on rats that will bite and infect people 
 * What parameters we will allow users to "tweak" to adjust the model:
 * how many vectors (not made yet) Population (already in code) infection chance (already in)
 * In plain language, what our model does:
 * Basically our model will include vectors such as fleas on rats that will bite people and infect them
 * But due to the code already having a set infection in the code we should use this as a multiplyer of sorts as thats how I would see it working
 */


// Default parameters -- any properties you add here
// will be passed to your disease model when it runs.

export const defaultSimulationParameters = {
infectionChance: 30 // For direct infection
,fleaInfectionChance: 50 // Infection chance from fleas
};

/* Creates your initial population. By default, we *only* track whether people
are infected. Any other attributes you want to track would have to be added
as properties on your initial individual. 

For example, if you want to track a disease which lasts for a certain number
of rounds (e.g. an incubation period or an infectious period), you would need
to add a property such as daysInfected which tracks how long they've been infected.

Similarily, if you wanted to track immunity, you would need a property that shows
whether people are susceptible or immune (i.e. succeptibility or immunity) */
export const createPopulation = (size = 1600) => {
  const population = [];
  const sideSize = Math.sqrt(size);
  for (let i = 0; i < size; i++) {
    population.push({
      id: i,
      x: (100 * (i % sideSize)) / sideSize, // X-coordinate within 100 units
      y: (100 * Math.floor(i / sideSize)) / sideSize, // Y-coordinate scaled similarly
      infected: false,
      daysInfected: 0, // Track how many rounds the person has been infected
      dead: false, // Track if the person is dead
      hasFleas: Math.random() < 0.2, // person 20% chance of hosting fleas.
    });
  }
  // Infect patient zero...
  let patientZero = population[Math.floor(Math.random() * size)];
  patientZero.infected = true;
  return population;
};

// Example: Maybe infect a person (students should customize this)
const updateIndividual = (person, contact, params) => {
  // Add some logic to update the individual!
  // For example...
  if (person.infected) {
    // If they were already infected, they are no longer
    // newly infected :)
    person.newlyInfected = false;

    // Increase the days they have been infected
    person.daysInfected += 1;

    // If they've been infected for 5 rounds or more, mark them as dead
    if (person.daysInfected >= 5 && !person.dead) {
      person.dead = true; // Mark them as dead after 5 rounds of infection
    }
  }
  //Flea infect logic
  if(person.hasFleas && person.infected && !contact.dead) {
    if (Math.random() * 100 < params.fleaInfectionChance) {
      contact.infected = true; //flea infects person
      contact.daysInfected = 0; // reset infection duration
    }
  }
  if (contact.infected && !person.infected && !person.dead) {
    if (Math.random() * 100 < params.infectionChance) {
      person.infected = true;
      person.daysInfected = 0; // Reset infection duration when they get infected
    }
  }
};

// Example: Update population (students decide what happens each turn)
export const updatePopulation = (population, params) => {
  // Include "shufflePopulation" if you want to shuffle...
  // population = shufflePopulation(population);
  // Example logic... each person is in contact with the person next to them...
  for (let i = 0; i < population.length; i++) {
    let p = population[i];
    // This logic just grabs the next person in line -- you will want to 
    // change this to fit your model! 
    let contact = population[(i + 1) % population.length];
    // Update the individual based on the contact...
    updateIndividual(p, contact, params);
  }
  return population;
};

// Stats to track (students can add more)
// Any stats you add here should be computed
// by Compute Stats below
export const trackedStats = [
  { label: "Total Infected", value: "infected" },
  { label: "Total Dead", value: "dead" }  // Track the death toll
];

// Example: Compute stats (students customize)
export const computeStatistics = (population, round) => {
  let infected = 0;
  let newlyInfected = 0;
  let dead = 0;

  for (let p of population) {
    if (p.infected) {
      infected += 1; // Count the infected
    }
    if (p.newlyInfected) {
      newlyInfected += 1; // Count the newly infected
    }
    if (p.dead) {
      dead += 1; // Count the dead
    }
  }
  return { round, infected, newlyInfected, dead };
};