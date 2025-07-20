// utils/generateTournamentName.ts

/**
 * Generates a descriptive tournament name based on the current date.
 * @returns A string with a generated tournament name (e.g., "Sunday Badminton Showdown").
 */
export function generateTournamentName(): string {
  const now = new Date()

  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  const dayOfWeek = days[now.getDay()]
  const month = months[now.getMonth()]
  const date = now.getDate()

  // A list of creative templates for the tournament names
  const nameTemplates = [
    `${dayOfWeek} Badminton Showdown`,
    `Guna Weekend Clash - ${month} ${date}`,
    `${month} ${date} Challenge`,
    `SmashScore Daily - ${dayOfWeek}`,
    `${dayOfWeek} Smash Fest`,
  ]

  // Select a random name from the templates array
  const randomIndex = Math.floor(Math.random() * nameTemplates.length)

  return nameTemplates[randomIndex]
}

// --- EXAMPLE USAGE ---

/*
  import { generateTournamentName } from './utils/generateTournamentName';
  
  // In your component, when you open the "Add Tournament" modal,
  // you can pre-fill the name field with a generated name.
  
  const handleOpenAddTournamentModal = () => {
    const newName = generateTournamentName();
    // Now you can set this newName as the default value in your form state.
    console.log(newName); // e.g., "Sunday Badminton Showdown"
  };
  */
