import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
    if (request.method === 'POST') {
        const { ALL_TOKEN } = process.env
        const { ITEM_TYPE } = process.env
        const TOKEN = ALL_TOKEN;
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: ITEM_TYPE, // ID do Model de "Communities" criado pelo Dato
            ...request.body,
            // title: "Comunidade de Teste",
            //  imageUrl: "https://github.com/anajur.png",
            //  creatorSlug: "anajur"
        })

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })
}