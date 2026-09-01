function convertToSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}


//   Samsaung galaxy s23 (256gb)
//   samsung-galaxy-s23-256gb
module.exports = convertToSlug;