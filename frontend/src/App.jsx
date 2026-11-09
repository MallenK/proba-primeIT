import { useState } from 'react'
import { tvService } from './services/tvService';
import { formateDate } from './utils/dateUtils';  

import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [shows, setShows] = useState([])
  const [selectedShow, setSelectedShow] = useState(null)
  const [selectedCastShowDetails, setSelecteCastdShowDetails] = useState(null)
  const [selectedSeasonsShowDetails, setSelecteSeasonsShowDetails] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)



  // controlar la busqueda de shows
  const handleSearch = async (e) => {
    e.preventDefault()

    if (!query.trim())  return;


    //console.log('Buscando shows con el término:', query)
    setLoading(true)
    setError(null)
    setHasSearched(true)
    setSelectedShow(null) // Reset selected show when performing a new search

    try {
      const data = await tvService.searchShows(query);
      //console.log('Shows encontrados:', data); // Log the found shows
      setShows(data)
    } catch (err) {
      setError(err.message)
      console.error('Error al buscar shows:', err); // Log the error
      setShows([])
    } finally {
      setLoading(false)
    }
  }
    


  // Manejar click en un show para ver detalles
  const handleSelectShow = async (id) => {
    //console.log('Buscando detalles del show con ID:', id)
    setLoading(true)
    setError(null)

    try {
      const data = await tvService.getShowById(id);
      const castData = await tvService.getShowCastById(id);
      // const episodesData = await tvService.getShowEpisodesById(id);
      //console.log('Cast del show:', castData); // Log the cast data
      // //console.log('Episodios del show:', episodesData); // Log the episodes data
      setSelecteCastdShowDetails(castData.data)
      const seasonsData = await tvService.getSeasonsByShowId(id);
      //console.log('Temporadas del show:', seasonsData); // Log the seasons data
      setSelecteSeasonsShowDetails(seasonsData.data)
      //console.log('Detalles del show:', data); // Log the show details
      setSelectedShow(data)
    } catch (err) {
      setError(err.message)
      setSelectedShow(null)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera */}
        <header className="text-center mb-8 detailsHeaderDiv">
          <h1 className="text-3xl font-extrabold text-red-600 mb-2">Buscador de Series TVMaze</h1>
        </header>

        {/* Si estamos viendo el detalle de una serie */}
        {selectedShow ? (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 divSearcherAndBottom2">
            <div className='divSearcherBottom'>
            <button
              onClick={() => setSelectedShow(null)}
              className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition backButton"
            >
              ← Volver a los resultados
            </button>
            </div>

            <div className='divSearcherBottom'>
                <div className="flex flex-col md:flex-row gap-8 detailsMainDiv">
                {selectedShow.data.image?.original && (
                  <img
                    src={selectedShow.data.image?.original || selectedShow.image?.medium || 'https://via.placeholder.com/210x295?text=No+Image'}
                    alt={selectedShow.data.name}
                    className="w-full md:w-72 h-auto object-cover rounded-lg shadow-md"
                  />
                )}
                <div className='divMainTextArea'>
                  <h2 className="text-2xl font-bold mb-4">{selectedShow.data.name}</h2>
                  { selectedShow.data.genres?.length > 0 && ( <p className="mb-4"><strong>Géneros:</strong> {selectedShow.data.genres?.join(', ') || 'N/D'}</p> ) }
                  { selectedShow.data.rating?.average != null && ( <p className="mb-4"><strong>Rating:</strong> {selectedShow.data.rating.average}</p> ) }
                  { selectedShow.data.language && ( <p className="mb-4"><strong>Idioma:</strong> {selectedShow.data.language || 'N/D'}</p> ) }
                  { selectedShow.data.status && ( <p className="mb-4"><strong>Estado:</strong> {selectedShow.data.status || 'N/D'}</p> ) }
                  { selectedShow.data.premiered && ( <p className="mb-4"> <strong>Estreno: </strong> {formateDate(selectedShow.data.premiered) || 'N/D'} </p>)}
                  { selectedShow.data.ended && ( <p className="mb-4"> <strong>Finalización: </strong> {formateDate(selectedShow.data.ended) || 'N/D'} </p>)}
                  { selectedShow.data.officialSite && ( <p className="mb-4"><strong>Sitio web:</strong> {selectedShow.data.officialSite ? <a href={selectedShow.data.officialSite} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedShow.data.officialSite}</a> : 'N/D'}</p>)}
      
                  { selectedShow.data.summary && ( <p className="mb-4"><strong>Resumen:</strong> <span dangerouslySetInnerHTML={{ __html: selectedShow.data.summary || 'N/D' }} /></p> ) }

                  
                </div>
              </div>
            </div>



            {selectedCastShowDetails?.some(
              (castMember) => castMember.person?.image?.medium
            ) && (
            <div className="mt-8 divCast">
              <h3 className="text-xl font-semibold mb-4">Reparto:</h3>
              {selectedCastShowDetails && selectedCastShowDetails.length > 0 ? (
                <ul className="list-disc list-inside divCastBox">
                  {selectedCastShowDetails.filter((castMember) => castMember.person?.image?.medium).map((castMember) => (
                    <li className="divCastMember" key={castMember.person?.id || castMember.character?.id || castMember.character?.name || castMember.person?.name || castMember.person?.image}>
                      <p><strong>{castMember.character?.name || 'N/D'}</strong></p>
                      {castMember.person?.image?.medium && (
                        <img
                          src={castMember.person.image.medium}
                          alt={castMember.person.name}
                          className="w-16 h-16 object-cover rounded-full ml-2"
                        />
                      )}
                      <p> {castMember.person?.name || 'N/D'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay información de reparto disponible.</p>
              )}
            </div>
            )}



            <div className="mt-8 divSeasons">
              <h3 className="text-xl font-semibold mb-4 seasonTitle">Temporadas:</h3>
              {selectedSeasonsShowDetails && selectedSeasonsShowDetails.length > 0 ? (
                <ul className="list-disc list-inside divSeasonsBox">
                  {selectedSeasonsShowDetails.map((season) => (
                    <li className="season" key={season.id}>
                      <div className="seasonImageContainer">
                        {season.image?.medium ? (
                          <img
                            src={season.image.medium}
                            alt={`Temporada ${season.number}`}
                            className="seasonImage"
                          />
                        ) : (
                          <div className="noSeasonImage"></div>
                        )}
                      </div>

                        {season.number >= 1 ? (
                          <div className="seasonTextContainer">
                            <p className="seasonTitle">Temporada {season.number}</p>
                            <p className="seasonEpisodes">Episodios: {season.episodeOrder || 'N/D'}</p>
                            <p className="seasonPremiere">Estreno: {formateDate(season.premiereDate) || 'N/D'}</p>
                            <p className="seasonEnd">Finalización: {formateDate(season.endDate) || 'N/D'}</p>
                            { season.summary && (
                              <p className="seasonSummary">Información adicional: {season.summary ? <span dangerouslySetInnerHTML={{ __html: season.summary }} /> : 'N/D'}</p>
                            )}
                          </div>
                        ) : (
                          <div className="noSeasonInfo">Sin info</div>
                        )}

                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay información de temporadas disponible.</p>
              )}
            </div>  



          </div>
        
        ) : (
          /* Vista de Búsqueda y Listado */
          <>
            <form onSubmit={handleSearch} className="flex gap-3 justify-center mb-8 bg-red p-6 rounded-xl shadow-md detailsContainer">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca una serie (ej. Friends, Breaking Bad...)"
                className="px-4 py-3 border border-gray-300 rounded-xl w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 searcher"
              />
              <button          
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition botoEnviar"
              >
                Buscar
              </button>
            </form>

            {/* Estado de Carga */}
            {loading &&
            <div className="divLoader">
              <p className="text-center text-blue-600 font-medium py-30 loader loaderSearcher"></p>
            </div> }

            {/* Estado de Error */}
            {error && <p className="text-center text-red-500 font-medium py-10">{error}</p>}

            {/* Estado sin resultados */}
            {hasSearched && !loading && !error && shows.length === 0 && (
              <p className="text-center text-gray-500 py-10 emtyResponse">No se han encontrado series con ese término.</p>
            )}

            {/* Listado en Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 divResults">
              {shows.map((show) => (
                //console.log('Renderizando show:', show), // Log each show being rendered
                <div
                  key={show.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition divSingleResult"
                  onClick={() => handleSelectShow(show.id)}
                >
                  {show.image?.medium ? (
                    <img
                      src={show.image.medium}
                      alt={show.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                      Sin Imagen
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{show.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Puntuación: {show.rating?.average || 'N/D'}
                    </p>                    
                    <br></br>
                    <p className="text-gray-600 text-sm">
                      Géneros: {show.genres?.join(', ') || 'N/D'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
          </>
        )        
        
        }

      </div>



      
    </div>




  );
}

export default App;