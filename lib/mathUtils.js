export function standardDeviation(values) {
    const avg = average(values);

    const squareDiffs = values.map(function(value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    const avgSquareDiff = average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

export function average(data) {
    const sum = data.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    const avg = sum / data.length;
    return avg;
}

export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}