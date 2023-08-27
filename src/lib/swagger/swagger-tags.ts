export const SWAGGER_TAGS = [
    { name: 'Whatsapp-Client', description: '' },
];


export function getTagName(key: string): string {
    const found = SWAGGER_TAGS.find(t => t.name.toLowerCase() === key.toLowerCase());

    if (!found) throw new Error(`Swagger tag <${key}> not found!`);
    return found.name;
}
