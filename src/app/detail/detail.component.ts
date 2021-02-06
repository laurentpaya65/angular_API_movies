import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieModel } from '../models/movie.model';
import { MovieService } from '../movie.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LienModel } from '../models/lien.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  // MOVIE_URL = "https://api.themoviedb.org/3/movie/#id#/videos?api_key=c004653490a51df6147ac456a1512752&language=fr";
  movieid:number; 
  type:string;
  movie:MovieModel;
  liensVideo:LienModel[];
  dangerousVideoUrl:string;
  videoUrl:SafeResourceUrl;
  /*
    injecter un OBJET de la classe ActivatedRoute
    permet de récupérer les paramètres de l'URL
  */
  constructor(private route:ActivatedRoute,
              private ms:MovieService,
              private http:HttpClient,
              private sanitizer: DomSanitizer,
              private router:Router ) { }

  ngOnInit(): void {
    //  récupération id
    this.movieid = this.route.snapshot.params.id;
    this.type = this.route.snapshot.params.type;
    // récupérer les infos d'un movie
    if ( this.type == 'movies') { 
      this.movie = this.ms.movies$.getValue()
            .find( x => x.id == this.movieid);
      console.log('id Detail', this.movie);
    } else {
      this.movie = this.ms.search$.getValue()
            .find( x => x.id == this.movieid);
      console.log('id Detail', this.movie);
    }

    // pour affichage des video
    console.log('id passé à lienVideo',this.movieid);
    console.log('this.liensVideo avant', this.liensVideo);
    this.ms.getMovieFromApi(this.movieid);
    this.ms.lienVideos$.subscribe(
      data => this.liensVideo = data
    );
    console.log('this.liensVideo apres', this.liensVideo);
  }

  // getMovieFromApi() {
  //   console.log(this.MOVIE_URL.replace('#id#',this.movieid.toString() ));

  //   this.http
  //   .get(this.MOVIE_URL.replace('#id#',this.movieid.toString() ) )
  //   // .pipe() manipuler la réponse
  //   .pipe( map( (data:any) => data.results.map( video => video.key) ) )
  //   .subscribe( res => {
  //       console.log(res);
  //       // source de données
  //       // .next charge la donnée movies$
  //       this.liensVideo = res;
  //    } )
  // }
  printLienVideo(video:LienModel):SafeResourceUrl {
    // console.log('https://www.youtube.com/embed/'+video.key);
    this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + video.key;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
    return this.videoUrl;
  }

  gotToRootPage() {
    this.ms.search$.next([0]);
    this.router.navigate(["/"]);
  }

}
