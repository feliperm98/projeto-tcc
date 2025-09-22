const TRANSLATE_URL = `https://translation.googleapis.com/language/translate/v2`;
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export async function translateTexts(texts: string[]): Promise<string[]> {
    if (!GOOGLE_API_KEY || texts.length === 0) {
        return texts;
    }
    try {
        const response = await fetch(`${TRANSLATE_URL}?key=${GOOGLE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: texts,
                target: 'pt',
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Translation API Error:", errorData);
            throw new Error('Translation API request failed');
        }
        const data = await response.json();
        return data.data.translations.map((t: any) => t.translatedText);
    } catch (error) {
        console.error("Translation failed:", error);
        return texts;
    }
}