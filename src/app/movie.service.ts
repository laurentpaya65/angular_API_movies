import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LienModel } from './models/lien.model';
import { MovieModel } from './models/movie.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private API_URL = environment.TMDB_API_URL;
  private API_KEY = environment.TMDB_API_KEY;
  // /discover/movie?api_key=c004653490a51df6147ac456a1512752&language=fr";
  MOVIE_URL = "https://api.themoviedb.org/3/movie/#id#/videos?api_key=c004653490a51df6147ac456a1512752&language=fr";
  
  
  // subject = observable = flux de données
  movies$ = new BehaviorSubject([]);
  search$ = new BehaviorSubject([]);
  lienVideos$ = new BehaviorSubject([]);
  currentPage:number = 1;

  // const params = new HttpParams( {fromObject : {
  //   api_key : this.API_KEY,
  //   language : 'fr'
  // }});
  // requete Http à l'API 'theMovieDB' pour récupérer 
  // une suggestionde films
  //  ==> retourne un tableau de films en JSON

  /*créer une instance de HttpClient
    on pourra utiliser les méthodes .get(), .post() 
    on le fait dans le constructor par Injection de dépendance
      car cela ne crée qu'une instance poru toute l'appli
  */
/*
    Principe de l'injection de dépendance proposée par Angular (D.I)
    permet de récupérer un membre de notre class qui est une instance d'une autre class
    (https://angular.io/guide/dependency-injection)
  */
  constructor(private http:HttpClient) {  }

  // **************************************************
  // renvoie une liste de film mappée avec MovieModel
  getMoviesFromApi() {
    const params = new HttpParams( {fromObject : {
      api_key : this.API_KEY,
      language : 'fr',
      page: this.currentPage.toString()
    }});
    // params.set(param)
    console.log(params);

    this.http
    // objet HttpParams
    .get(this.API_URL+"/discover/movie", {params})
    // .pipe() manipuler la réponse
    .pipe( map( 
            (data:any) => data.results.map( 
                movie => new MovieModel(movie.title,
                                        movie.overview,
                                        movie.backdrop_path,
                                        movie.release_date,
                                        movie.id,
                                        movie.vote_average
       )  )     )        )
    .subscribe( res => {
        // console.log(res);
        // source de données
        // .next charge la donnée movies$
        let movies = this.movies$.getValue();
        this.movies$.next([...movies, ...res]);
        console.log([...movies, ...res]);
     } )
  }

  // **************************************************
  // renvoie les pages suivantes
  getNextMoviesFromApi() {
    this.currentPage++;
    this.getMoviesFromApi();
  }

  // **************************************************
  // recherche des films sur un texte
  searchMoviesFromApi(searchText:string) {
    const params = new HttpParams( {fromObject : {
      api_key : this.API_KEY,
      language : 'fr',
      query: searchText
    }});
    // params.set(param)
    console.log(params);

    this.http
    // objet HttpParams
    .get(this.API_URL+"/search/movie", {params})
    // .pipe() manipuler la réponse
    .pipe( map( 
            (data:any) => data.results.map( 
                movie => new MovieModel(movie.title,
                                        movie.overview,
                                        movie.backdrop_path,
                                        movie.release_date,
                                        movie.id,
                                        movie.vote_average
       )  )     )        )
    .subscribe( res => {
        console.log(res);
        // source de données
        // .next charge la donnée movies$
        // let movies = this.movies$.getValue();
        this.search$.next(res);
        // console.log([...movies, ...res]);
     } )
  }  
  
  // ************** perso **********************
  // renvoie des liens video mappés avec LienModel
  getMovieFromApi(id:number) {
    // console.log(this.MOVIE_URL.replace('#id#',id.toString() ));

    this.http
    .get(this.MOVIE_URL.replace('#id#',id.toString() ) )
    // .get(this.API_URL+"/movie/"+id.toString()+"/videos",{params} )
    // .pipe() manipuler la réponse
    .pipe( map( (data:any) => data.results.map( 
                             video => new LienModel(video.name, video.key   )
                                               ) 
        )    )
    .subscribe( res => {
        console.log('lienvideo dans Http=',res); 
        // source de données
        // .next charge la donnée movies$
        this.lienVideos$.next(res);
     } )
  }
  
  
}
