const extractJson = async (text) => {
  if (!text) return null;

  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  const firstBrace = cleaned.indexOf("{");
  const secondBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || secondBrace === -1) {
    return null;
  }

  const jsonString = cleaned.slice(firstBrace, secondBrace + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return null;
  }
};

export default extractJson;