export const checkGamesAgainstResult = (gameNumbers: number[], resultNumbers: number[]) => {
    const hits = gameNumbers.filter(num => resultNumbers.includes(num));
    const hitCount = hits.length;

    let status = 'Não premiado';
    if (hitCount === 4) status = 'Quadra';
    if (hitCount === 5) status = 'Quina';
    if (hitCount === 6) status = 'Sena';

    return {
        hits,
        hitCount,
        status,
        isWinner: hitCount >= 4
    };
};
