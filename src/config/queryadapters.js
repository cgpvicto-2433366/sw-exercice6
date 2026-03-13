export const adaptQuery = (query, params = []) => {
    if (process.env.USE_MYSQL) {
        return { query, params };
    }

    let i = 1;
    let pgQuery = query.replace(/\?/g, () => `$${i++}`);

    // Ajouter RETURNING id sur les INSERT
    if (pgQuery.trimEnd().toUpperCase().includes('INSERT')) {
        pgQuery += ' RETURNING id';
    }

    return { query: pgQuery, params };
}

export const adaptResult = (resultat) => {
    if (process.env.USE_MYSQL) {
        return resultat[0];
    }
    return resultat.rows;
}