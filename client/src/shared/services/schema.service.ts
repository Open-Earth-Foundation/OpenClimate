export const schemaService = {
    getSchema,
    getSchemasByCategory
};

function getSchema(schemaCategory: string, schemaType: string)
{
    return fetch(`http://localhost:3001/api/schema?category=${schemaCategory}&type=${schemaType}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
}


function getSchemasByCategory(schemaCategory: string)
{
    return fetch(`http://localhost:3001/api/schemas?category=${schemaCategory}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
}

