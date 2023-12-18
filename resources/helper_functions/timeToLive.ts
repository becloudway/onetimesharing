const generateTTL = () => {
    // Get the current date
    const currentDate = new Date();

    // Add 7 days to the current date
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);

    // Convert the date to a Unix timestamp (in seconds)
    const unixTimestamp = Math.floor(nextWeek.getTime() / 1000);

    return unixTimestamp
}

export default generateTTL;