/**
 * @file generateGrievanceId.js
 * @description Utility function to generate unique and human-readable IDs for grievances.
 */

/**
 * Generates a unique ID for a grievance.
 * Format: PGS-YYYYMMDD-XXXXX
 * Example: PGS-20231124-54321
 * 
 * It uses the current date and a slice of the current timestamp to ensure uniqueness.
 * 
 * @returns {string} The generated grievance ID.
 */
export default function generateGrievanceId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const t = String(now.getTime()).slice(-5);
  return `PGS-${y}${m}${d}-${t}`;
}
