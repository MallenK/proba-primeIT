export const formateDate = (date) =>{
    if (!date) return "N/D";

    const parseDate = new Date(`${date}T00:00:00`)

    if(isNaN(parseDate.getTime())) return 'N/D';

    return parseDate.toLocaleDateString('es-ES')
}