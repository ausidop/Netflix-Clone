import React from 'react';
import './HomeScreen.css';
import requests from '../Requests';
import Nav from '../Nav';
import Banner from '../Banner';
import Row from '../Row';

function HomeScreen() {
  return (
    <div className='homeScreen'>
        <Nav />
        <Banner />
        <Row title='NETFLIX ORIGINALS' fetchURL={requests.fetchNetflixOriginals} isLargeRow/> 
        <Row title='Trending Now' fetchURL={requests.fetchTreding} />
        <Row title='Top Rated' fetchURL={requests.fetchTopRated} />
        <Row title='Action Movie' fetchURL={requests.fetchActionMovies} />
        <Row title='Comedy Movie' fetchURL={requests.fetchComedyMovies} />
        <Row title='Horror Movie' fetchURL={requests.fetchHorrorMovies} />
        <Row title='Romance Movie' fetchURL={requests.fetchRomanceMovies} />
        <Row title='Documentaries' fetchURL={requests.fetchDocumentaries} />
    </div>
  )
}

export default HomeScreen