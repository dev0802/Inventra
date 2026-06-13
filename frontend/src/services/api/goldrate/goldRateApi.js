export const setGoldRateApi = async (goldRateData) => {
  try {
    const response = await fetch(process.env.REACT_APP_API_GOLD_RATE_SET, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(goldRateData),
    });

    if (!response.ok) {
        throw new Error("Failed to set gold rate");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in goldRateApi:", error);
    throw error;
  }
};

export const getLatestGoldRateApi = async () => {
    try{
        const response = await fetch(process.env.REACT_APP_API_GOLD_RATE_LATEST);
        if (!response.ok) {
            throw new Error("Failed to fetch latest gold rate");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getLatestGoldRateApi:", error);
        throw error;
    }
};

export const getGoldRateByDateApi = async (date) => {
    try {
        const url = process.env.REACT_APP_API_GOLD_RATE_BY_DATE.replace(":date", date);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch gold rate by date");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getGoldRateByDateApi:", error);
        throw error;
    }
};
