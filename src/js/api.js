export async function searchYouTube(query) {
  try {
    const response = await fetch(`https://youtube-search-results.p.rapidapi.com/youtube-search/?q=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "youtube-search-results.p.rapidapi.com"
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Something went wrong. Try again later.");
  }
}
