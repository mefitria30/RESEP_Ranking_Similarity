function cosineSimilarity ( vecA, vecB )
{
    let dot = 0, normA = 0, normB = 0;
    for ( let i = 0; i < vecA.length; i++ )
    {
        dot += vecA[ i ] * vecB[ i ];
        normA += vecA[ i ] * vecA[ i ];
        normB += vecB[ i ] * vecB[ i ];
    }
    return dot / ( Math.sqrt( normA ) * Math.sqrt( normB ) );
}

function rankingSimilarity ( dataset, namaResep, topN = 9, alpha = 0.7 )
{
    const target = dataset.find( r => r.nama_resep === namaResep );
    if ( !target )
    {
        throw new Error( `Resep '${ namaResep }' tidak ditemukan` );
    }

    const vTargetBahan = target.vector_bahan;
    const vTargetText = target.vector_text;

    const hasil = dataset.map( r =>
    {
        const simBahan = cosineSimilarity( vTargetBahan, r.vector_bahan );
        const simText = cosineSimilarity( vTargetText, r.vector_text );
        const similarity = alpha * simBahan + ( 1 - alpha ) * simText;
        return { ...r, similarity };
    } );

    hasil.sort( ( a, b ) => b.similarity - a.similarity );
    return hasil.slice( 0, topN );
}

// Contoh: load dataset JSON
function cariResep ( namaResep )
{
    return fetch( "/static/recipe_vectors.json" )
        .then( res => res.json() )
        .then( dataset => rankingSimilarity( dataset, namaResep, 9, 0.7 ) );
}
