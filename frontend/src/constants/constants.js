export const BASE_URL = "https://ebook.americanseohub.com/api/v1/";
// export const BASE_URL = "http://localhost:4000/api/v1/";
export function replaceCamelCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}
export const capitalizeTitle = (str) => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};
export const WEB_URL = "https://ebook.americanseohub.com";
// export const WEB_URL = "http://localhost:4000";
 
export function detectAndConvertLinks(text) {
  const regex =
    /\b(?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  return text.replace(regex, (match) => {
    // return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, (match) => {
    return `<a href="${match}" class="underline hover:text-blue-500" target="_blank">${match}</a>`;
  });
}

export const getLastAssignedUserByRole = (assignedTo, role) => {
  if (!assignedTo || !Array.isArray(assignedTo)) return null;

  const filtered = assignedTo.filter(a => a.role === role);
  if (filtered.length === 0) return null;

  // Sort by updatedAt DESC to get latest one
  const sorted = filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  return sorted[0]; // latest one
};

export const colors = {
  secondary: "#e14226",
  primary: "#2CB9A8",
  white: "#ffffff",
  lightGray: '#BAC4C9',
  red: 'red',
};

export const companyConstants = {
  companyName: "Bellevue Publishers",
  companyUrl: "https://bellevuepublishers.com/",
  billingEmail: "billing@bellevuepublishers.com",
  phoneNumber: "(877) 251-5759",
  companyAddress: "157 Church st 19th floor New haven, CT 06510 United States",
  cdnLink: "https://bellevue-portal.b-cdn.net/",
};
