const APIURL = 'http://127.0.0.1:8000/api';

export const tvService = {
    searchShows: async (query) => {
        if (!query?.trim()) return [];

        const targetUrl = `${APIURL}/shows/search?q=${encodeURIComponent(query)}`;
        //console.log('searchShows URL:', targetUrl); // Log the URL being fetched

        try {
            const response = await fetch(targetUrl);
            const data = await response.json();
            //console.log('Datos recibidos:', data); // Log the received data
            //console.log('Estado de respuesta:', response.status); // Log the response status

            if (!response.ok) {
                throw new Error('Error fetching shows');
            }

            if (data && Array.isArray(data.data)) {
                //console.log('Resultado de la busqueda (data.data):', data.data);
                return data.data;
            } else {
                console.warn('La respuesta no tiene la propiedad "data" o no es un array:', data);
                return [];
            }

        } catch (error) {
            console.error('Error searching shows:', error);
            throw error;
        }
    },

    getShowById: async (id) => {
        const targetUrl = `${APIURL}/shows/${id}`;
        //console.log('URL:', targetUrl);

        try {
            const response = await fetch(targetUrl);
            const data = await response.json();
            //console.log('Datos recibidos:', data); // Log the received data
            //console.log('Estado de respuesta:', response.status); // Log the response status

        if (!response.ok) {
            throw new Error('Error fetching shows');
        }

        return data;
        } catch (error) {
            console.error('Error fetching show by ID:', error);
            throw error;
        }
    },


    getShowCastById: async (id) => {
        const targetUrl = `${APIURL}/shows/${id}/cast`;
        //console.log('getShowCastById URL:', targetUrl);

        try {
            const response = await fetch(targetUrl);
            const data = await response.json();

            //console.log('Datos recibidos (cast):', data);
            //console.log('Estado de respuesta (cast):', response.status);

            if (!response.ok) {
                throw new Error('Error fetching show cast');
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching show cast by ID:', error);
            throw error;
        }
    },  



    getSeasonsByShowId: async (id) => {
        const targetUrl = `${APIURL}/shows/${id}/seasons`;
        //console.log('getSeasonsByShowId URL:', targetUrl);

        try {
            const response = await fetch(targetUrl);
            const data = await response.json();
            //console.log('Datos recibidos (seasons):', data);
            //console.log('Estado de respuesta (seasons):', response.status);

            if (!response.ok) {
                throw new Error('Error fetching show seasons');
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching show seasons by ID:', error);
            throw error;
        }   
    },

}


    