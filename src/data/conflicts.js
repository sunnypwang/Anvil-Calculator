// If two enchantments have the same group number, they conflict with each other
export const conflictGroup = {
  Protection: 0,
  "Fire Protection": 0,
  "Blast Protection": 0,
  "Projectile Protection": 0,
  
  Sharpness: 1,
  "Bane of Arthropods": 1,
  Smite: 1,
  Density: 1, // Density conflicts with damage enchantments on Mace
  Breach: 1, // Breach conflicts with damage enchantments on Mace (Needs verification: Minecraft Wiki says Density, Breach, Smite, and Bane are mutually exclusive)
  
  "Silk Touch": 2,
  Fortune: 2,
  
  "Depth Strider": 3,
  "Frost Walker": 3,
  
  Infinity: 4,
  Mending: 4,
  
  Loyalty: 5,
  Riptide: 5,
  
  Channeling: 6,
  // Riptide: 6, // Duplicate group in original, standardizing
  
  Multishot: 7,
  Piercing: 7,
};
